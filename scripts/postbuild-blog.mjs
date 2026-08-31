// Post-build: turn content/blog/*.md into fully static, crawlable HTML.
//
// Runs AFTER `vite build`, writing into dist/ so real files exist on the Vercel
// filesystem. Because Vercel serves existing files before applying the SPA
// rewrite, /blog and /blog/<slug> are served as real HTML — content present in
// the initial response, no JavaScript required. That is what makes posts legible
// to Google and to AI answer engines (ChatGPT, Perplexity, AI Overviews), most of
// which do not execute JS.
//
// Outputs:
//   dist/blog/index.html            blog listing (only when >=1 post)
//   dist/blog/<slug>/index.html     one static page per post
//   dist/blog/rss.xml               RSS feed (only when >=1 post)
//   dist/sitemap.xml                complete sitemap (core pages + posts)
//   dist/robots.txt                 crawl rules + sitemap pointer (AI bots allowed)
//   dist/llms.txt                   plain-text index for AI crawlers
//   dist/about/index.html           static founder/author entity page (from content/about.md)

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import {
  loadPosts, escapeHtml, ROOT, DIST_DIR, SITE_URL, SITE_NAME,
  DEFAULT_OG_IMAGE, LOGO_URL, ORG_ID, FOUNDER_ID, BLOG_ID,
} from './blog-lib.mjs';

const YEAR = new Date().getFullYear();
const BLOG_DESCRIPTION =
  'Field notes on AI content, lead generation and marketing systems for established, founder-led service businesses — from the team behind AI Video Systems.';

// Core indexable pages (kept in sync with the router in src/App.tsx).
const CORE_PAGES = [
  { loc: `${SITE_URL}/`, changefreq: 'weekly', priority: '1.0' },
  { loc: `${SITE_URL}/about`, changefreq: 'monthly', priority: '0.6' },
  { loc: `${SITE_URL}/revenue-leak-calculator`, changefreq: 'monthly', priority: '0.6' },
  { loc: `${SITE_URL}/funeral-plan-scale-readiness`, changefreq: 'monthly', priority: '0.5' },
  { loc: `${SITE_URL}/privacy`, changefreq: 'yearly', priority: '0.1' },
  { loc: `${SITE_URL}/terms`, changefreq: 'yearly', priority: '0.1' },
];

// ---------------------------------------------------------------------------
// Shared markup
// ---------------------------------------------------------------------------

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />`;

const FAVICONS = `<link rel="icon" href="/favicon-48.png" type="image/png" sizes="48x48" />
<link rel="icon" href="/favicon-192.png" type="image/png" sizes="192x192" />
<link rel="icon" href="/brand/avs-favicon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />`;

