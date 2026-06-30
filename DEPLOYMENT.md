# Deployment

- Repo: `NicJMurray/homepage`
- Purpose: static homepage and visual project index only
- Canonical URL: `https://njmurray.com`
- Cloudflare type: Pages
- Cloudflare Pages project: `homepage`
- Deploy command: `npm run deploy`
- Wrangler command: `wrangler pages deploy . --project-name homepage --branch main`

## GitHub Actions

Pushing to `main` deploys through `.github/workflows/deploy.yml`.

Required repository secrets:

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
```

The Pages project may still show "No Git connection" in Cloudflare. That is fine when GitHub Actions deploys with Wrangler.
