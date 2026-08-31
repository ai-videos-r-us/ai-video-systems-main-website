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

// Design tokens + layout mirror the SPA (tailwind.config.js + src/components/CTA.tsx):
// signal/action reds, carbon, cloud, steel; Sora display, Inter body, IBM Plex Mono;
// angled clip-path CTAs; dash eyebrows; bordered cards; clip-angle dark sections.
const AUDIT_URL = 'https://calendly.com/sean_munn/seanspersonallink';

const STYLE = `<style>
:root{--signal:#FF1F1F;--action:#E31B23;--carbon:#0B0B0D;--cloud:#F4F4F6;--steel:#B9BDC7;--line:rgba(11,11,13,.12)}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
body{margin:0;background:#fff;color:var(--carbon);font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;font-size:17.5px;line-height:1.7;-webkit-font-smoothing:antialiased}
a{color:var(--action);text-decoration:none}
img{max-width:100%;height:auto}
.wrap{max-width:1160px;margin:0 auto;padding:0 20px}
.narrow{max-width:760px}
.mono{font-family:"IBM Plex Mono",monospace}

/* Reading progress */
.progress{position:fixed;top:0;left:0;right:0;height:3px;z-index:60;background:transparent}
.progress i{display:block;height:100%;background:var(--signal);transform:scaleX(0);transform-origin:0 50%}

/* Header — mirrors the SPA navbar */
.site-header{border-bottom:1px solid var(--line);background:#fff;position:relative;z-index:50}
.site-header .bar{max-width:1360px;margin:0 auto;padding:0 20px;display:flex;align-items:center;justify-content:space-between;gap:14px;height:76px}
.site-header .logo img{height:38px;width:auto;display:block}
.site-header nav{display:flex;align-items:center;gap:26px}
.site-header nav a{color:var(--carbon);font-size:13.5px;font-weight:600}
.site-header nav a:hover{color:var(--action)}
.btn-cta{display:inline-flex;align-items:center;gap:8px;white-space:nowrap;background:var(--signal);color:#fff !important;font-family:Sora,sans-serif;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;padding:12px 20px;clip-path:polygon(0 0,100% 0,calc(100% - 12px) 100%,0 100%);transition:background .2s}
.btn-cta:hover{background:var(--action)}
.btn-cta svg{transition:transform .2s}.btn-cta:hover svg{transform:translateX(4px)}
@media(max-width:560px){.site-header .bar{height:64px}.site-header nav{gap:12px}.site-header nav a{font-size:12.5px}.site-header .logo img{height:26px}.btn-cta{padding:9px 12px;font-size:10px;letter-spacing:.05em;gap:5px}.btn-cta svg{width:11px;height:11px}}

/* Eyebrow — mono label with signal dash */
.eyebrow{display:inline-flex;align-items:center;gap:12px;font-family:"IBM Plex Mono",monospace;font-size:12px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:rgba(11,11,13,.6);margin:0}
.eyebrow::before{content:"";display:inline-block;height:2px;width:24px;background:var(--signal)}

/* Breadcrumbs */
.crumbs{font-family:"IBM Plex Mono",monospace;font-size:11.5px;text-transform:uppercase;letter-spacing:.08em;color:rgba(11,11,13,.45);padding:22px 0 0}
.crumbs a{color:rgba(11,11,13,.6)}.crumbs a:hover{color:var(--action)}
.crumbs .sep{margin:0 8px;color:rgba(11,11,13,.3)}

/* Post header */
.post-head{padding:26px 0 0}
.post-head h1{font-family:Sora,sans-serif;font-weight:800;font-size:clamp(2rem,4.6vw,3.2rem);line-height:1.08;letter-spacing:-.02em;margin:.9rem 0 0;max-width:900px}
.byline{display:flex;align-items:center;flex-wrap:wrap;gap:10px 14px;margin:22px 0 0;font-family:"IBM Plex Mono",monospace;font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:rgba(11,11,13,.55)}
.byline img{width:34px;height:34px;object-fit:cover;border:1px solid var(--line)}
.byline a{color:var(--carbon);font-weight:600}.byline a:hover{color:var(--action)}
.byline .dot{color:rgba(11,11,13,.3)}

/* The short answer — the AEO block, visually first-class */
.answer{margin:30px 0 0;border:2px solid var(--carbon);border-left:6px solid var(--signal);padding:24px 28px;max-width:900px;background:#fff}
.answer .label{display:flex;align-items:center;gap:10px;font-family:"IBM Plex Mono",monospace;font-size:11px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:rgba(11,11,13,.55);margin:0 0 10px}
.answer p{margin:0;font-size:18.5px;line-height:1.65;font-weight:500}

/* Two-column article layout with sticky rail */
.layout{display:grid;grid-template-columns:1fr;gap:0;padding:34px 0 0}
@media(min-width:1024px){.layout{grid-template-columns:250px minmax(0,720px);gap:64px}}
.rail{display:none}
@media(min-width:1024px){.rail{display:block}.rail-inner{position:sticky;top:28px}}
.toc-label{display:flex;align-items:center;gap:10px;font-family:"IBM Plex Mono",monospace;font-size:11px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:rgba(11,11,13,.5);margin:0 0 14px}
.toc-label::before{content:"";height:2px;width:18px;background:var(--signal)}
.toc{list-style:none;margin:0;padding:0}
.toc li{margin:0}
.toc a{display:block;padding:7px 0 7px 14px;border-left:2px solid var(--line);color:rgba(11,11,13,.55);font-size:13.5px;font-weight:600;line-height:1.4;transition:color .15s,border-color .15s}
.toc a:hover{color:var(--carbon)}
.toc a.on{color:var(--carbon);border-left-color:var(--signal)}
.rail-cta{margin-top:30px;background:var(--carbon);color:#fff;padding:22px;clip-path:polygon(0 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%)}
.rail-cta p.t{font-family:Sora,sans-serif;font-size:15px;font-weight:700;line-height:1.35;margin:0}
.rail-cta p.s{font-size:12.5px;color:var(--steel);line-height:1.5;margin:8px 0 14px}
.rail-cta .btn-cta{font-size:11px;padding:10px 16px}

/* Mobile TOC */
.toc-m{margin:28px 0 0;border:1px solid var(--line)}
@media(min-width:1024px){.toc-m{display:none}}
.toc-m summary{cursor:pointer;list-style:none;display:flex;align-items:center;justify-content:space-between;padding:14px 18px;font-family:"IBM Plex Mono",monospace;font-size:11.5px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:rgba(11,11,13,.6)}
.toc-m summary::-webkit-details-marker{display:none}
.toc-m summary::after{content:"+";font-size:16px;transition:transform .2s}
.toc-m[open] summary::after{transform:rotate(45deg)}
.toc-m .toc{padding:0 18px 14px}

/* Prose */
.prose{margin:0}.prose>*:first-child{margin-top:0}
.prose h2{font-family:Sora,sans-serif;font-weight:700;font-size:1.55rem;line-height:1.2;letter-spacing:-.01em;margin:2.6rem 0 .9rem;scroll-margin-top:28px}
.prose h3{font-family:Sora,sans-serif;font-weight:700;font-size:1.2rem;margin:2rem 0 .6rem;scroll-margin-top:28px}
.prose p{margin:0 0 1.3rem}
.prose ul,.prose ol{margin:0 0 1.3rem;padding-left:1.35rem}.prose li{margin:.45rem 0}
.prose li::marker{color:var(--action);font-weight:700}
.prose img{display:block;margin:2rem 0;border:1px solid var(--line)}
.prose blockquote{margin:2rem 0;padding:.4rem 0 .4rem 1.3rem;border-left:3px solid var(--signal);color:rgba(11,11,13,.75);font-style:italic}
.prose code{font-family:"IBM Plex Mono",monospace;font-size:.88em;background:var(--cloud);padding:.12em .35em;border-radius:3px}
.prose pre{background:var(--carbon);color:#fff;padding:1.1rem 1.2rem;overflow-x:auto;margin:0 0 1.5rem}
.prose pre code{background:none;color:inherit;padding:0}
.prose a{text-decoration:underline;text-underline-offset:2px}
.prose hr{border:0;border-top:1px solid var(--line);margin:2.5rem 0}
.prose table{width:100%;border-collapse:collapse;margin:0 0 1.5rem;font-size:15px}
.prose thead th{font-family:"IBM Plex Mono",monospace;font-size:11.5px;text-transform:uppercase;letter-spacing:.08em;background:var(--cloud)}
.prose th,.prose td{border:1px solid var(--line);padding:.55rem .75rem;text-align:left;vertical-align:top}
.prose strong{font-weight:700}

/* FAQ accordion */
.faq-item{border:1px solid var(--line);border-bottom:0}
.faq-item:last-of-type{border-bottom:1px solid var(--line)}
.faq-item summary{cursor:pointer;list-style:none;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 20px;font-family:Sora,sans-serif;font-size:15.5px;font-weight:700;line-height:1.4}
.faq-item summary::-webkit-details-marker{display:none}
.faq-item summary::after{content:"+";font-family:Inter,sans-serif;font-size:20px;font-weight:400;color:var(--action);flex-shrink:0;transition:transform .2s}
.faq-item[open] summary::after{transform:rotate(45deg)}
.faq-item .faq-a{padding:0 20px 18px}
.faq-item .faq-a p{margin:0 0 .8rem}.faq-item .faq-a p:last-child{margin-bottom:0}

/* Author card */
.author-card{margin:56px 0 0;display:flex;gap:22px;align-items:flex-start;background:var(--cloud);padding:26px 28px;max-width:900px}
.author-card img{width:72px;height:72px;object-fit:cover;border:1px solid var(--line);flex-shrink:0}
.author-card .n{font-family:Sora,sans-serif;font-size:16.5px;font-weight:700;margin:0}
.author-card .n a{color:var(--carbon)}.author-card .n a:hover{color:var(--action)}
.author-card .r{font-family:"IBM Plex Mono",monospace;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:rgba(11,11,13,.5);margin:4px 0 8px}
.author-card .b{font-size:14px;line-height:1.6;color:rgba(11,11,13,.7);margin:0}
.author-card .b a{text-decoration:underline}
@media(max-width:560px){.author-card{flex-direction:column;gap:14px}}

/* Related articles */
.related{margin:56px 0 0}
.related .toc-label{margin-bottom:18px}
.related-grid{display:grid;gap:20px}
@media(min-width:760px){.related-grid{grid-template-columns:repeat(3,1fr)}}
.card{display:flex;flex-direction:column;border:1px solid var(--line);background:#fff;padding:24px;transition:border-color .2s;min-height:100%}
.card:hover{border-color:var(--carbon)}
.card .tag{font-family:"IBM Plex Mono",monospace;font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:.16em;color:rgba(11,11,13,.45);margin:0}
.card h3,.card .t{font-family:Sora,sans-serif;font-size:16.5px;font-weight:700;line-height:1.35;margin:12px 0 0}
.card h3 a,.card .t a{color:var(--carbon)}
.card h3 a:hover,.card .t a:hover{color:var(--action)}
.card .ex{flex:1;font-size:13.5px;line-height:1.6;color:rgba(11,11,13,.65);margin:10px 0 0}
.card .meta{display:flex;align-items:center;justify-content:space-between;margin:18px 0 0;font-family:"IBM Plex Mono",monospace;font-size:10.5px;text-transform:uppercase;letter-spacing:.1em;color:rgba(11,11,13,.45)}
.card .meta a{font-weight:600;color:var(--carbon)}.card .meta a:hover{color:var(--action)}

/* CTA band — carbon section with the angled top edge */
.cta-band{margin-top:72px;background:var(--carbon);color:#fff;clip-path:polygon(0 0,100% 3rem,100% 100%,0 100%);padding:96px 0 72px}
@media(max-width:640px){.cta-band{clip-path:polygon(0 0,100% 1.6rem,100% 100%,0 100%);padding:72px 0 56px}}
.cta-band .inner{max-width:760px;margin:0 auto;padding:0 20px;text-align:left}
.cta-band .eyebrow{color:var(--steel)}
.cta-band h2{font-family:Sora,sans-serif;font-weight:800;font-size:clamp(1.7rem,3.6vw,2.5rem);line-height:1.12;letter-spacing:-.015em;margin:.9rem 0 0}
.cta-band p.s{color:var(--steel);font-size:16px;line-height:1.65;margin:16px 0 26px;max-width:620px}
.cta-band .btn-cta{font-size:13px;padding:15px 26px}
.cta-band .proof{margin:26px 0 0;font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.45)}

/* Footer — static replica of the SPA footer */
.site-footer{background:var(--carbon);color:#fff;padding:56px 0 36px}
.site-footer .cols{max-width:1360px;margin:0 auto;padding:0 20px;display:grid;gap:40px}
@media(min-width:900px){.site-footer .cols{grid-template-columns:1.2fr 1fr 1fr}}
.site-footer .blurb{max-width:340px;font-size:14px;line-height:1.65;color:var(--steel);margin:18px 0 0}
.site-footer .contact{margin:20px 0 0;font-family:"IBM Plex Mono",monospace;font-size:12px;line-height:2}
.site-footer .contact a{color:var(--steel)}.site-footer .contact a:hover{color:#fff}
.site-footer .contact a.q{color:var(--signal)}.site-footer .contact a.q:hover{color:#fff}
.site-footer .head{font-family:"IBM Plex Mono",monospace;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.16em;color:rgba(255,255,255,.4);margin:0 0 14px}
.site-footer ul{list-style:none;margin:0;padding:0}
.site-footer ul li{margin:0 0 10px}
.site-footer ul a{color:var(--steel);font-size:13px}.site-footer ul a:hover{color:#fff}
.site-footer .bottom{max-width:1360px;margin:48px auto 0;padding:26px 20px 0;border-top:1px solid rgba(255,255,255,.1);display:flex;flex-wrap:wrap;gap:10px;justify-content:space-between;font-family:"IBM Plex Mono",monospace;font-size:10.5px;text-transform:uppercase;letter-spacing:.14em;color:rgba(255,255,255,.35)}

/* Blog index */
.index-head{padding:60px 0 8px}
.index-head h1{font-family:Sora,sans-serif;font-weight:800;font-size:clamp(2.2rem,5vw,3.4rem);letter-spacing:-.02em;margin:.7rem 0 0}
.index-head p.lede{color:rgba(11,11,13,.65);font-size:16.5px;line-height:1.65;margin:1rem 0 0;max-width:640px}
.filters{display:flex;flex-wrap:wrap;gap:10px;margin:30px 0 0}
.chip{cursor:pointer;border:1px solid var(--line);background:#fff;padding:8px 16px;font-family:"IBM Plex Mono",monospace;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.12em;color:rgba(11,11,13,.6);transition:all .15s}
.chip:hover{border-color:var(--carbon);color:var(--carbon)}
.chip.on{background:var(--carbon);border-color:var(--carbon);color:#fff}
.post-grid{display:grid;gap:20px;margin:30px 0 0}
@media(min-width:700px){.post-grid{grid-template-columns:repeat(2,1fr)}}
@media(min-width:1024px){.post-grid{grid-template-columns:repeat(3,1fr)}}

/* About page */
.about-prose img:first-child{margin-top:.5rem}
main{padding-bottom:0}
</style>`;