const STYLE = `<style>
:root{--carbon:#0B0B0D;--action:#E31B23;--cloud:#F4F4F6;--line:rgba(11,11,13,.12)}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:#fff;color:var(--carbon);font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;font-size:18px;line-height:1.7;-webkit-font-smoothing:antialiased}
a{color:var(--action);text-decoration:none}a:hover{text-decoration:underline}
.wrap{max-width:720px;margin:0 auto;padding:0 20px}
.site-header{border-bottom:1px solid var(--line)}
.site-header .bar{max-width:1160px;margin:0 auto;padding:0 20px;display:flex;align-items:center;justify-content:space-between;height:64px}
.site-header img{height:22px;width:auto;display:block}
.site-header nav a{color:var(--carbon);font-size:14px;font-weight:600;margin-left:22px}
.eyebrow{font-family:"IBM Plex Mono",monospace;font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:rgba(11,11,13,.45);margin:0}
main{padding-top:40px}
article h1{font-family:Sora,sans-serif;font-weight:800;font-size:clamp(2rem,5vw,3rem);line-height:1.08;letter-spacing:-.02em;margin:.6rem 0 0}
.byline{font-family:"IBM Plex Mono",monospace;font-size:12.5px;color:rgba(11,11,13,.5);text-transform:uppercase;letter-spacing:.06em;margin:18px 0 0;padding-bottom:26px;border-bottom:1px solid var(--line)}
.prose{margin-top:34px}.prose>*:first-child{margin-top:0}
.prose h2{font-family:Sora,sans-serif;font-weight:700;font-size:1.6rem;line-height:1.2;letter-spacing:-.01em;margin:2.4rem 0 .8rem}
.prose h3{font-family:Sora,sans-serif;font-weight:700;font-size:1.25rem;margin:2rem 0 .6rem}
.prose p{margin:0 0 1.3rem}
.prose ul,.prose ol{margin:0 0 1.3rem;padding-left:1.3rem}.prose li{margin:.4rem 0}
.prose img{max-width:100%;height:auto;display:block;margin:2rem auto;border:1px solid var(--line)}
.prose blockquote{margin:2rem 0;padding:.4rem 0 .4rem 1.3rem;border-left:3px solid var(--action);color:rgba(11,11,13,.75);font-style:italic}
.prose code{font-family:"IBM Plex Mono",monospace;font-size:.9em;background:var(--cloud);padding:.12em .35em;border-radius:3px}
.prose pre{background:var(--carbon);color:#fff;padding:1.1rem 1.2rem;overflow-x:auto;border-radius:6px;margin:0 0 1.5rem}
.prose pre code{background:none;color:inherit;padding:0}
.prose a{text-decoration:underline}
.prose hr{border:0;border-top:1px solid var(--line);margin:2.5rem 0}
.prose table{width:100%;border-collapse:collapse;margin:0 0 1.5rem;font-size:15.5px}
.prose th,.prose td{border:1px solid var(--line);padding:.5rem .7rem;text-align:left}
.cta{margin:48px 0;padding:32px;background:var(--carbon);color:#fff;border-radius:10px}
.cta h3{font-family:Sora,sans-serif;font-size:1.35rem;margin:0 0 .5rem}
.cta p{margin:0 0 1.2rem;color:rgba(255,255,255,.72);font-size:16px}
.cta .btn{display:inline-block;background:var(--action);color:#fff;font-weight:700;padding:14px 26px;border-radius:6px;text-decoration:none}
.site-footer{border-top:1px solid var(--line);margin-top:56px;padding:28px 0;font-size:13.5px;color:rgba(11,11,13,.55)}
.site-footer .bar{max-width:1160px;margin:0 auto;padding:0 20px;display:flex;flex-wrap:wrap;gap:14px;justify-content:space-between}
.site-footer a{color:rgba(11,11,13,.7)}
.index-head{padding:56px 0 4px}
.index-head h1{font-family:Sora,sans-serif;font-weight:800;font-size:clamp(2rem,5vw,2.8rem);margin:.4rem 0 0}
.index-head p.lede{color:rgba(11,11,13,.65);font-size:17px;margin:1rem 0 0}
.post-list{list-style:none;padding:0;margin:34px 0 0}
.post-list li{padding:26px 0;border-top:1px solid var(--line)}
.post-list .meta{font-family:"IBM Plex Mono",monospace;font-size:11.5px;text-transform:uppercase;letter-spacing:.1em;color:rgba(11,11,13,.45);margin:0 0 .5rem}
.post-list a.title{font-family:Sora,sans-serif;font-weight:700;font-size:1.4rem;color:var(--carbon);line-height:1.2;display:block}
.post-list a.title:hover{color:var(--action)}
.post-list .excerpt{margin:.5rem 0 0;color:rgba(11,11,13,.65);font-size:16px}
@media(max-width:640px){body{font-size:17px}}
</style>`;

const HEADER = `<header class="site-header"><div class="bar">
<a href="/" aria-label="AI Video Systems home"><img src="/brand/avs-full-logo-black.svg" alt="AI Video Systems" width="140" height="22" /></a>
<nav><a href="/blog">Blog</a><a href="/about">About</a><a href="/">Home</a></nav>
</div></header>`;

const FOOTER = `<footer class="site-footer"><div class="bar">
<span>&copy; ${YEAR} AI Video Systems Ltd</span>
<span><a href="/">Home</a> &middot; <a href="/blog">Blog</a> &middot; <a href="/about">About</a> &middot; <a href="/privacy">Privacy</a> &middot; <a href="/terms">Terms</a></span>
</div></footer>`;

