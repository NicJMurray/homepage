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

## Deploy with Wrangler

```bash
npm run deploy
```

The existing Cloudflare Pages project is named `homepage` and already has these custom domains attached:

- `njmurray.com`
- `www.njmurray.com`

Pushing to `main` deploys through GitHub Actions with Wrangler. The Cloudflare Pages project can still show "No Git connection"; the repo is the source of truth as long as the action is deploying successfully.

## Cloudflare Git integration

Cloudflare rejected converting the existing Direct Uploads project to a GitHub source project with this API error:

```text
You cannot update the `source` object in a Direct Uploads project.
```

To get automatic deploys from GitHub, create a new Cloudflare Pages project from this repo and then move the custom domains from the existing `homepage` project to the new Git-connected project.

Use these settings when connecting the repo in Cloudflare:

- Repository: `NicJMurray/homepage`
- Production branch: `main`
- Framework preset: `None`
- Build command: leave blank
- Build output directory: `/`

See [DEPLOYMENT.md](DEPLOYMENT.md) for the current deployment details and required GitHub secrets.
