# Blog system

A static, crawlable blog bolted onto the Vite + React SPA **without** server-rendering
the app. Posts are pre-rendered to real HTML at build time so Google and AI answer
engines (ChatGPT, Perplexity, Google AI Overviews) can read them — the SPA itself is
client-rendered and would otherwise serve them an empty shell.

## Why not just add a `/blog` route to the SPA?

React Router renders in the browser. A crawler that doesn't execute JavaScript — which
includes most AI crawlers — sees `<div id="root"></div>` and nothing else. For content
whose entire purpose is organic + AI-search discovery, that's fatal. So the blog is
generated as standalone static HTML instead.

## How it works

Single source of truth: markdown files in **`content/blog/*.md`** (frontmatter + body).

Two build steps wrap the existing `vite build` (see `package.json`):

```
npm run build
  = node scripts/prebuild-blog.mjs   # 1. regenerate homepage teaser manifest
    && tsc && vite build             # 2. build the SPA (unchanged)
    && node scripts/postbuild-blog.mjs  # 3. emit static blog HTML into dist/
```

- **`scripts/blog-lib.mjs`** — shared loader/parser. Reads posts, parses frontmatter
  (`gray-matter`) and markdown (`marked`), applies slug/date/reading-time rules.
- **`scripts/prebuild-blog.mjs`** — writes `src/data/articles.generated.ts` (the latest
  3 posts) so the homepage "Latest Articles" teaser stays in sync. Runs before `vite build`
  because the teaser is bundled into the SPA. Also runs on `npm run dev`.
- **`scripts/postbuild-blog.mjs`** — writes, into `dist/`:
  - `blog/<slug>/index.html` — one static page per post, with full `<head>` meta
    (title, description, canonical, Open Graph `article`, Twitter card) and JSON-LD
    (`BlogPosting` + `BreadcrumbList`) whose `author`/`publisher` reference the site's
    existing `#founder` (Sean Munn) and `#organization` entities from `index.html`.
  - `blog/index.html` — the blog listing (`Blog` JSON-LD).
  - `blog/rss.xml` — RSS feed.
  - `sitemap.xml` — complete: core pages + `/blog` + every post (regenerated each build).
  - `robots.txt` — permissive; AI crawlers are intentionally **not** blocked.
  - `llms.txt` — plain-text index for AI crawlers.

With **zero posts**, no `dist/blog/` is produced, the teaser is empty, and the sitemap
carries only core pages — the live site is unchanged. Everything is dormant until the
first markdown file lands.

## Serving (Vercel)

`vercel.json` rewrites all non-`/api/`, non-`/blog` paths to `/index.html` (the SPA).
`/blog` and `/blog/*` are excluded, so Vercel serves the generated static files directly
and a missing post returns a real 404 (not a soft-404 of the homepage). The core pages
(`/`, `/revenue-leak-calculator`, the diagnostics, `/privacy`, `/terms`) are unaffected.

## Posting

See `content/blog/README.md`. Short version: copy `_TEMPLATE.md`, write markdown, push.
Vercel rebuilds and the post is live and crawlable.

## Config

- Canonical origin defaults to `https://www.aivideosystems.org` and can be overridden with
  the `SITE_URL` env var (must stay the `www` host in production to match existing canonicals).

## Dependencies added

`marked` and `gray-matter`, both **devDependencies** (build-time only; Vercel installs
devDependencies during the build). Nothing is added to the client bundle.
