import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const required = [
  "index.html",
  "_headers",
  "photography/index.html",
  "photography/photography-20260727.css",
  "photography/gallery-20260727.js",
  "photography/gallery.json",
];

for (const file of required) {
  await access(path.join(root, file));
}

const gallery = JSON.parse(
  await readFile(path.join(root, "photography", "gallery.json"), "utf8"),
);

if (!Array.isArray(gallery) || gallery.length === 0) {
  throw new Error("Photography gallery is empty.");
}

for (const photo of gallery) {
  for (const key of ["id", "title", "alt", "src", "large", "width", "height"]) {
    if (!photo[key]) {
      throw new Error(`Gallery item ${photo.file || photo.id || "unknown"} is missing ${key}.`);
    }
  }

  await access(path.join(root, "photography", photo.src));
  await access(path.join(root, "photography", photo.large));
}

const homepage = await readFile(path.join(root, "index.html"), "utf8");
const photographyPage = await readFile(path.join(root, "photography", "index.html"), "utf8");

if (!homepage.includes('href="/photography/"')) {
  throw new Error("Homepage does not link to Photography.");
}

if (!photographyPage.includes("gallery-20260727.js")) {
  throw new Error("Photography page does not load the gallery.");
}

console.log(`Site check passed with ${gallery.length} photographs.`);