const HEADER = `<header class="site-header"><div class="bar">
<a class="logo" href="/" aria-label="AI Video Systems home"><img src="/brand/avs-full-logo-black.svg" alt="AI Video Systems" width="140" height="38" /></a>
<nav aria-label="Site">
<a href="/blog">Blog</a>
<a href="/about">About</a>
<a class="btn-cta" href="${AUDIT_URL}" target="_blank" rel="noopener">See If You Qualify
<svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
</nav>
</div></header>`;

const FOOTER = `<footer class="site-footer">
<div class="cols">
<div>
<img src="/brand/avs-full-logo-white.svg" alt="AI Video Systems" width="150" height="40" style="height:40px;width:auto" />
<p class="blurb">AI Video Systems installs two tailored marketing systems &mdash; the AI Content Engine and the Lead Gen Engine &mdash; for established service businesses that need ROI they can see, backed by receipts.</p>
<p class="contact"><a href="mailto:sean@aivideosystems.org">sean@aivideosystems.org</a><br />
<a class="q" href="${AUDIT_URL}" target="_blank" rel="noopener">See If You Qualify &rarr;</a><br />
AI Video Systems Ltd</p>
</div>
<div>
<p class="head">Quick Links</p>
<ul>
<li><a href="/">Home</a></li>
<li><a href="/blog">Blog</a></li>
<li><a href="/about">About Sean</a></li>
<li><a href="/revenue-leak-calculator">Revenue Leak Calculator</a></li>
</ul>
</div>
<div>
<p class="head">Legal</p>
<ul>
<li><a href="/privacy">Privacy Policy</a></li>
<li><a href="/terms">Terms</a></li>
</ul>
</div>
</div>
<div class="bottom">
<span>Two Tailored Systems &middot; Receipts Included</span>
<span>&copy; ${YEAR} AI Video Systems. All rights reserved.</span>
</div>
</footer>`;

