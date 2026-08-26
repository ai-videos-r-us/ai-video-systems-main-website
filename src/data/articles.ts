export interface Article {
  tag: string;
  title: string;
  excerpt: string;
  date: string;
  href: string;
  comingSoon?: boolean;
}

// Latest-articles area. The section renders only when this array has entries —
// add the first real post and it appears automatically. Example shape:
//   {
//     tag: 'Case Study',
//     title: 'How a Funeral Comparison Business Hit a 21% Lead-to-Sale Rate',
//     excerpt: 'One-paragraph teaser shown on the card.',
//     date: '26 Aug 2026',
//     href: '/blog/funeral-case-study',
//   }
export const ARTICLES: Article[] = [];
