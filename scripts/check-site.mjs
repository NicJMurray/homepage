import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
for (const file of ["index.html", "_headers", "_redirects", "projects.json"]) {
  await access(path.join(root, file));
}

const homepage = await readFile(path.join(root, "index.html"), "utf8");
const redirects = await readFile(path.join(root, "_redirects"), "utf8");
const catalog = JSON.parse(await readFile(path.join(root, "projects.json"), "utf8"));
if (catalog.schemaVersion !== 1 || !Array.isArray(catalog.projects) || catalog.projects.length === 0) {
  throw new Error("projects.json must contain a version 1 project catalog.");
}

const cards = new Map();
for (const match of homepage.matchAll(/<a\b([^>]*)>/g)) {
  const attributes = match[1];
  const id = attributes.match(/\bdata-project="([^"]+)"/)?.[1];
  if (!id) continue;
  if (cards.has(id)) throw new Error(`Duplicate project card: ${id}`);
  cards.set(id, attributes.match(/\bhref="([^"]+)"/)?.[1]);
}

const ids = new Set();
const urls = new Set();
for (const project of catalog.projects) {
  if (!project.id || !project.name || ids.has(project.id)) {
    throw new Error(`Missing or duplicate project ID/name: ${project.id}`);
  }
  ids.add(project.id);
  const url = new URL(project.url);
  if (url.protocol !== "https:" || urls.has(url.href)) {
    throw new Error(`Project URL must be unique HTTPS: ${project.id}`);
  }
  urls.add(url.href);
  if (!/^https:\/\/github\.com\/NicJMurray\/[^/]+$/.test(project.repository)) {
    throw new Error(`Missing GitHub repository for ${project.id}`);
  }
  if (!["pages", "worker"].includes(project.deployment?.type) || !project.deployment.name) {
    throw new Error(`Missing Cloudflare deployment mapping for ${project.id}`);
  }
  if (project.id !== "homepage") {
    if (!cards.has(project.id) || new URL(cards.get(project.id)).href !== url.href) {
      throw new Error(`Homepage card and catalog URL disagree: ${project.id}`);
    }
    cards.delete(project.id);
  }
}
if (cards.size > 0) throw new Error(`Cards missing from catalog: ${[...cards.keys()].join(", ")}`);

const finder = catalog.projects.find((project) => project.id === "playlist-finder");
const playlists = catalog.projects.find((project) => project.id === "playlists");
if (finder?.url !== "https://playlist.njmurray.com/" || playlists?.url !== "https://playlists.njmurray.com/") {
  throw new Error("Playlist Finder (singular) and Playlists (plural) must stay separate.");
}
const photographyImage = homepage.match(/class="card card--photography"[\s\S]*?<img\s+src="([^"]+)"/)?.[1];
if (!photographyImage || !photographyImage.startsWith("https://photography.njmurray.com/photos/")) {
  throw new Error("Photography card image must load from the independent photography site.");
}
for (const rule of [
  "/photography https://photography.njmurray.com/ 302",
  "/photography/* https://photography.njmurray.com/:splat 302",
]) {
  if (!redirects.split(/\r?\n/).includes(rule)) throw new Error(`Missing legacy redirect: ${rule}`);
}

console.log(`Site check passed: ${catalog.projects.length} projects, ${ids.size - 1} linked app cards.`);
