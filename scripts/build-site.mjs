import { copyFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.resolve(root, "dist");
const publicFiles = ["index.html", "_headers", "_redirects", "projects.json"];

// Keep the deletion and all copied files inside the dedicated build directory.
if (path.dirname(output) !== root || path.basename(output) !== "dist") {
  throw new Error("Refusing to build outside the repository's dist directory.");
}
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const file of publicFiles) {
  await copyFile(path.join(root, file), path.join(output, file));
}

console.log(`Built ${publicFiles.length} public files in dist/.`);
