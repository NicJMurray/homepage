# Deployment

- Repo: `NicJMurray/homepage`
- Purpose: static homepage and visual project index only
- Canonical URL: `https://njmurray.com`
- Cloudflare type: Pages
- Cloudflare Pages project: `homepage`
- Deploy method: Wrangler direct upload from the checked Git source

## Cloudflare settings

- Custom domains: `njmurray.com`, `www.njmurray.com`

## Editing workflow

1. Edit the repo and run `npm.cmd run check`.
2. Commit and push `main` to back up the exact source on GitHub.
3. Run `npm.cmd run publish` to deploy the same commit to Cloudflare Pages.

The Cloudflare project remains linked to `NicJMurray/homepage`, but its Git-triggered builds currently fail before upload. The direct publish command stages only the public files and uses the existing local Wrangler sign-in, avoiding repository secrets and accidental uploads of development dependencies.
