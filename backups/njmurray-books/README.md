# njmurray-books backup

Recovered backup of the Cloudflare Worker that serves the Goodreads reading list at:

- https://njmurray.com/books/

## What is included

- `worker/index.js` - readable Worker router recovered from Cloudflare.
- `dist/index.html` - HTML shell for the books app, cleaned of Cloudflare's injected analytics beacon.
- `dist/assets/` - deployed production JavaScript and CSS bundle fetched from the live route.
- `wrangler.toml` - deploy config for the Worker and its static asset binding.
- `metadata/` - Cloudflare recovery metadata and the raw downloaded Worker multipart response.

## What Cloudflare did not have

The original editable Vite/React source tree, Goodreads import script, and source maps were not available from the deployed Worker. This repository preserves the live deployment and can be redeployed, but future Goodreads updates would require recreating the import/build source or recovering it from another machine.

## Local commands

```sh
npm install
npm run dev
```

Deploying will target the existing `njmurray-books` Worker and `/books` routes:

```sh
npm run deploy
```
