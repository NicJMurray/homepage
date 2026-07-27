import { access, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaultSource = "C:\\Users\\nicjm\\Pictures\\njmurray";
const source = path.resolve(process.argv[2] || process.env.NJM_PHOTO_SOURCE || defaultSource);
const output = path.join(root, "photography", "photos");
const detailsPath = path.join(root, "photography", "photo-details.json");
const manifestPath = path.join(root, "photography", "gallery.json");
const supported = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"]);
const sizes = [
  { suffix: "960", width: 960, quality: 80 },
  { suffix: "1920", width: 1920, quality: 84 },
];

await access(source).catch(() => {
  throw new Error(`Photo folder not found: ${source}`);
});

const details = JSON.parse(await readFile(detailsPath, "utf8"));
const detailMap = new Map(details.map((item) => [item.file.toLowerCase(), item]));
const files = (await readdir(source, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && supported.has(path.extname(entry.name).toLowerCase()))
  .map((entry) => entry.name)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

if (files.length === 0) {
  throw new Error(`No supported photos found in: ${source}`);
}

await mkdir(output, { recursive: true });

const gallery = [];

for (const [index, file] of files.entries()) {
  const input = path.join(source, file);
  const slug = path.basename(file, path.extname(file)).toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const metadata = await sharp(input).metadata();
  const swapsDimensions = [5, 6, 7, 8].includes(metadata.orientation);
  const width = swapsDimensions ? metadata.height : metadata.width;
  const height = swapsDimensions ? metadata.width : metadata.height;

  if (!width || !height) {
    throw new Error(`Could not read dimensions for ${file}`);
  }

  for (const size of sizes) {
    await sharp(input)
      .rotate()
      .resize({
        width: size.width,
        withoutEnlargement: true,
        fit: "inside",
      })
      .webp({
        quality: size.quality,
        effort: 5,
        smartSubsample: true,
      })
      .toFile(path.join(output, `${slug}-${size.suffix}.webp`));
  }

  const detail = detailMap.get(file.toLowerCase());
  gallery.push({
    id: slug,
    file,
    title: detail?.title || `Photograph ${String(index + 1).padStart(2, "0")}`,
    alt: detail?.alt || `Photograph from Nic Murray's collection`,
    width,
    height,
    src: `photos/${slug}-960.webp`,
    large: `photos/${slug}-1920.webp`,
  });
}

await writeFile(manifestPath, `${JSON.stringify(gallery, null, 2)}\n`, "utf8");
console.log(`Prepared ${gallery.length} photographs from ${source}`);
console.log(`Gallery manifest: ${manifestPath}`);
