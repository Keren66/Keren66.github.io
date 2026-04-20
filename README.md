# Keren66.github.io

My personal website — built with React, Vite, Tailwind CSS, and deployed on GitHub Pages.

Live: https://keren66.github.io/

## Stack

- React 19 + Vite
- Tailwind CSS v4
- react-router-dom for client-side routing
- react-markdown + remark-gfm for blog posts

## Development

```bash
npm install
npm run dev         # start dev server on http://localhost:5173
npm run build       # build production bundle to dist/
npm run preview     # preview the production build locally
```

## Adding a blog post

1. Create a new `.md` file in `src/posts/`.
2. Add frontmatter at the top:

   ```markdown
   ---
   title: My Post
   date: 2026-04-20
   excerpt: A one-line summary.
   ---
   ```

3. Commit and push — GitHub Actions builds and deploys automatically.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site
and publishes it to GitHub Pages via the official Pages actions.
