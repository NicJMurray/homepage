# Instructions for Codex

This repository is the homepage and project index at `njmurray.com`. Read `README.md`, `DEVELOPMENT.md`, `DEPLOYMENT.md`, and `projects.json` before changing hosting or project membership.

- Work in the repository for the app being changed. Use `projects.json` to match its GitHub source, canonical domain, and Cloudflare deployment. Do not copy apps into this homepage.
- Check `git status` and fetch/update `main` safely before editing. Preserve unrelated user changes; never reset or force-push to clear them.
- The production homepage remains static HTML. Preserve its current layout unless the user requests a redesign.
- Keep app cards in `index.html` and the public `projects.json` catalog in sync. A new mini app needs a separate repository, README, deployment instructions, a connected Cloudflare project, and a homepage catalog entry/card.
- Always distinguish Playlist Finder (`playlist.njmurray.com`, `spotify-playlist-finder-v2`) from the album-art gallery (`playlists.njmurray.com`, `playlists`).
- Photography lives in `NicJMurray/photography`. The `photography/` copy in this repository is historical and excluded from the build. Preserve the `/photography` redirects when editing routing.
- Never commit credentials or secrets. Use Cloudflare protected settings for environment secrets and bindings.
- Run `npm ci` when dependencies are missing, then `npm run build` for changes to the homepage. The output directory is `dist`, produced by an explicit public-file allowlist. Add public assets deliberately to that list when needed; never publish the whole repository or `node_modules`.
- When the task authorizes publishing, commit and push the validated change to `main` so the connected Cloudflare Git build can deploy it. Update the documentation with material behavior or setup changes.
- Verify the Cloudflare build is successful for the pushed commit and the actual custom domain serves the expected change through ordinary DNS. Inspect a representative link or asset as appropriate. Do not claim completion from a push or a manual deployment alone.
- If native Git builds need a connection, API token, or other external setup, report the exact missing step and document it. Deployment mappings do not prove automation is active. `npm run publish` is manual recovery only.
