# Deployment

- Repo: `NicJMurray/homepage`
- Purpose: static homepage and visual project index only
- Canonical URL: `https://njmurray.com`
- Cloudflare type: Pages
- Cloudflare Pages project: `homepage`
- Deploy method: Cloudflare Pages Git integration

## Cloudflare settings

- Repository: `NicJMurray/homepage`
- Production branch: `main`
- Framework preset: `None`
- Build command: leave blank
- Build output directory: `/`
- Custom domains: `njmurray.com`, `www.njmurray.com`

## Editing workflow

Edit the repo, commit to `main`, and Cloudflare deploys automatically.

This repo no longer uses a GitHub Actions Wrangler deploy workflow. No `CLOUDFLARE_API_TOKEN` or `CLOUDFLARE_ACCOUNT_ID` GitHub secrets are needed for homepage deployment.
