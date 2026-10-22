![Project Homepage](.github/readme-banner.svg)

# Project Homepage

The front door to Nic Murray's mini apps at [njmurray.com](https://njmurray.com/). Each app has its own GitHub repository and Cloudflare deployment. Updating an app does not require rebuilding the homepage: its card points to the app's stable domain.

## Project map

The public [projects.json](projects.json) catalog records the canonical URL, repository, and Cloudflare project for each site. The build checks that every app card agrees with it.

| Site | GitHub repository | Cloudflare deployment |
| --- | --- | --- |
| [Homepage](https://njmurray.com/) | [homepage](https://github.com/NicJMurray/homepage) | Pages `homepage` |
| [Playlist Finder](https://playlist.njmurray.com/) | [spotify-playlist-finder-v2](https://github.com/NicJMurray/spotify-playlist-finder-v2) | Pages `spotify-playlist-finder-v2` |
| [Spotify Playlists](https://playlists.njmurray.com/) | [playlists](https://github.com/NicJMurray/playlists) | Pages `playlists-git` |
| [Reading List](https://books.njmurray.com/) | [njmurray-books](https://github.com/NicJMurray/njmurray-books) | Worker `njmurray-books` |
| [Rare Word Explorer](https://rare-words.njmurray.com/) | [gutenberg-v2](https://github.com/NicJMurray/gutenberg-v2) | Worker `gutenberg` |
| [Photography](https://photography.njmurray.com/) | [photography](https://github.com/NicJMurray/photography) | Pages `photography` |
| [Scraper](https://scraper.njmurray.com/) | [london-jobs-watcher_v2](https://github.com/NicJMurray/london-jobs-watcher_v2) | Worker `london-jobs-watcher` |

`playlist.njmurray.com` is the Playlist Finder; `playlists.njmurray.com` is the album-art gallery. They are separate apps. [NDVIChina](https://github.com/NicJMurray/NDVIChina) is a research repository, not a hosted mini app.

## Local development

```powershell
npm.cmd ci
npm.cmd run build
npm.cmd run dev
```

`npm run build` validates the catalog, card links, and redirects, then copies an explicit allowlist of public files to `dist/`. Cloudflare Pages must publish `dist`, not the repository root. Development scripts, documentation, Git metadata, dependencies, and old photography assets are not in the published output.

See [DEVELOPMENT.md](DEVELOPMENT.md) for the Codex editing workflow and [DEPLOYMENT.md](DEPLOYMENT.md) for hosting settings and verification.

## How the homepage works

`index.html` contains the static navigation, project cards, inline styles, analytics, and footer year. Cards are normal HTML links, so app navigation does not depend on JavaScript. The responsive layout and all app descriptions are maintained here; the catalog validates URLs rather than rendering the page.

Photography now belongs to its own repository and domain. The homepage loads its feature image from that domain. `_redirects` forwards old `/photography` and `/photography/*` links to the corresponding new location. The historical `photography/` directory and `photos:sync` script are retained in Git for reference and are excluded from deployment; edit the separate photography repository for future photo updates.

## File map

| File | Purpose |
| --- | --- |
| `index.html` | Homepage content, layout, navigation, and card links |
| `projects.json` | Public project, repository, and deployment catalog |
| `_headers` | Cloudflare response headers and cache directives |
| `_redirects` | Legacy photography redirects |
| `scripts/check-site.mjs` | Catalog, links, and redirect validation |
| `scripts/build-site.mjs` | Allowlisted production output in `dist/` |
| `scripts/publish-site.mjs` | Manual recovery deployment of the same built output |
| `AGENTS.md` | Instructions for future Codex work |
