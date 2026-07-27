![Project Homepage](.github/readme-banner.svg)

# Project Homepage

Static project index and personal photography gallery at `njmurray.com`. The homepage provides a coherent front door to the separate subdomain applications and the first-party Photography collection.

There is no application state, framework runtime, database, or server-side rendering. Cloudflare Pages returns static documents and assets directly; the Photography page fetches its small generated gallery manifest in the browser.

## Request and render path

```text
Browser request
→ Cloudflare Pages
→ static HTML, CSS, JavaScript and image assets
→ browser renders the requested page
→ analytics script loads independently
```

A page failure is therefore limited to static delivery or a browser rendering issue. The linked projects can be unavailable without affecting the homepage itself.

## Document structure

The homepage is split between `index.html` and `home.css`:

1. **Metadata and analytics**
   - page title and description;
   - Open Graph title, description, and type;
   - theme colour;
   - Google Analytics loader and configuration.
2. **Design system**
   - colour variables;
   - typography;
   - navigation, editorial project rows, and responsive rules.
3. **Top navigation**
   - direct canonical links to each project subdomain;
   - external GitHub link opened in a separate tab.
4. **Project sections**
   - music;
   - literature;
   - art;
   - technology.
5. **Footer**
   - static identity link with a year filled by JavaScript.

Project rows are ordinary anchors rather than JavaScript click handlers. Navigation therefore works without client-side JavaScript.

## Photography

`photography/index.html` is a deliberately minimal gallery with:

- one visible title;
- a natural-ratio masonry collection;
- lazy-loaded 960 px images and 1920 px fullscreen images;
- icon-only, keyboard-accessible fullscreen controls;
- reduced-motion support;
- a dedicated social sharing card.

The screen-sized WebP assets live in `photography/photos/`. This keeps the photographs on the same free Cloudflare Pages deployment as the rest of the site, while the GitHub repository provides a second copy.

To refresh the gallery, place new originals in the source photo folder and run:

```powershell
npm.cmd run photos:sync
```

The sync script accepts another folder as an optional argument:

```powershell
npm.cmd run photos:sync -- "C:\path\to\photos"
```

It rotates from EXIF data, writes responsive WebP copies, and rebuilds `photography/gallery.json`. Optional titles and descriptive alt text belong in `photography/photo-details.json`.

After committing and pushing the refreshed assets to GitHub, publish the same checked source with:

```powershell
npm.cmd run publish
```

## Layout system

The main visual tokens are CSS custom properties:

```css
--paper
--ink
--muted
--line
--forest
--cream
```

The homepage and Photography page share the same warm paper, dark ink, forest accent and editorial serif typography. The homepage uses border-separated project rows without shadows, rounded containers or decorative cards. Photography removes all visible copy except its title.

Responsive behaviour:

| Breakpoint | Change |
| --- | --- |
| `820px` | Homepage sections stack and project details simplify. |
| `880px` | Photography moves from three columns to two. |
| `560px` | Gutters and typography tighten for small screens. |

No layout measurement is performed in JavaScript; the browser resolves every breakpoint through CSS.

## Semantics and accessibility

- Navigation uses a labelled `<nav>`.
- Project collections use named sections with heading relationships.
- Decorative numbers and arrows are hidden from assistive technology.
- Each entire project row is a single anchor, producing a large keyboard and pointer target.
- Text and icons remain in the HTML rather than being generated after load.
- Focus and hover behaviour are CSS-driven.
- Gallery alt text and control labels remain available without adding visible captions.

## Runtime JavaScript

Two scripts execute:

1. Google Analytics initialises `dataLayer` and configures measurement ID `G-GDNHTX5GQZ`.
2. The footer script writes the browser’s current year into `#year`.

Neither script controls navigation, layout, or project visibility. If analytics is blocked, the page continues to function normally.

## Source of truth

Project information is manually maintained in the homepage index. Each project row contains:

- a canonical destination URL;
- an index number;
- a title;
- a short functional description;
- an arrow indicating navigation.

## Response headers

`_headers` contains Cloudflare Pages response-header rules. It is the place for site-wide browser policy or cache directives that should be sent with static responses.

`DEPLOYMENT.md` contains operational hosting notes and is intentionally separate from this technical description of the page.

## File map

| File | Responsibility |
| --- | --- |
| `index.html` | Homepage structure, content, analytics, and footer script. |
| `home.css` | Shared minimalist homepage design and responsive layout. |
| `photography/index.html` | Photography page structure and metadata. |
| `photography/photography.css` | Photography layout, gallery and fullscreen viewer styles. |
| `photography/gallery.js` | Gallery rendering and fullscreen interactions. |
| `photography/gallery.json` | Generated photo manifest. |
| `photography/photo-details.json` | Maintained photo titles and alt text. |
| `photography/photos/` | Generated responsive WebP assets. |
| `scripts/sync-photos.mjs` | Repeatable photo optimisation and manifest workflow. |
| `scripts/check-site.mjs` | Static asset and link validation. |
| `scripts/publish-site.mjs` | Checked, minimal Cloudflare Pages deployment. |
| `_headers` | Cloudflare Pages response headers. |
| `package.json` | Local preview, photo sync and validation commands. |
| `DEPLOYMENT.md` | Hosting and domain reference. |

## Change map

| Change | Main location |
| --- | --- |
| Add or remove a project | Project sections in `index.html` |
| Add photographs | Source photo folder, then `npm.cmd run photos:sync` |
| Change a photograph title or alt text | `photography/photo-details.json`, then run the sync |
| Change a project URL | Every matching anchor in `index.html` |
| Change global colours | `:root` custom properties |
| Change homepage layout | `home.css` |
| Change photography layout | `photography/photography.css` |
| Change mobile layout | Media queries in the relevant stylesheet |
| Change metadata | `<head>` title, description, Open Graph tags, and theme colour |
| Change analytics | The Google tag block |

## Design constraints

- Project data is manually maintained.
- The common navigation is copied across several independent repositories rather than imported from a shared package.
- No project availability check is performed; every project row always renders.