const CTA = `<aside class="cta">
<h3>Want a system like this installed for your business?</h3>
<p>AI Video Systems installs the AI Content Engine and the Lead Gen Engine for established, founder-led service businesses &mdash; $15m+ in tracked revenue across 96+ clients.</p>
<a class="btn" href="/">See If You Qualify &rarr;</a>
</aside>`;

function shell({ head, body }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
${head}
${FAVICONS}
${FONTS}
${STYLE}
</head>
<body>
${HEADER}
${body}
${FOOTER}
</body>
</html>
`;
}

function jsonLd(obj) {
  return `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;
}

// ---------------------------------------------------------------------------
// Post page
// ---------------------------------------------------------------------------

function renderPost(post) {
  const desc = escapeHtml(post.description);
  const title = escapeHtml(post.title);
  const robots = post.noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large,max-snippet:-1';

  const head = `<title>${title} &mdash; ${SITE_NAME}</title>
<meta name="description" content="${desc}" />
<meta name="author" content="${escapeHtml(post.author)}" />
<meta name="robots" content="${robots}" />
<link rel="canonical" href="${post.url}" />
<meta property="og:type" content="article" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${desc}" />
<meta property="og:url" content="${post.url}" />
<meta property="og:site_name" content="${SITE_NAME}" />
<meta property="og:image" content="${post.image}" />
<meta property="article:published_time" content="${post.dateISO}" />
<meta property="article:modified_time" content="${post.updatedISO}" />
<meta property="article:author" content="${escapeHtml(post.author)}" />
<meta property="article:tag" content="${escapeHtml(post.tag)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${desc}" />
<meta name="twitter:image" content="${post.image}" />
${jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${post.url}#article`,
        isPartOf: { '@id': BLOG_ID },
        mainEntityOfPage: post.url,
        url: post.url,
        headline: post.title,
        description: post.description,
        datePublished: post.dateISO,
        dateModified: post.updatedISO,
        wordCount: post.wordCount,
        keywords: post.tag,
        image: post.image,
        inLanguage: 'en',
        author: { '@type': 'Person', '@id': FOUNDER_ID, name: post.author, url: `${SITE_URL}/about` },
        publisher: {
          '@type': 'Organization',
          '@id': ORG_ID,
          name: SITE_NAME,
          url: `${SITE_URL}/`,
          logo: { '@type': 'ImageObject', url: LOGO_URL },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
          { '@type': 'ListItem', position: 3, name: post.title, item: post.url },
        ],
      },
    ],
  })}`;

  const body = `<main class="wrap">
<p class="eyebrow">${escapeHtml(post.tag)}</p>
<article>
<h1>${title}</h1>
<p class="byline">By <a href="/about">${escapeHtml(post.author)}</a> &middot; <time datetime="${post.dateISO}">${escapeHtml(post.dateDisplay)}</time> &middot; ${post.readingMinutes} min read</p>
<div class="prose">${post.bodyHtml}</div>
</article>
${CTA}
</main>`;

  return shell({ head, body });
}

// ---------------------------------------------------------------------------
// Blog index
// ---------------------------------------------------------------------------

function renderIndex(posts) {
  const head = `<title>Blog &mdash; ${SITE_NAME}</title>
<meta name="description" content="${escapeHtml(BLOG_DESCRIPTION)}" />
<meta name="robots" content="index,follow" />
<link rel="canonical" href="${SITE_URL}/blog" />
<meta property="og:type" content="website" />
<meta property="og:title" content="Blog &mdash; ${SITE_NAME}" />
<meta property="og:description" content="${escapeHtml(BLOG_DESCRIPTION)}" />
<meta property="og:url" content="${SITE_URL}/blog" />
<meta property="og:site_name" content="${SITE_NAME}" />
<meta property="og:image" content="${DEFAULT_OG_IMAGE}" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="alternate" type="application/rss+xml" title="${SITE_NAME} Blog" href="${SITE_URL}/blog/rss.xml" />
${jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': BLOG_ID,
        url: `${SITE_URL}/blog`,
        name: `${SITE_NAME} Blog`,
        description: BLOG_DESCRIPTION,
        inLanguage: 'en',
        publisher: { '@id': ORG_ID },
        blogPost: posts.map((p) => ({
          '@type': 'BlogPosting',
          '@id': `${p.url}#article`,
          headline: p.title,
          description: p.description,
          url: p.url,
          datePublished: p.dateISO,
          dateModified: p.updatedISO,
          author: { '@id': FOUNDER_ID },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
        ],
      },
    ],
  })}`;

  const items = posts
    .map(
      (p) => `<li>
