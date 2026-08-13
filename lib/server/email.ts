import { Resend } from 'resend';
import { env, hasResendConfig } from './env.js';
import { CLASSIFICATION_BANDS } from '../diagnostic/constants.js';
import { CONSTRAINT_CONTENT } from '../diagnostic/content.js';
import type { FullScoringResult } from '../diagnostic/scoring.js';
import { buildPriorities } from '../diagnostic/priorities.js';
import type { ReadinessClassification } from '../diagnostic/types.js';

export interface SendResultsEmailInput {
  firstName: string;
  workEmail: string;
  resultUrl: string;
  scoring: FullScoringResult;
  ctaUrl?: string;
  ctaLabel?: string;
  marketingConsent: boolean;
}

export interface EmailSendResult {
  status: 'sent' | 'failed';
  errorCategory?: string;
}

function classificationLabel(classification: ReadinessClassification): string {
  return CLASSIFICATION_BANDS.find((b) => b.key === classification)?.label ?? classification;
}

function buildEmailContent(input: SendResultsEmailInput) {
  const { scoring } = input;
  const primary = CONSTRAINT_CONTENT[scoring.constraintDiagnosis.primary.constraintKey];
  const priorities = buildPriorities(scoring);
  const label = classificationLabel(scoring.classification);
  const subject = `Your Funeral Plan Scale Readiness Score: ${scoring.overallReadinessRounded}/100`;

  const text = [
    `Hi ${input.firstName},`,
    '',
    `Your Funeral Plan Scale Readiness Score is ${scoring.overallReadinessRounded}/100 (${label}).`,
    '',
    `What would break first: ${primary.name}`,
    primary.diagnosis,
    '',
    'Your three priorities:',
    ...priorities.map((p) => `${p.order}. ${p.action}`),
    '',
    `View your full confidential report: ${input.resultUrl}`,
    '',
    input.ctaUrl ? `${input.ctaLabel ?? 'Next step'}: ${input.ctaUrl}` : '',
    '',
    'These figures are illustrative guidance based on the information you provided, not a forecast, guarantee or financial advice.',
    '',
    input.marketingConsent
      ? 'You opted in to receive relevant commercial insights from AI Video Systems. Reply to this email at any time to unsubscribe.'
      : '',
    '— AI Video Systems',
  ]
    .filter(Boolean)
    .join('\n');

  const html = `
    <div style="font-family: Inter, Arial, sans-serif; color:#111111; max-width:560px; margin:0 auto;">
      <p>Hi ${escapeHtml(input.firstName)},</p>
      <p>Your <strong>Funeral Plan Scale Readiness Score</strong> is:</p>
      <p style="font-size:32px; font-weight:700; margin:8px 0;">${scoring.overallReadinessRounded}/100</p>
      <p style="color:#606060; margin-top:0;">${escapeHtml(label)}</p>
      <p><strong>What would break first:</strong> ${escapeHtml(primary.name)}</p>
      <p>${escapeHtml(primary.diagnosis)}</p>
      <p><strong>Your three priorities:</strong></p>
      <ol>
        ${priorities.map((p) => `<li>${escapeHtml(p.action)}</li>`).join('')}
      </ol>
      <p>
        <a href="${input.resultUrl}" style="background:#e81b1b; color:#fefefe; padding:12px 20px; text-decoration:none; border-radius:6px; display:inline-block;">
          View your full confidential report
        </a>
      </p>
      ${
        input.ctaUrl
          ? `<p><a href="${input.ctaUrl}">${escapeHtml(input.ctaLabel ?? 'Next step')}</a></p>`
          : ''
      }
      <p style="color:#606060; font-size:12px;">
        These figures are illustrative guidance based on the information you provided, not a forecast, guarantee or financial advice.
      </p>
      ${
        input.marketingConsent
          ? '<p style="color:#606060; font-size:12px;">You opted in to receive relevant commercial insights from AI Video Systems. Reply to this email at any time to unsubscribe.</p>'
          : ''
      }
      <p style="color:#606060; font-size:12px;">AI Video Systems</p>
    </div>
  `;

  return { subject, text, html };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function sendResultsEmail(input: SendResultsEmailInput): Promise<EmailSendResult> {
  if (!hasResendConfig()) {
    return { status: 'failed', errorCategory: 'not_configured' };
  }

  try {
    const resend = new Resend(env.RESEND_API_KEY);
    const { subject, text, html } = buildEmailContent(input);
    const { error } = await resend.emails.send({
      from: env.DIAGNOSTIC_EMAIL_FROM,
      to: input.workEmail,
      subject,
      text,
      html,
    });
    if (error) {
      return { status: 'failed', errorCategory: 'provider_rejected' };
    }
    return { status: 'sent' };
  } catch {
    return { status: 'failed', errorCategory: 'send_exception' };
  }
}

export interface InternalNotificationInput {
  scoring: FullScoringResult;
  contact: { firstName: string; surname: string; company: string; workEmail: string };
  resultUrl: string;
}

/** Optional internal notification, only for High Need + Strong/Priority Fit. Never blocks the respondent flow. */
export async function sendInternalNotification(input: InternalNotificationInput): Promise<void> {
  if (!hasResendConfig() || !env.DIAGNOSTIC_INTERNAL_RECIPIENTS) return;
  try {
    const resend = new Resend(env.RESEND_API_KEY);
    await resend.emails.send({
      from: env.DIAGNOSTIC_EMAIL_FROM,
      to: env.DIAGNOSTIC_INTERNAL_RECIPIENTS.split(',').map((s) => s.trim()),
      subject: `High-fit diagnostic lead: ${input.contact.company}`,
      text: [
        `${input.contact.firstName} ${input.contact.surname} — ${input.contact.company}`,
        input.contact.workEmail,
        `Score: ${input.scoring.overallReadinessRounded}/100 (${input.scoring.classification})`,
        `Need: ${input.scoring.needBand} · Fit: ${input.scoring.fitBand}`,
        input.resultUrl,
      ].join('\n'),
    });
  } catch {
    // Internal notifications are best-effort only.
  }
}
