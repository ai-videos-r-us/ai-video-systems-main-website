---
title: "Your headline goes here — make it specific and searchable"
description: "One or two sentences (roughly 140–160 characters). This is the meta description Google and AI engines show and summarise. Lead with the answer, not a tease."
date: 2026-09-01
tag: "Playbook"
author: "Sean Munn"
# Hero image (every post should have one):
# image: "/blog-images/my-slug.jpg"  # 16:9, ~1600x900, <350KB. Renders as the hero at the
#                                    # top of the post, the card thumbnail on /blog and in
#                                    # "Keep reading", the og:image, and BlogPosting.image.
# imageAlt: "Describe the scene."    # REQUIRED with image — real alt text, not keywords.
# Optional:
# slug: "custom-url-slug"          # defaults to the filename (minus any leading YYYY-MM-DD-)
# updated: 2026-09-15              # sets dateModified; defaults to `date`
# draft: true                      # keep it out of the build until ready
# noindex: true                    # publish but ask search engines not to index it
---

Open with the answer — a 40–80 word direct answer as the FIRST paragraph. The build
lifts this paragraph into the styled "The short answer" card at the top of the page
(the block AI answer engines quote), so it must stand alone. Do not write a
scene-setting intro.

## Use H2s for the questions your reader is actually asking

AI engines lift answers section by section. Make each `##` heading a real question
or a clear claim, then answer it directly underneath in plain language.

The build AUTO-GENERATES from your headings — do not write these by hand:

- **"On this page"** — a sticky, scroll-tracking table of contents built from the H2s.
- **Author card** — appended after the article (photo, credential, /about link).
- **"Keep reading"** — related-article cards (same tag first).
- **CTA** — the See If You Qualify band closes every page.

### Smaller sub-points use H3

Normal markdown works: paragraphs, lists, `inline code`, code blocks, tables,
images (`![alt text](/path.png)`), and blockquotes.

- Bullet points are fine and get cited.
- **Bold** the thing that matters.
- Link to your own pages where relevant — e.g. the [Revenue Leak Calculator](/revenue-leak-calculator).

> A short, quotable line lands well in AI summaries and pull quotes.

## Frequently asked questions

End with this exact H2 (`## Frequently asked questions`) followed by `###` question
headings — the build renders them as an interactive accordion AND emits FAQPage
JSON-LD from the pairs, so keep each answer self-contained prose.

### Write each question as the reader would ask it?

And answer it in one to three short paragraphs directly below.