// Full-width commercial close — every informational page terminates in Layer 4.
const CTA = `<section class="cta-band">
<div class="inner">
<p class="eyebrow">The Next Step</p>
<h2>Want a system like this installed for your business?</h2>
<p class="s">AI Video Systems installs the AI Content Engine and the Lead Gen Engine for established, founder-led service businesses. If you have a proven offer and the capacity for more clients, find out if you qualify &mdash; the first 30 days are covered by a money-back guarantee.</p>
<a class="btn-cta" href="${AUDIT_URL}" target="_blank" rel="noopener">See If You Qualify
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
<p class="proof">$15m+ tracked revenue &middot; 96+ clients &middot; 30-day money-back guarantee</p>
</div>
</section>`;

// Progress bar + TOC scrollspy. Tiny, dependency-free, inert on pages without the hooks.
const INLINE_JS = `<script>
(function(){
var bar=document.getElementById('pbar');
if(bar){var h=document.documentElement;var onS=function(){var m=h.scrollHeight-h.clientHeight;bar.style.transform='scaleX('+(m>0?h.scrollTop/m:0)+')'};addEventListener('scroll',onS,{passive:true});onS();}
var links=[].slice.call(document.querySelectorAll('.toc a[href^="#"]'));
if(links.length){var hs=[].slice.call(document.querySelectorAll('article h2[id]'));
var spy=function(){var y=innerHeight*0.3;var cur=hs[0];for(var i=0;i<hs.length;i++){if(hs[i].getBoundingClientRect().top<=y)cur=hs[i];else break}
links.forEach(function(a){a.classList.toggle('on',!!cur&&a.getAttribute('href')==='#'+cur.id)})};
addEventListener('scroll',spy,{passive:true});spy();}
var chips=[].slice.call(document.querySelectorAll('.chip'));
if(chips.length){chips.forEach(function(c){c.addEventListener('click',function(){
chips.forEach(function(x){x.classList.toggle('on',x===c)});
var t=c.getAttribute('data-tag');
[].slice.call(document.querySelectorAll('.post-grid .card')).forEach(function(k){k.style.display=(!t||k.getAttribute('data-tag')===t)?'':'none'})})})}
})();
</script>`;


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
${body}
</body>
</html>
`;
}

function jsonLd(obj) {
  return `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;
}

