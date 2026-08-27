export interface ClientLogo {
  src: string;
  alt: string;
  /** Intrinsic pixel size — rendered as width/height attributes so every
   *  marquee slot reserves its exact space before the file loads. */
  width: number;
  height: number;
}

// Order matches the logo list supplied for the client bar.
export const CLIENT_LOGOS: ClientLogo[] = [
  { src: '/clients/logo-01.svg', alt: 'Client logo', width: 278, height: 145 },
  { src: '/clients/logo-02.svg', alt: 'PN Digital', width: 791, height: 188 },
  { src: '/clients/logo-03.webp', alt: 'Stonebridge', width: 359, height: 107 },
  { src: '/clients/logo-04.webp', alt: 'Black Sheep Coffee', width: 240, height: 240 },
  { src: '/clients/logo-05.webp', alt: 'Bristol CBD', width: 240, height: 240 },
  { src: '/clients/logo-06.webp', alt: 'Clear Sky', width: 513, height: 240 },
  { src: '/clients/logo-07.webp', alt: 'Credit Ascension', width: 240, height: 240 },
  { src: '/clients/logo-08.webp', alt: 'Gregory Law Financial Planning', width: 1057, height: 207 },
  { src: '/clients/logo-09.webp', alt: 'Home Transformations', width: 240, height: 240 },
  { src: '/clients/logo-10.webp', alt: 'Hearthline Kitchens', width: 240, height: 240 },
  { src: '/clients/logo-11.webp', alt: 'Ironclad Finance', width: 916, height: 240 },
  { src: '/clients/logo-12.webp', alt: 'Lifesum', width: 225, height: 225 },
  { src: '/clients/logo-13.webp', alt: 'Listabl', width: 236, height: 65 },
  { src: '/clients/logo-14.webp', alt: 'Mortgage Fit', width: 184, height: 175 },
  { src: '/clients/logo-15.webp', alt: 'My Lead Machine', width: 240, height: 240 },
  { src: '/clients/logo-16.webp', alt: 'Novus Digital', width: 240, height: 240 },
  { src: '/clients/logo-17.webp', alt: 'Quick Consign', width: 240, height: 240 },
  { src: '/clients/logo-18.webp', alt: 'Straight Up Stays', width: 582, height: 240 },
];

export interface ReviewShot {
  src: string;
  alt: string;
  width: number;
  height: number;
}

// Screenshot proof displayed in the reviews wall. The Lead Gen Engine section
// uses its own five-phone receipts composite instead.
export const REVIEW_SHOTS: ReviewShot[] = [
  {
    src: '/reviews/review-01.webp',
    alt: 'LinkedIn recommendation from Jack Smith, Company Director at Compare Funerals Ltd — “Lead quality is well above what we expected… it has helped us turn a massive corner in our business.”',
    width: 1400,
    height: 286,
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