<p class="meta">${escapeHtml(p.tag)} &middot; <time datetime="${p.dateISO}">${escapeHtml(p.dateDisplay)}</time> &middot; ${p.readingMinutes} min read</p>
<a class="title" href="${p.path}">${escapeHtml(p.title)}</a>
<p class="excerpt">${escapeHtml(p.description)}</p>
</li>`
    )
    .join('\n');

  const body = `<main class="wrap">
<div class="index-head">
<p class="eyebrow">AI Video Systems</p>
<h1>The Blog</h1>
<p class="lede">${escapeHtml(BLOG_DESCRIPTION)}</p>
</div>
<ul class="post-list">
${items}
</ul>
</main>`;

  return shell({ head, body });
}

// ---------------------------------------------------------------------------
// About page (founder/author entity page — content/about.md)
// ---------------------------------------------------------------------------

// Must stay in sync with the #founder sameAs list in index.html.
const FOUNDER_SAMEAS = [
  'https://www.linkedin.com/in/sean-munn/',
  'https://www.facebook.com/seanharry.johnmunn',
  'https://www.instagram.com/seanmunn.ai/',
  'https://x.com/sean_H_J_munn',
  'https://www.youtube.com/@Seanmunn.aivideo',
  'https://www.tiktok.com/@itsseanmunn',
];

function loadAbout() {
  const file = path.join(ROOT, 'content', 'about.md');
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, 'utf8'));
  if (!data.title) {
    console.warn('[blog] content/about.md: missing "title" — skipping about page');
    return null;
  }
  return {
    title: String(data.title),
    description: String(data.description || ''),
    updatedISO: data.updated ? String(data.updated).slice(0, 10) : '',
    bodyHtml: marked.parse(content),
  };
}

function renderAbout(about) {
  const title = escapeHtml(about.title);
  const desc = escapeHtml(about.description);
  const url = `${SITE_URL}/about`;
  const image = `${SITE_URL}/sean-headshot.jpg`;

  const head = `<title>${title} &mdash; ${SITE_NAME}</title>
<meta name="description" content="${desc}" />
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1" />
<link rel="canonical" href="${url}" />
<meta property="og:type" content="profile" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${desc}" />
<meta property="og:url" content="${url}" />
<meta property="og:site_name" content="${SITE_NAME}" />
<meta property="og:image" content="${image}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${desc}" />
<meta name="twitter:image" content="${image}" />
${jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${url}#page`,
        url,
        name: about.title,
        description: about.description,
        ...(about.updatedISO ? { dateModified: about.updatedISO } : {}),
        inLanguage: 'en',
        isPartOf: { '@id': ORG_ID },
        mainEntity: { '@id': FOUNDER_ID },
      },
      {
        '@type': 'Person',
        '@id': FOUNDER_ID,
        name: 'Sean Munn',
        jobTitle: 'Founder',
        worksFor: { '@id': ORG_ID },
        url,
        mainEntityOfPage: url,
        image,
        email: 'sean@aivideosystems.org',
        description:
          'Founder of AI Video Systems. 11 years across sales, lead generation and content systems — appointment setting for mortgage brokers, B2B outbound, Web3 go-to-market, and AI video demand generation. $15M+ in tracked revenue across 96+ clients.',
        knowsAbout: [
          'AI video marketing',
          'Demand generation',
          'Lead generation',
          'Paid social advertising',
          'Appointment setting and sales development',
          'Marketing attribution and closed-loop reporting',
          'Founder-led service business growth',
        ],
        sameAs: FOUNDER_SAMEAS,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'About', item: url },
        ],
      },
    ],
  })}`;

  const body = `<main class="wrap">
