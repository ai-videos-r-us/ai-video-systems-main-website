export interface Article {
  tag: string;
  title: string;
  excerpt: string;
  date: string;
  href: string;
  comingSoon?: boolean;
}

// The homepage "Latest Articles" teaser (src/sections/Articles.tsx) renders only
// when this array has entries. It is generated from content/blog/*.md by
// scripts/prebuild-blog.mjs (the single source of truth for posts) — add a
// markdown post and it appears automatically. Do not edit the generated file by
// hand; edit or add posts under content/blog/ instead.
export { ARTICLES } from './articles.generated';
