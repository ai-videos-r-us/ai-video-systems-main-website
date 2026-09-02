# Homepage prerender (build-time SSG for `/`)

**Problem.** The site is a client-rendered Vite + React SPA. The built
`dist/index.html` shipped `<div id="root"></div>` and nothing else, so the
homepage only existed after the JS bundle ran. Google can render JS but
indexes such pages later and less reliably, and JS-less AI crawlers (ChatGPT,
Perplexity, Claude) saw an empty page. The blog and `/about` were already
static HTML for this reason (see `blog-system.md`); the homepage was not.

**Fix.** `scripts/prerender.mjs` runs inside `npm run build`, after
`vite build` and before `postbuild-blog.mjs`:

1. Copies the untouched Vite shell to `dist/app.html`.
2. Builds `src/entry-server.tsx` with Vite's SSR mode into a temporary
   `dist-ssr/` (deleted afterwards) and renders `/` with `react-dom/server`
   (`StaticRouter` in place of `BrowserRouter`).
3. Writes the rendered markup into `dist/index.html`'s `#root` and adds the
   FAQ `FAQPage` JSON-LD to `<head>` (the same schema the FAQ section injects
   at runtime — `buildFaqSchema()` in `src/sections/Faq.tsx`).

`src/main.tsx` hydrates when `#root` already has content (`hydrateRoot`) and
otherwise mounts as before (`createRoot`). So:

| Route                                   | Served file        | Client behaviour                  |
| --------------------------------------- | ------------------ | --------------------------------- |
| `/`                                     | `dist/index.html`  | hydrates prerendered markup       |
| `/revenue-leak-calculator`, `/privacy`, `/terms`, `/funeral-plan-scale-readiness`, `/funeral-plan-scale-readiness/results/:token`, unknown paths | `dist/app.html` via the `vercel.json` rewrite | mounts from empty root, unchanged |
| `/blog/*`, `/about`                     | static HTML        | unchanged                         |
| `npm run dev`                           | source `index.html` | mounts from empty root, unchanged |

The `vercel.json` rewrite now targets `/app.html` and uses `.+` so the bare
`/` is never rewritten (Vercel serves existing files before rewrites anyway).

**What did not change.** No component markup, Tailwind classes, animations
or copy. Framer Motion's `initial` styles are rendered inline exactly as the
client would set them on first paint, so the fade-ins play the same. The
Footer year has `suppressHydrationWarning` because the prerender bakes in the
build-time year.

**Checks.** `scripts/prerender.mjs` refuses to finish if the rendered page is
missing any of the main section ids, so a broken render fails the build
instead of shipping an empty homepage. After deploying, confirm with:

```bash
curl -s https://www.aivideosystems.org/ | grep -c 'id="content-engine"'
```

Should print `1` (previously `0`).