<p class="eyebrow">AI Video Systems</p>
<article>
<h1>${title}</h1>
<div class="prose">${about.bodyHtml}</div>
</article>
${CTA}
</main>`;

  return shell({ head, body });
}

// ---------------------------------------------------------------------------
// Feeds / crawl files
// ---------------------------------------------------------------------------

function renderSitemap(posts, about) {
  const urls = [
    ...CORE_PAGES.filter((p) => about || p.loc !== `${SITE_URL}/about`)
      .map((p) => ({ loc: p.loc, changefreq: p.changefreq, priority: p.priority })),
  ];
  if (posts.length) {
    urls.push({ loc: `${SITE_URL}/blog`, changefreq: 'daily', priority: '0.8', lastmod: posts[0].updatedISO });
    for (const p of posts) {
      if (p.noindex) continue;
      urls.push({ loc: p.url, changefreq: 'monthly', priority: '0.7', lastmod: p.updatedISO });
    }
  }
  const body = urls
    .map((u) => {
      const lastmod = u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : '';
      return `  <url>
    <loc>${u.loc}</loc>${lastmod}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

function renderRobots() {
  // Permissive by design: AI crawlers (GPTBot, PerplexityBot, ClaudeBot, Google-Extended,
  // etc.) are covered by "User-agent: *" and are intentionally NOT blocked — the whole
  // point of the blog is to be readable by AI and organic search.
  return `User-agent: *
Allow: /
Disallow: /funeral-plan-scale-readiness/results/

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

function renderRss(posts) {
  const items = posts
    .slice(0, 50)
    .map(
      (p) => `    <item>
      <title>${escapeHtml(p.title)}</title>
      <link>${p.url}</link>
      <guid isPermaLink="true">${p.url}</guid>
      <pubDate>${new Date(`${p.dateISO}T09:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeHtml(p.description)}</description>
    </item>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeHtml(SITE_NAME)} Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>${escapeHtml(BLOG_DESCRIPTION)}</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;
}

function renderLlms(posts, about) {
  const lines = [
    `# ${SITE_NAME}`,
    '',
    `> ${SITE_NAME} installs two tailored marketing systems for established, founder-led service businesses: the AI Content Engine (AI content and authority at volume) and the Lead Gen Engine (managed paid ads, landing pages, CRM and closed-loop reporting). $15m+ in tracked revenue across 96+ clients.`,
    '',
    ...(about
      ? ['## About', '', `- [${about.title}](${SITE_URL}/about): ${about.description}`, '']
      : []),
    '## Blog',
    '',
    ...posts.map((p) => `- [${p.title}](${p.url}): ${p.description}`),
    '',
  ];
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

function writeFile(rel, contents) {
  const full = path.join(DIST_DIR, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, contents);
  return rel;
}

function main() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error('[blog] dist/ not found — run `vite build` before postbuild-blog.mjs');
    process.exit(1);
  }

  const posts = loadPosts();
  const about = loadAbout();
  const written = [];

  for (const post of posts) {
    written.push(writeFile(path.join('blog', post.slug, 'index.html'), renderPost(post)));
  }

  if (posts.length) {
    written.push(writeFile(path.join('blog', 'index.html'), renderIndex(posts)));
    written.push(writeFile(path.join('blog', 'rss.xml'), renderRss(posts)));
  }

  if (about) {
    written.push(writeFile(path.join('about', 'index.html'), renderAbout(about)));
  }

  // Always regenerate crawl files so they reflect current content.
  written.push(writeFile('sitemap.xml', renderSitemap(posts, about)));
  written.push(writeFile('robots.txt', renderRobots()));
  written.push(writeFile('llms.txt', renderLlms(posts, about)));

  console.log(`[blog] ${posts.length} post(s) -> ${written.length} file(s) in dist/`);
  if (posts.length) {
    for (const p of posts) console.log(`         /blog/${p.slug}  (${p.dateISO}, ${p.readingMinutes}m)`);
  } else {
    console.log('         no posts yet — blog index/RSS skipped, sitemap/robots/llms refreshed');
  }
}

main();
