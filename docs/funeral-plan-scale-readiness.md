# Funeral Plan Scale Readiness Diagnostic

A B2B diagnostic for funeral-plan providers, groups and directors, integrated into the AI Video
Systems marketing site. Public entry point:

- Landing/wizard: `/funeral-plan-scale-readiness`
- Results (secure, non-indexed): `/funeral-plan-scale-readiness/results/:token`

## Architecture

The site is a Vite + React SPA with no prior backend. This feature adds:

- **`lib/diagnostic/`** — pure, framework-agnostic domain logic (questions, scoring, content,
  financial calculations). Imported by both the frontend and the API functions. No side effects,
  fully unit tested.
- **`lib/server/`** — server-only adapters (Supabase repository, Resend email, HMAC webhook,
  secure token generation/hashing, Zod validation, rate limiting). Never imported from `src/`.
- **`api/diagnostic/`** — Vercel serverless functions (`submit.ts`, `results/[token].ts`,
  `analysis-request.ts`). Vercel auto-detects the `api/` directory alongside the static Vite
  build; no framework change was needed.
- **`src/diagnostic/`** — the frontend: landing page, multi-step wizard, results view, local
  draft persistence, analytics adapter.
- **`supabase/migrations/`** — SQL migration for the `diagnostic_assessments` table.

### Data flow

1. Respondent completes the wizard client-side. Non-PII answers autosave to
   `localStorage` (`fpsrd:v1:draft`) after every change; contact details and consents are
   **never** persisted locally.
2. On "Show My Results", the client POSTs the full payload (answers, financial inputs, contact,
   consents, attribution) to `POST /api/diagnostic/submit`.
3. The server validates the payload (Zod + a check that every scored answer id is one of the
   approved stable ids), then **recalculates every score itself** from `lib/diagnostic/scoring.ts`
   — client-submitted scores are never trusted or even accepted.
4. The server generates a 256-bit result token, stores a SHA-256 hash of it (never the raw
   token), persists the full raw submission + computed result to Supabase, sends the results
   email via Resend, and optionally POSTs a signed webhook — all non-blocking.
5. The server responds immediately with the public result payload, which renders on-screen
   without waiting on email/webhook delivery.
6. Revisiting `/funeral-plan-scale-readiness/results/:token` calls
   `GET /api/diagnostic/results/:token`, which hashes the presented token and looks up the
   stored, precomputed public-result snapshot. Hidden Need/Fit scores are never included in any
   client-facing response — see `lib/diagnostic/serialize.ts`.

### Versioning

`ASSESSMENT_VERSION`, `SCORING_VERSION`, `CONTENT_VERSION` (`lib/diagnostic/constants.ts`) are
stamped on every stored row. If scoring logic changes in future, **do not edit historical rows**:
bump `SCORING_VERSION`, and re-score by reading `raw_scored_answers` / `raw_context` /
`raw_financial_inputs` from the immutable columns and writing a new result (e.g. a new row, or a
`result_version` column if you want in-place history — not implemented in v1, since no rescoring
tool was in scope).

## Local development

```bash
npm install
npm run dev          # marketing site + diagnostic UI at http://localhost:5173
```

The plain `vite` dev server does **not** run the `api/` serverless functions — for those, either:

- `npx vercel dev` (recommended; requires `vercel login` + `vercel link` to this project), or
- deploy to a Vercel preview and test there.

Without Supabase configured, `POST /api/diagnostic/submit` still scores and returns a result (so
the on-screen experience works), but logs a warning and does not persist the submission or make
it revisitable by link — this is intentional so local development never requires a live database.

## Environment variables

See `.env.example`. Nothing is required for the wizard/scoring UI to run locally. For a fully
working deployment you need:

| Variable | Purpose |
|---|---|
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Persistence + secure result revisits |
| `RESEND_API_KEY`, `DIAGNOSTIC_EMAIL_FROM` | Results email |
| `DIAGNOSTIC_ANALYSIS_URL` | External booking link for the primary CTA. If unset, an inline in-page request form is used instead (`api/diagnostic/analysis-request.ts`) |
| `DIAGNOSTIC_WEBHOOK_URL`, `DIAGNOSTIC_WEBHOOK_SECRET` | Optional CRM webhook (HMAC-signed) |
| `DIAGNOSTIC_INTERNAL_RECIPIENTS` | Optional internal alert for High Need + Strong/Priority Fit leads |
| `NEXT_PUBLIC_SITE_URL` | Used to build the result link in emails/webhooks |

