# Blog content

Every published blog post is one markdown file in this folder. That's the whole system.

## To post

1. Copy `_TEMPLATE.md` to a new file, e.g. `content/blog/how-service-businesses-scale-with-ai-content.md`.
   - The filename becomes the URL: `/blog/how-service-businesses-scale-with-ai-content`.
   - A leading date (`2026-09-01-my-post.md`) is stripped from the slug automatically, so you can date-prefix filenames to keep them ordered without ugly URLs.
2. Fill in the frontmatter (`title`, `description`, `date`, `tag`) and write the body in markdown.
3. Commit and push. Vercel rebuilds and the post is live as a fully static, crawlable page,
   and appears in the sitemap, the RSS feed, `/blog`, and (if it's one of the 3 newest) the homepage.

That's it. No dashboard, no database.

## Files ignored by the build

- `_TEMPLATE.md` and anything starting with `_`
- `README.md`
- any post with `draft: true` in its frontmatter

## Why it's built this way

The site is a client-rendered React SPA — search engines and (especially) AI answer
engines struggle to read JS-rendered content. So posts are pre-rendered to real static
HTML at build time (see `scripts/postbuild-blog.mjs`), with correct meta tags and
JSON-LD structured data wired into the site's Organization / Sean Munn entity graph.
That's what makes them legible to Google, ChatGPT, Perplexity and AI Overviews.

Full details: `docs/blog-system.md`.
