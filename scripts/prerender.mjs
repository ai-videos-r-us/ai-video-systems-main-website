// Post-build: prerender the homepage into dist/index.html.
//
// Runs AFTER `vite build` (and before postbuild-blog.mjs). The SPA's built
// index.html ships an empty <div id="root"></div> and paints nothing until the
// JS bundle runs, which is why the homepage was not legible to Google and to
// JS-less AI crawlers. This script:
//
//   1. copies the untouched shell to dist/app.html — vercel.json rewrites every
//      non-file SPA route (calculator, diagnostic, privacy, terms, dynamic
//      results URLs) to that shell, so those routes behave exactly as before;
//   2. builds src/entry-server.tsx with Vite's SSR mode into a temporary
//      dist-ssr/ folder and renders "/" with react-dom/server;
//   3. writes the rendered markup into dist/index.html's #root (plus the FAQ
//      JSON-LD into <head>), which src/main.tsx hydrates on the client.
//
// Nothing about the React components, Tailwind CSS or bundle changes — the
// homepage HTML is simply present before JavaScript runs.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'vite';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const SSR_OUT = path.join(ROOT, 'dist-ssr');
const SHELL = 'app.html'; // keep in sync with the rewrite destination in vercel.json
const ROOT_MARKER = '<div id="root"></div>';

function fail(msg) {
  console.error(`[prerender] ${msg}`);
  process.exit(1);
}

async function main() {
  const indexPath = path.join(DIST, 'index.html');
  if (!fs.existsSync(indexPath)) fail('dist/index.html not found — run `vite build` first');

  const template = fs.readFileSync(indexPath, 'utf8');
  if (!template.includes(ROOT_MARKER)) fail(`dist/index.html has no ${ROOT_MARKER} — already prerendered?`);

  // 1. Untouched SPA shell for every other route.
  fs.writeFileSync(path.join(DIST, SHELL), template);

  // 2. SSR bundle of the app (temporary, deleted below).
  await build({
    configFile: path.join(ROOT, 'vite.config.ts'),
    logLevel: 'warn',
    build: {
      ssr: 'src/entry-server.tsx',
      outDir: SSR_OUT,
      emptyOutDir: true,
      copyPublicDir: false,
    },
  });

  const entry = pathToFileURL(path.join(SSR_OUT, 'entry-server.js')).href;
  const { render } = await import(entry);
  let { html, head } = render('/');

  // React's server renderer does not emit the boolean `muted` attribute on
  // <video> (it treats it as a DOM property). Restore it so the showreel's
  // markup matches what the client renders and autoplay stays muted.
  html = html.replace(/<video(?![^>]*\bmuted\b)([^>]*)>/g, '<video muted$1>');

  // Sanity checks: refuse to ship a half-rendered homepage.
  const mustContain = ['id="top"', 'id="content-engine"', 'id="lead-gen-engine"', 'id="faq"', '<footer'];
  for (const needle of mustContain) {
    if (!html.includes(needle)) fail(`rendered homepage is missing ${needle}`);
  }

  // 3. Inject into dist/index.html.
  const page = template
    .replace(ROOT_MARKER, `<div id="root">${html}</div>`)
    .replace('</head>', `    ${head}\n  </head>`);
  fs.writeFileSync(indexPath, page);

  fs.rmSync(SSR_OUT, { recursive: true, force: true });

  const kb = (Buffer.byteLength(page) / 1024).toFixed(1);
  console.log(`[prerender] / -> dist/index.html (${kb} kB, ${html.length} chars of markup); shell -> dist/${SHELL}`);
}

main().catch((err) => {
  console.error('[prerender] failed:', err);
  process.exit(1);
});
