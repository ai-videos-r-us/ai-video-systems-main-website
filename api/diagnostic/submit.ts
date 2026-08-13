import type { VercelRequest, VercelResponse } from '@vercel/node';
import { runFullScoring, isHighNeed, getFitBand } from '../../lib/diagnostic/scoring';
import { toPublicResult } from '../../lib/diagnostic/serialize';
import { getPartnerBySlug } from '../../lib/diagnostic/partners';
import { validateSubmission } from '../../lib/server/validation';
import { createAssessment } from '../../lib/server/repository';
import { generateResultToken, hashResultToken } from '../../lib/server/token';
import { sendResultsEmail, sendInternalNotification } from '../../lib/server/email';
import { sendDiagnosticWebhook } from '../../lib/server/webhook';
import { isRateLimited } from '../../lib/server/rate-limit';
import { env, hasSupabaseConfig } from '../../lib/server/env';
import { DIAGNOSTIC_ANALYSIS_URL_LABEL } from '../../lib/diagnostic/cta-copy';

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return (value ?? req.socket?.remoteAddress ?? 'unknown').split(',')[0].trim();
}

function parseBody(req: VercelRequest): unknown {
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return undefined;
    }
  }
  return req.body;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: { category: 'method_not_allowed' } });
  }

  const clientIp = getClientIp(req);
  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: { category: 'rate_limited' } });
  }

  const body = parseBody(req);
  const validation = validateSubmission(body);
  if (!validation.success || !validation.data) {
    return res.status(400).json({ error: { category: 'validation_failed', issues: validation.issues } });
  }

  const payload = validation.data;

  let scoring;
  try {
    scoring = runFullScoring({
      scoredAnswers: payload.scoredAnswers,
      context: payload.context,
      financial: payload.financial,
    });
  } catch {
    return res.status(400).json({ error: { category: 'scoring_failed' } });
  }

  const token = generateResultToken();
  const tokenHash = hashResultToken(token);
  const partner = getPartnerBySlug(payload.attribution.partnerSlug);
  const publicResult = toPublicResult(scoring);

  let assessmentId: string | null = null;
  let persisted = false;

  if (hasSupabaseConfig()) {
    try {
      const { row } = await createAssessment({
        idempotencyKey: payload.idempotencyKey,
        tokenHash,
        context: payload.context,
        scoredAnswers: payload.scoredAnswers,
        financial: payload.financial,
        contact: payload.contact,
        consents: payload.consents,
        attribution: {
          partnerSlug: partner?.slug,
          utmSource: payload.attribution.utmSource,
          utmMedium: payload.attribution.utmMedium,
          utmCampaign: payload.attribution.utmCampaign,
          utmTerm: payload.attribution.utmTerm,
          utmContent: payload.attribution.utmContent,
          referrer: payload.attribution.referrer,
        },
        scoring,
        publicResult,
      });
      assessmentId = row.id;
      persisted = true;
    } catch (err) {
      // Persistence must never block the respondent from seeing their result.
      console.error('diagnostic_persist_failed', err instanceof Error ? err.message : err);
    }
  } else {
    console.warn('diagnostic_submit_without_supabase_config: result will not be durably stored or revisitable');
  }

  const resultUrl = `${env.NEXT_PUBLIC_SITE_URL}/funeral-plan-scale-readiness/results/${token}`;
  const ctaUrl = scoring.ctaVariant === 'primary_deeper_analysis' ? env.DIAGNOSTIC_ANALYSIS_URL : undefined;

  const [emailResult, webhookResult] = await Promise.allSettled([
    sendResultsEmail({
      firstName: payload.contact.firstName,
      workEmail: payload.contact.workEmail,
      resultUrl,
      scoring,
      ctaUrl,
      ctaLabel: DIAGNOSTIC_ANALYSIS_URL_LABEL,
      marketingConsent: payload.consents.marketing,
    }),
    assessmentId
      ? sendDiagnosticWebhook({
          assessmentId,
          contact: payload.contact,
          consents: payload.consents,
          attribution: payload.attribution,
          scoring,
          resultUrl,
        })
      : Promise.resolve({ status: 'not_configured' as const }),
  ]);

  const emailStatus = emailResult.status === 'fulfilled' ? emailResult.value : { status: 'failed' as const };
  const webhookStatus =
    webhookResult.status === 'fulfilled' ? webhookResult.value : { status: 'failed' as const };

  if (assessmentId && persisted) {
    void import('../../lib/server/repository').then(({ updateEmailStatus, updateWebhookStatus }) => {
      void updateEmailStatus(assessmentId!, emailStatus.status === 'sent' ? 'sent' : 'failed', emailStatus.errorCategory);
      if (webhookStatus.status !== 'not_configured') {
        void updateWebhookStatus(assessmentId!, webhookStatus.status, webhookStatus.errorCategory);
      }
    });

    if (isHighNeed(scoring.needScore) && (getFitBand(scoring.fitScore) === 'strong' || getFitBand(scoring.fitScore) === 'priority')) {
      void sendInternalNotification({ scoring, contact: payload.contact, resultUrl });
    }
  }

  return res.status(200).json({
    assessmentId,
    resultToken: token,
    resultUrl,
    persisted,
    emailStatus: emailStatus.status,
    result: publicResult,
    ctaUrl,
  });
}
