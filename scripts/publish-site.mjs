import { access } from "node:fs/promises";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const stage = path.join(root, "dist");
await access(path.join(stage, "index.html"));
const commit = execFileSync("git", ["rev-parse", "HEAD"], {
  cwd: root,
  encoding: "utf8",
}).trim();
const changes = execFileSync("git", ["status", "--porcelain"], {
  cwd: root,
  encoding: "utf8",
}).trim();
if (changes) {
  throw new Error("Commit the intended source changes before publishing an exact Git revision.");
}
const wrangler = path.join(root, "node_modules", "wrangler", "bin", "wrangler.js");

const result = spawnSync(
  process.execPath,
  [
    wrangler,
    "pages",
    "deploy",
    stage,
    "--project-name",
    "homepage",
    "--branch",
    "main",
    "--commit-hash",
    commit,
    "--commit-dirty=false",
  ],
  { cwd: root, stdio: "inherit" },
);

if (result.error) throw result.error;
if (result.status !== 0) process.exitCode = result.status ?? 1;