// ---------------------------------------------------------------------------
// Post-page architecture helpers
// ---------------------------------------------------------------------------

function decodeEntities(s) {
  return String(s)
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function stripTags(s) {
  return String(s).replace(/<[^>]*>/g, '');
}

// First <p> of the body becomes the styled "short answer" card (the AEO block).
function splitShortAnswer(bodyHtml) {
  const m = String(bodyHtml).match(/^\s*<p>([\s\S]*?)<\/p>/);
  if (!m) return { answerHtml: null, rest: bodyHtml };
  return { answerHtml: m[1], rest: bodyHtml.slice(m[0].length) };
}

// Auto-generate "On this page" from the h2 ids the markdown renderer emits.
function buildToc(bodyHtml) {
  const items = [];
  const re = /<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g;
  let m;
  while ((m = re.exec(bodyHtml))) {
    items.push({ id: m[1], label: decodeEntities(stripTags(m[2])).trim() });
  }
  return items;
}

// Turn the "Frequently asked questions" section (h3 + answer blocks) into a
// native <details> accordion, and collect Q/A pairs for FAQPage JSON-LD.
function transformFaq(bodyHtml) {
  const h2re = /<h2 id="frequently-asked-questions">[\s\S]*?<\/h2>/;
  const h2m = bodyHtml.match(h2re);
  if (!h2m) return { html: bodyHtml, faqs: [] };

  const sectionStart = h2m.index + h2m[0].length;
  const afterH2 = bodyHtml.slice(sectionStart);
  const endRel = (() => {
    const nextH2 = afterH2.search(/<h2 /);
    const hr = afterH2.search(/<hr\s*\/?>/);
    const cands = [nextH2, hr].filter((i) => i >= 0);
    return cands.length ? Math.min(...cands) : afterH2.length;
  })();
  const section = afterH2.slice(0, endRel);

  const parts = section.split(/(?=<h3 )/).filter((p) => p.trim());
  const faqs = [];
  const rendered = parts
    .map((part) => {
      const qm = part.match(/^<h3 id="([^"]+)">([\s\S]*?)<\/h3>([\s\S]*)$/);
      if (!qm) return part;
      const [, id, qHtml, aHtml] = qm;
      const q = decodeEntities(stripTags(qHtml)).trim();
      const a = decodeEntities(stripTags(aHtml)).replace(/\s+/g, ' ').trim();
      faqs.push({ q, a });
      return `<details class="faq-item" id="${id}"><summary>${qHtml}</summary><div class="faq-a">${aHtml}</div></details>`;
    })
    .join('\n');

  const html =
    bodyHtml.slice(0, sectionStart) + '\n' + rendered + afterH2.slice(endRel);
  return { html, faqs };
}

