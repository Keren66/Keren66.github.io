---
title: How This Site Is Built
date: 2026-04-15
excerpt: A quick tour of the stack — React, Vite, Tailwind, and GitHub Pages.
---

# How This Site Is Built

This site is a single React app built with Vite and styled with Tailwind CSS.
Blog posts are plain Markdown files under `src/posts/` and loaded at build time
via Vite's `import.meta.glob`.

## The stack

| Layer      | Tool                |
| ---------- | ------------------- |
| Framework  | React 19            |
| Bundler    | Vite                |
| Styling    | Tailwind CSS v4     |
| Routing    | react-router-dom    |
| Markdown   | react-markdown + remark-gfm |
| Hosting    | GitHub Pages        |

## Adding a new post

1. Drop a new `.md` file into `src/posts/`.
2. Include a frontmatter block with `title`, `date`, and `excerpt`.
3. Push to `main` — GitHub Actions handles the deploy.

That's it.
