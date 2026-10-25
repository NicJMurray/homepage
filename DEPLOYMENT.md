# Deployment

## Homepage configuration

- GitHub source: `NicJMurray/homepage`
- Cloudflare Pages project: `homepage`
- Production branch: `main`
- Root directory: repository root
- Build command: `npm run build`
- Build output directory: `dist`
- Custom domains: `njmurray.com`, `www.njmurray.com`

The build validates the page and catalog, then stages only `index.html`, `_headers`, `_redirects`, and `projects.json`. Do not use `..` or the repository root as the output directory: that can expose source files and dependencies, and can exceed Pages limits.

## Publishing through GitHub

Commit and push checked changes to `main`. The connected Pages project builds the source commit and serves the resulting `dist` output. Expect a short build and deployment delay rather than an instantaneous update.

A deployment is verified only after Cloudflare reports success for the pushed commit and the custom domain serves the expected content using normal DNS. For a failing build, inspect its log and fix the source or build settings. A manual upload is a recovery tool, not proof that Git auto-deployment is working.

## Other apps

`projects.json` maps all eight sites to their repositories and Cloudflare projects. The homepage links to stable app domains, so each app can deploy independently without copying its code into this repository.

The homepage, playlists gallery, and photography use Pages Git integrations. Playlist Finder stays on the existing `spotify-playlist-finder-v2` Pages project to preserve its encrypted Google credentials; its GitHub Actions deployment uses an encrypted Cloudflare token. The three Workers use the same GitHub Actions publishing pattern. All four pipelines completed successful production deployments on 23 October 2026 after their deployment credentials were configured. Check each app's own `DEPLOYMENT.md` and the current Actions/dashboard status for future deployments.

Photography is served at `https://photography.njmurray.com/` from `NicJMurray/photography`. This homepage forwards `/photography` and `/photography/*` there with 302 redirects and does not upload the legacy gallery copy.

## Manual recovery only

With a local Wrangler sign-in, `npm run publish` builds the same `dist/` directory and uploads it to the existing `homepage` project. Commit the source first so that the deployment has an exact Git revision. Prefer fixing the Git build path for ongoing updates. Credentials must never be added to Git.

## Retained legacy resources

The `playlists` Direct Upload Pages project remains a fallback without a custom domain. The older Workers `playlist-finder-proxy` and `spotify-playlist-finder-v2` are retained; the current Finder uses its Pages Functions instead. Do not delete or redeploy these legacy resources as part of ordinary app updates.

`NicJMurray/NDVIChina` contains historical Python research scripts rather than a website. It has no Cloudflare deployment and is not included in the live app catalog.

Fresh Tracks runs as the `fresh-tracks` Worker at `fresh.njmurray.com`, with D1 snapshots and public Spotify previews. Its source is in `NicJMurray/fresh-tracks` on `main`. GitHub Actions automatically builds, tests, and deploys code and static assets using an encrypted deployment token. This pipeline was verified on 25 October 2026 against the exact pushed commit and live domain. Database schema changes are applied separately through a D1-capable connection; see the app deployment notes.
