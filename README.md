# njmurray homepage

Static homepage for `https://njmurray.com`, hosted on Cloudflare Pages.

## Local development

```bash
npm install
npm run dev
```

## Deploy with Wrangler

```bash
npm run deploy
```

The existing Cloudflare Pages project is named `homepage` and already has these custom domains attached:

- `njmurray.com`
- `www.njmurray.com`

## Cloudflare Git integration

This repo is ready to connect to Cloudflare Pages as the source of truth.

Use these settings when connecting the repo in Cloudflare:

- Repository: `NicJMurray/homepage`
- Production branch: `main`
- Framework preset: `None`
- Build command: leave blank
- Build output directory: `/`

The homepage links the Rare Words project at `/gutenberg/`.
