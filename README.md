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

This project is currently a Cloudflare Pages Direct Uploads project, so commits to this repo do not automatically deploy until the Cloudflare project is migrated to a Git-connected Pages project. The repo is still the source of truth; deploys can be pushed with Wrangler using the command above.

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

The homepage links the Rare Words project at `/gutenberg/`.
