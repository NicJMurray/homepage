# njmurray homepage

Static homepage for `https://njmurray.com`, hosted on Cloudflare Pages.

This repo is only the visual index for Nic's separate projects. It links out to:

- `https://books.njmurray.com`
- `https://playlist.njmurray.com`
- `https://playlists.njmurray.com`
- `https://rare-words.njmurray.com`
- `https://scraper.njmurray.com`

## Local development

```bash
npm install
npm run dev
```

## Deployment

This repo is connected directly to Cloudflare Pages using Cloudflare's Git integration.

Pushing to `main` automatically deploys the homepage. No GitHub Actions workflow or Cloudflare API secrets are needed for this repo.

Cloudflare Pages settings:

- Repository: `NicJMurray/homepage`
- Production branch: `main`
- Framework preset: `None`
- Build command: leave blank
- Build output directory: `/`
- Custom domains: `njmurray.com`, `www.njmurray.com`

See [DEPLOYMENT.md](DEPLOYMENT.md) for the deployment summary.
