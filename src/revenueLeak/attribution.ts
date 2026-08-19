export interface Attribution {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  referrer?: string;
  landingPath?: string;
}

/** Reads UTMs off the current URL so a lead can be traced back to the post that sent them. */
export function readAttribution(): Attribution {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const pick = (k: string) => params.get(k) ?? undefined;
  return {
    utmSource: pick('utm_source'),
    utmMedium: pick('utm_medium'),
    utmCampaign: pick('utm_campaign'),
    utmTerm: pick('utm_term'),
    utmContent: pick('utm_content'),
    referrer: document.referrer || undefined,
    landingPath: window.location.pathname + window.location.search,
  };
}