The service-role Supabase key and Resend/webhook secrets are **server-only** — read in
`lib/server/env.ts`, never referenced from `src/`, and never sent to the browser.

## Database

Run `supabase/migrations/20260101000000_diagnostic_assessments.sql` against a Supabase Postgres
project (`supabase db push`, or paste into the SQL editor). Row Level Security is enabled with no
public policies — the table is only reachable via the service-role key from server functions.

## Email & webhook behaviour

Both `lib/server/email.ts` and `lib/server/webhook.ts` catch all errors internally and return a
status rather than throwing, so a Resend or webhook outage never prevents the respondent from
seeing their result (`api/diagnostic/submit.ts` uses `Promise.allSettled`). Delivery status is
stored per-assessment (`email_status`, `webhook_status`) for later inspection via the Supabase
dashboard.

## Partners

Add an entry to `lib/diagnostic/partners.ts` (`PARTNERS` array): `slug`, `displayName`, optional
`logoPath`/`introCopy`/`benchmarkCopy`. Visiting `/funeral-plan-scale-readiness?partner=your-slug`
shows restrained co-branding and stores the slug on the submission for attribution. Unknown slugs
are ignored safely (no error, no co-branding). There is no public partner reporting page by
design — use the Supabase table (or the webhook) for partner reporting.

## Changing diagnostic copy safely

- Question wording/options: `lib/diagnostic/questions.ts` (scored) and
  `lib/diagnostic/context-questions.ts` (context). **Do not change an answer `id`** without
  updating `SCORING_VERSION` and considering how it affects already-stored historical rows —
  ids are the stable contract between the client, the validator, and the scoring engine.
- Constraint diagnosis / strengths / risk copy: `lib/diagnostic/content.ts`.
- Priorities generation logic: `lib/diagnostic/priorities.ts`.
- CTA copy per Need/Fit routing outcome: `lib/diagnostic/cta-copy.ts`.

All of the above are plain data/pure functions with their own unit tests in
`lib/diagnostic/__tests__/` — run `npm test` after any change.

## Tests & commands

```bash
npm test          # vitest — 89 tests covering the scoring engine, content invariants, validation
npm run typecheck # tsc --noEmit across both the frontend and the api/ functions
npm run build     # tsc && vite build (production build)
```

Covered by the current suite: category weights sum to 1.0, all 28 question ids exist exactly
once, every answer score is 0/25/50/75/100, min/max-answer boundary scores, classification
boundaries (39/40, 59/60, 74/75, 89/90), unknown-answer rules (including the zero-score special
cases), trigger severity, constraint uplift + primary/secondary + the 5% interconnected rule,
Need Score clamping, every Fit-bearing context option, Data Confidence priority rules, the
financial engine (including zero-denominator protection, suppression, capacity warnings,
conversion-leverage, aged-enquiry recovery), CTA routing, the public-result serializer's
exclusion of hidden Need/Fit fields, and end-to-end Zod payload validation (tamper rejection,
unknown ids, numeric limits, plans-exceed-enquiries).

**Not included in this pass** (documented gap, not silently skipped): browser-automation E2E
tests (Playwright/Cypress) and an automated `axe-core` accessibility scan — the repo had no test
framework at all before this feature, so Vitest was added for the pure-logic and validation
layer, which carries the highest correctness risk (deterministic scoring a commercial promise
depends on). The full wizard flow was manually verified in a live browser end-to-end (see the
"How to verify" section in the handoff), including keyboard-drivable radio/checkbox controls,
focus movement on step change, and the aria-live progress/status regions.

## Privacy & aggregate-data cautions

- Marketing and anonymised-research consent are separate booleans, each defaulting to
  unchecked, each timestamped independently (`consents.marketing` / `consents.research`).
- Never add a public-facing partner or aggregate reporting page without re-checking this file's
  consent columns — `research_consent` gates inclusion in any aggregate export.
- The public result serializer (`lib/diagnostic/serialize.ts`) is the single choke point for
  what a browser can ever see. If you add a new field to `FullScoringResult`, it is **not**
  exposed publicly unless you deliberately add it to `PublicResult`.
