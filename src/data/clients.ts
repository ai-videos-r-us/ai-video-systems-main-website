export interface ClientLogo {
  src: string;
  alt: string;
}

// Order matches the logo list supplied for the client bar.
export const CLIENT_LOGOS: ClientLogo[] = [
  { src: '/clients/logo-01.svg', alt: 'Client logo' },
  { src: '/clients/logo-02.svg', alt: 'PN Digital' },
  { src: '/clients/logo-03.webp', alt: 'Stonebridge' },
  { src: '/clients/logo-04.webp', alt: 'Black Sheep Coffee' },
  { src: '/clients/logo-05.webp', alt: 'Bristol CBD' },
  { src: '/clients/logo-06.webp', alt: 'Clear Sky' },
  { src: '/clients/logo-07.webp', alt: 'Credit Ascension' },
  { src: '/clients/logo-08.webp', alt: 'Gregory Law Financial Planning' },
  { src: '/clients/logo-09.webp', alt: 'Home Transformations' },
  { src: '/clients/logo-10.webp', alt: 'Hearthline Kitchens' },
  { src: '/clients/logo-11.webp', alt: 'Ironclad Finance' },
  { src: '/clients/logo-12.webp', alt: 'Client logo' },
  { src: '/clients/logo-13.webp', alt: 'Listabl' },
  { src: '/clients/logo-14.webp', alt: 'Mortgage Fit' },
  { src: '/clients/logo-15.webp', alt: 'My Lead Machine' },
  { src: '/clients/logo-16.webp', alt: 'Novus Digital' },
  { src: '/clients/logo-17.webp', alt: 'Client logo' },
  { src: '/clients/logo-18.webp', alt: 'Straight Up Stays' },
];

export interface ReviewShot {
  src: string;
  alt: string;
  width: number;
  height: number;
}

// Screenshot proof displayed in the reviews wall. review-06 is used inside the
// Lead Gen Engine section as the featured client report instead.
export const REVIEW_SHOTS: ReviewShot[] = [
  {
    src: '/reviews/review-01.webp',
    alt: 'LinkedIn recommendation from Jack Smith, Company Director at Compare Funerals Ltd — “Lead quality is well above what we expected… it has helped us turn a massive corner in our business.”',
    width: 1400,
    height: 286,
  },
  {
    src: '/reviews/review-04.webp',
    alt: 'LinkedIn recommendation from Steve Hallam, Real-Estate Lender at Zenzic Capital — “He very quickly grasped the specific sector of investment banking I work in… I would have no hesitation in recommending his services.”',
    width: 1080,
    height: 343,
  },
  {
    src: '/reviews/review-07.webp',
    alt: 'Instagram comments and WhatsApp messages from qualified mortgage prospects asking how to apply, generated for Ironclad Finance',
    width: 940,
    height: 788,
  },
  {
    src: '/reviews/review-05.webp',
    alt: 'LinkedIn recommendation from Dave Wiltsher, specialist finance broker — “Sean is nothing but professional… sets him heads and tails above most marketers.”',
    width: 1400,
    height: 257,
  },
  {
    src: '/reviews/review-02.webp',
    alt: 'LinkedIn recommendation from Leo Rees-Evans, web design agency founder — “Sean is a really genuine guy who works hard to understand your business.”',
    width: 1080,
    height: 246,
  },
  {
    src: '/reviews/review-03.webp',
    alt: 'LinkedIn recommendation from Sam Curtis, Partner — “The system of having booked appointments is fantastic and saves a lot of time chasing people.”',
    width: 1400,
    height: 243,
  },
];
