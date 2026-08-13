import { createHmac } from 'node:crypto';
import { env, hasWebhookConfig } from './env.js';
import type { FullScoringResult } from '../diagnostic/scoring.js';
import { ASSESSMENT_VERSION, CONTENT_VERSION, SCORING_VERSION } from '../diagnostic/constants.js';

export interface WebhookPayloadInput {
  assessmentId: string;
  contact: { firstName: string; surname: string; company: string; workEmail: string; phone?: string };
  consents: { marketing: boolean; research: boolean };
  attribution: Record<string, string | undefined>;
  scoring: FullScoringResult;
  resultUrl: string;
}

export interface WebhookSendResult {
  status: 'sent' | 'failed' | 'not_configured';
  errorCategory?: string;
}

function buildPayload(input: WebhookPayloadInput) {
  return {
    versions: {
      assessment: ASSESSMENT_VERSION,
      scoring: SCORING_VERSION,
      content: CONTENT_VERSION,
    },
    assessmentId: input.assessmentId,
    contact: input.contact,
    consents: input.consents,
    attribution: input.attribution,
    resultUrl: input.resultUrl,
    public: {
      categoryScores: input.scoring.categoryScores,
      overallReadinessRounded: input.scoring.overallReadinessRounded,
      classification: input.scoring.classification,
      dataConfidence: input.scoring.dataConfidence.level,
      primaryConstraint: input.scoring.constraintDiagnosis.primary.constraintKey,
      secondaryConstraint: input.scoring.constraintDiagnosis.secondary.constraintKey,
      ctaVariant: input.scoring.ctaVariant,
    },
    // Hidden qualification fields — for authorised internal processing only, never surfaced publicly.
    internal: {
      needScore: input.scoring.needScore,
      needBand: input.scoring.needBand,
      fitScore: input.scoring.fitScore,
      fitBand: input.scoring.fitBand,
      triggerSeverity: input.scoring.triggerSeverity,
    },
  };
}

export async function sendDiagnosticWebhook(input: WebhookPayloadInput): Promise<WebhookSendResult> {
  if (!hasWebhookConfig()) {
    return { status: 'not_configured' };
  }

  try {
    const payload = buildPayload(input);
    const body = JSON.stringify(payload);
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };

    if (env.DIAGNOSTIC_WEBHOOK_SECRET) {
      const signature = createHmac('sha256', env.DIAGNOSTIC_WEBHOOK_SECRET).update(body).digest('hex');
      headers['X-Diagnostic-Signature'] = `sha256=${signature}`;
    }

    const response = await fetch(env.DIAGNOSTIC_WEBHOOK_URL!, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      return { status: 'failed', errorCategory: `http_${response.status}` };
    }
    return { status: 'sent' };
  } catch {
    return { status: 'failed', errorCategory: 'request_exception' };
  }
}
