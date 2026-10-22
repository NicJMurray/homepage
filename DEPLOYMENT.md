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

`projects.json` maps all seven sites to their repositories and Cloudflare projects. The homepage links to stable app domains, so each app can deploy independently without copying its code into this repository.

The homepage, playlists gallery, and photography use Pages Git integrations. Playlist Finder stays on the existing `spotify-playlist-finder-v2` Pages project to preserve its encrypted Google credentials; its GitHub Actions deployment requires a Cloudflare deployment token. The three Workers use GitHub Actions and also need their deployment credentials validated. During the October 2026 setup audit, these four apps still needed token setup; do not infer automation is complete from the mapping alone. Check each app's own `DEPLOYMENT.md` and the current dashboard status before reporting success.

Photography is served at `https://photography.njmurray.com/` from `NicJMurray/photography`. This homepage forwards `/photography` and `/photography/*` there with 302 redirects and does not upload the legacy gallery copy.

## Manual recovery only

With a local Wrangler sign-in, `npm run publish` builds the same `dist/` directory and uploads it to the existing `homepage` project. Commit the source first so that the deployment has an exact Git revision. Prefer fixing the Git build path for ongoing updates. Credentials must never be added to Git.
