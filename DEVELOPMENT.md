# Development with Codex

## Update an existing app

1. Open the app's repository, using `projects.json` here to identify the correct source and Cloudflare deployment. Read its `README.md`, `DEPLOYMENT.md`, and `AGENTS.md` first.
2. Check `git status`, fetch the remote, and update from `main` without overwriting any uncommitted user work.
3. Make the change in that app's repository and update its README when behavior or setup changes.
4. Run that repository's documented checks and production build.
5. Commit and push the validated change to `main` when publishing is authorized. The connected Cloudflare build should deploy that commit automatically; no separate upload is needed for a healthy Git integration.
6. Check the Cloudflare deployment status and source commit, then check the real custom domain through normal DNS. A pushed commit or an HTTP 200 alone does not prove the intended page is live.

An existing homepage card already points to the updated app, so the homepage only needs a change when the app's name, description, address, or project membership changes.

## Update this homepage

Edit `index.html`; keep app cards and `projects.json` consistent. Run:

```powershell
npm.cmd ci
npm.cmd run build
```

Push the resulting source commit to `NicJMurray/homepage` on `main`. Cloudflare's `homepage` project must use `npm run build` and publish `dist`. Confirm the deployed commit, homepage links, and photography redirects after the build succeeds.

## Add a new mini app

1. Create a separate GitHub repository with a useful README, `DEPLOYMENT.md`, and `AGENTS.md`. Document what the app does, how to run and test it, its production URL, and its build and deployment commands.
2. Use Workers with Static Assets for new apps, including static sites; preserve existing Pages projects when maintaining them. Configure the GitHub source, production branch `main`, build command, output directory or Worker configuration, and custom domain.
3. Store secrets in Cloudflare's protected settings, never in source, public assets, or the project catalog. Review existing environment variable and binding names before deployment.
4. Verify a real Git push reaches production automatically. If the account needs GitHub authorization or a build API token, record that as unfinished setup until it is resolved.
5. Add the app to this repository's `projects.json` and add its card in `index.html`. Add a navigation link when useful. Run the homepage build and publish the homepage change through Git.

Keep `playlist.njmurray.com` (Finder) distinct from `playlists.njmurray.com` (album-art gallery). Photography updates belong in `NicJMurray/photography`, not the legacy copy in this repository. Research-only repositories such as `NDVIChina` do not need a Cloudflare app or homepage card unless requested.