// Siblings for the "Keep reading" block: same tag first, then newest.
function relatedPosts(post, posts) {
  const others = posts.filter((p) => p.slug !== post.slug && !p.noindex);
  const sameTag = others.filter((p) => p.tag === post.tag);
  const rest = others.filter((p) => p.tag !== post.tag);
  return [...sameTag, ...rest].slice(0, 3);
}

function postCard(p) {
  return `<article class="card" data-tag="${escapeHtml(p.tag)}">
<p class="tag">${escapeHtml(p.tag)}</p>
<p class="t"><a href="${p.path}">${escapeHtml(p.title)}</a></p>
<p class="ex">${escapeHtml(p.description)}</p>
<p class="meta"><span>${escapeHtml(p.dateDisplay)} &middot; ${p.readingMinutes} min</span><a href="${p.path}" aria-label="Read ${escapeHtml(p.title)}">Read &rarr;</a></p>
</article>`;
}

const AUTHOR_CARD = `<section class="author-card">
<img src="/sean-headshot.jpg" alt="Sean Munn, founder of AI Video Systems" width="72" height="72" loading="lazy" />
<div>
<p class="n"><a href="/about">Sean Munn</a></p>
<p class="r">Founder, AI Video Systems</p>
<p class="b">11 years in sales, lead generation and content systems &mdash; $15M+ in tracked revenue across 96+ clients. Sean writes every article from work inside live client systems. <a href="/about">More about Sean &rarr;</a></p>
</div>
</section>`;

