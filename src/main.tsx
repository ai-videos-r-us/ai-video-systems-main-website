import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const container = document.getElementById('root')!;
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// The production homepage (dist/index.html) ships its markup prerendered at
// build time by scripts/prerender.mjs, so we hydrate it instead of rendering
// from scratch. Every other route is served the empty shell (dist/app.html)
// and mounts exactly as before; so does the dev server.
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
