// Build-time server entry, used ONLY by scripts/prerender.mjs.
//
// Renders the SPA for a given path with React's server renderer so the built
// dist/index.html carries the homepage's real markup instead of an empty
// <div id="root">. The client (src/main.tsx) then hydrates that markup rather
// than rendering from scratch — same components, same styles, same behaviour,
// but Google and JS-less crawlers see the content in the initial response.
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import { buildFaqSchema } from './sections/Faq';

export function render(url: string): { html: string; head: string } {
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>
  );

  // The FAQ section injects its FAQPage JSON-LD into <head> at runtime (see
  // useFaqSchema). Emit the same script statically so crawlers get it without
  // JS; the runtime hook finds the element by id and simply reuses it.
  const head =
    url === '/'
      ? `<script id="faq-page-schema" type="application/ld+json">${JSON.stringify(buildFaqSchema())}</script>`
      : '';

  return { html, head };
}
