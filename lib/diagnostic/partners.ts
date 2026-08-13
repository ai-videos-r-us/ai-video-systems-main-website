export interface PartnerConfig {
  slug: string;
  displayName: string;
  logoPath?: string;
  introCopy?: string;
  active: boolean;
  benchmarkCopy?: string;
  sourceTags?: string[];
}

// Add new partners here. Unrecognised slugs in the ?partner= query param are ignored safely.
export const PARTNERS: PartnerConfig[] = [
  {
    slug: 'open-prepaid',
    displayName: 'Open Prepaid',
    active: true,
  },
];

export function getPartnerBySlug(slug: string | null | undefined): PartnerConfig | null {
  if (!slug) return null;
  const partner = PARTNERS.find((p) => p.slug === slug);
  return partner && partner.active ? partner : null;
}