// ---------------------------------------------------------------------------
// Post page
// ---------------------------------------------------------------------------

function renderPost(post, posts = []) {
  const desc = escapeHtml(post.description);
  const title = escapeHtml(post.title);
  const robots = post.noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large,max-snippet:-1';

  const { html: faqHtml, faqs } = transformFaq(post.bodyHtml);
  const { answerHtml, rest } = splitShortAnswer(faqHtml);
  const toc = buildToc(rest);
  const related = relatedPosts(post, posts);
  const showUpdated = post.updatedISO && post.updatedISO !== post.dateISO;

  const graph = [
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
  ];
  if (faqs.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${post.url}#faq`,
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }

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
${jsonLd({ '@context': 'https://schema.org', '@graph': graph })}`;

  const tocList = toc
    .map((t) => `<li><a href="#${t.id}">${escapeHtml(t.label)}</a></li>`)
    .join('\n');

  const tocBlock = toc.length >= 2
    ? `<nav aria-label="On this page"><p class="toc-label">On this page</p><ul class="toc">${tocList}</ul></nav>`
    : '';
  const tocMobile = toc.length >= 2
    ? `<details class="toc-m"><summary>On this page</summary><ul class="toc">${tocList}</ul></details>`
    : '';

  const railCta = `<div class="rail-cta">
<p class="t">Want this installed, not just explained?</p>
<p class="s">Two engines. One qualification call. 30 days risk-free.</p>
<a class="btn-cta" href="${AUDIT_URL}" target="_blank" rel="noopener">See If You Qualify</a>
</div>`;

  const relatedBlock = related.length
    ? `<section class="related"><p class="toc-label">Keep reading</p><div class="related-grid">
${related.map(postCard).join('\n')}
</div></section>`
    : `<section class="related"><p class="toc-label">Keep reading</p><p><a href="/blog">Browse all articles &rarr;</a></p></section>`;

  const answerBlock = answerHtml
    ? `<section class="answer" aria-label="The short answer"><p class="label">The short answer</p><p>${answerHtml}</p></section>`
    : '';

  const body = `<div class="progress" aria-hidden="true"><i id="pbar"></i></div>
${HEADER}
<main>
<div class="wrap">
<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span class="sep">/</span><a href="/blog">Blog</a><span class="sep">/</span><span>${escapeHtml(post.tag)}</span></nav>
<header class="post-head">
<p class="eyebrow">${escapeHtml(post.tag)}</p>
<h1>${title}</h1>
<div class="byline">
<img src="/sean-headshot.jpg" alt="" width="34" height="34" />
<span>By <a href="/about">${escapeHtml(post.author)}</a></span>
<span class="dot">&middot;</span>
<time datetime="${post.dateISO}">${escapeHtml(post.dateDisplay)}</time>
${showUpdated ? `<span class="dot">&middot;</span><span>Updated <time datetime="${post.updatedISO}">${escapeHtml(post.updatedDisplay || post.updatedISO)}</time></span>` : ''}
<span class="dot">&middot;</span>
<span>${post.readingMinutes} min read</span>
</div>
</header>
${answerBlock}
${tocMobile}
<div class="layout">
<aside class="rail"><div class="rail-inner">
${tocBlock}
${railCta}
</div></aside>
<article class="prose">${rest}</article>
</div>
${AUTHOR_CARD}
${relatedBlock}
</div>
</main>
${CTA}
${FOOTER}
${INLINE_JS}`;

  return shell({ head, body });
}

// ---------------------------------------------------------------------------
// Blog index
// ---------------------------------------------------------------------------

function renderIndex(posts) {
  const tags = [...new Set(posts.map((p) => p.tag))];
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

  const chips = tags.length >= 2
    ? `<div class="filters" role="group" aria-label="Filter articles by topic">
<button class="chip on" type="button" data-tag="">All</button>
${tags.map((t) => `<button class="chip" type="button" data-tag="${escapeHtml(t)}">${escapeHtml(t)}</button>`).join('\n')}
</div>`
    : '';

  const body = `${HEADER}
<main>
<div class="wrap">
<div class="index-head">
<p class="eyebrow">AI Video Systems</p>
<h1>Field Notes</h1>
<p class="lede">${escapeHtml(BLOG_DESCRIPTION)}</p>
</div>
${chips}
<div class="post-grid">
${posts.filter((p) => !p.noindex).map(postCard).join('\n')}
</div>
</div>
</main>
${CTA}
${FOOTER}
${INLINE_JS}`;

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

  const body = `${HEADER}
<main>
<div class="wrap">
<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span class="sep">/</span><span>About</span></nav>
<header class="post-head">
<p class="eyebrow">AI Video Systems</p>
<h1>${title}</h1>
</header>
<div class="narrow" style="margin:30px 0 0"><article class="prose about-prose">${about.bodyHtml}</article></div>
</div>
</main>
${CTA}
${FOOTER}
${INLINE_JS}`;

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
    written.push(writeFile(path.join('blog', post.slug, 'index.html'), renderPost(post, posts)));
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
