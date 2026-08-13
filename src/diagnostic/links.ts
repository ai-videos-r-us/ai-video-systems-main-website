// Configurable via Vite env vars; falls back to the in-site pages added alongside this feature
// (src/pages/Privacy.tsx, src/pages/Terms.tsx) so these links are never dead.
export const PRIVACY_POLICY_URL = (import.meta.env.VITE_PRIVACY_POLICY_URL as string | undefined) || '/privacy';
export const TERMS_URL = (import.meta.env.VITE_TERMS_URL as string | undefined) || '/terms';
