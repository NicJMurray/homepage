# njmurray homepage

`njmurray.com` is the static front door for the other personal projects. It has no application logic, database, build output, or server-side rendering: Cloudflare Pages serves `index.html` as written.

## How it is structured

Everything visual lives in `index.html`:

- The `<head>` contains metadata, Open Graph information, and the Google Analytics tag.
- The `<style>` block contains the complete responsive layout and shared visual language used across the project sites.
- The main content is a set of navigation panels and project cards linking to the subdomain apps.
- A very small inline script updates the footer year.

The site is deliberately a hand-written static page. There is no framework, component layer, fetch request, or generated project data to keep in sync.

## Updating it

- Add or change a project by editing the relevant card link, icon, title, description, and category directly in `index.html`.
- Update the compact project index near the top at the same time as the larger project cards so both routes remain accurate.
- Keep external project URLs on their canonical subdomains. The homepage is an index, not a proxy or application shell.
- Adjust global visual tokens at the top of the inline stylesheet (`--paper`, `--green`, etc.) if the shared palette changes.

`_headers` contains the static response-header rules. `DEPLOYMENT.md` remains a separate operational note; this README is only the map of how the site itself works.
