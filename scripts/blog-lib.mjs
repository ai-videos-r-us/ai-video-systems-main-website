// Shared blog utilities used by prebuild-blog.mjs (homepage teaser manifest) and
// postbuild-blog.mjs (static HTML pages + sitemap + robots + rss + llms).
//
// Single source of truth for blog content = markdown files in content/blog/*.md.
// Nothing here touches the React SPA runtime; it only reads content and produces
// data/HTML at build time.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { marked } from 'marked';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const ROOT = path.resolve(__dirname, '..');
export const CONTENT_DIR = path.join(ROOT, 'content', 'blog');
export const DIST_DIR = path.join(ROOT, 'dist');

// Canonical origin. Matches the www. host used by the existing canonical tags and
// sitemap. Overridable for previews via SITE_URL, but must stay www in production.
export const SITE_URL = (process.env.SITE_URL || 'https://www.aivideosystems.org').replace(/\/+$/, '');
export const SITE_NAME = 'AI Video Systems';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
export const LOGO_URL = `${SITE_URL}/brand/avs-full-logo-black.svg`;
export const ORG_ID = `${SITE_URL}/#organization`;
export const FOUNDER_ID = `${SITE_URL}/#founder`;
export const BLOG_ID = `${SITE_URL}/blog#blog`;

marked.setOptions({ gfm: true, breaks: false });

// Give every heading a stable slug id so posts support jump links ("On this
// page") and answer engines can cite section fragments.
marked.use({
  renderer: {
    heading(text, level) {
      // text is rendered inline HTML: drop tags and entities (e.g. &#39;) so
      // "you don't control" slugs to you-dont-control, matching hand-written
      // "On this page" anchors.
      const id = slugify(String(text).replace(/<[^>]*>/g, '').replace(/&[#\w]+;/g, ''));
      return `<h${level} id="${id}">${text}</h${level}>\n`;
    },
  },
});

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// gray-matter/js-yaml turns an unquoted YYYY-MM-DD into a JS Date; a quoted one
// stays a string. Normalise both to a plain 'YYYY-MM-DD' with no timezone drift.
function toISODate(d) {
  if (!d) return '';
  if (d instanceof Date) return d.toISOString().slice(0, 10);
  const m = String(d).trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : String(d).trim();
}

function displayDate(iso) {
  const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return iso;
  return `${parseInt(m[3], 10)} ${MONTHS[parseInt(m[2], 10) - 1]} ${m[1]}`;
}

export function slugify(s) {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function absImage(v) {
  if (!v) return DEFAULT_OG_IMAGE;
  const s = String(v);
  if (/^https?:\/\//.test(s)) return s;
  return `${SITE_URL}${s.startsWith('/') ? '' : '/'}${s}`;
}

/**
 * Load every publishable post from content/blog.
 * Files starting with "_" (templates) and README.md are ignored, as is any post
 * with `draft: true` in frontmatter (unless includeDrafts is set).
 * Returns posts newest-first.
 */
export function loadPosts({ includeDrafts = false } = {}) {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_') && f.toLowerCase() !== 'readme.md');

  const posts = [];
  const seen = new Set();

  for (const file of files) {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
    const { data, content } = matter(raw);

    if (data.draft && !includeDrafts) continue;
    if (!data.title) {
      console.warn(`[blog] skipping ${file}: missing "title" in frontmatter`);
      continue;
    }
    if (!data.description) {
      console.warn(`[blog] ${file}: no "description" — meta description and cards will be weak`);
    }

    const base = file.replace(/\.md$/, '');
    const slug = data.slug ? slugify(data.slug) : slugify(base.replace(/^\d{4}-\d{2}-\d{2}-/, ''));

    if (seen.has(slug)) {
      console.warn(`[blog] duplicate slug "${slug}" (${file}) — skipping the duplicate`);
      continue;
    }
    seen.add(slug);

    const iso = toISODate(data.date);
    const words = content.split(/\s+/).filter(Boolean).length;

    posts.push({
      slug,
      title: String(data.title),
      description: String(data.description || ''),
      tag: String(data.tag || 'Article'),
      author: String(data.author || 'Sean Munn'),
      dateISO: iso,
      dateDisplay: iso ? displayDate(iso) : '',
      updatedISO: data.updated ? toISODate(data.updated) : iso,
      updatedDisplay: displayDate(data.updated ? toISODate(data.updated) : iso),
      image: absImage(data.image),
      // Relative src for on-page rendering (works on previews); absolute stays in og/JSON-LD.
      imageSrc: data.image
        ? (/^https?:\/\//.test(String(data.image)) ? String(data.image) : `/${String(data.image).replace(/^\/+/, '')}`)
        : '',
      hasHero: Boolean(data.image),
      imageAlt: String(data.imageAlt || data.title),
      noindex: Boolean(data.noindex),
      readingMinutes: Math.max(1, Math.round(words / 200)),
      wordCount: words,
      bodyHtml: marked.parse(content),
      url: `${SITE_URL}/blog/${slug}`,
      path: `/blog/${slug}`,
    });
  }

  posts.sort((a, b) => (a.dateISO < b.dateISO ? 1 : a.dateISO > b.dateISO ? -1 : 0));
  return posts;
}
