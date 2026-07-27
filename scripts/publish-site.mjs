import { cp, copyFile, mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const stage = await mkdtemp(path.join(os.tmpdir(), "njmurray-homepage-"));
const commit = execFileSync("git", ["rev-parse", "HEAD"], {
  cwd: root,
  encoding: "utf8",
}).trim();
const npx = process.platform === "win32" ? "npx.cmd" : "npx";

try {
  await copyFile(path.join(root, "index.html"), path.join(stage, "index.html"));
  await copyFile(path.join(root, "_headers"), path.join(stage, "_headers"));
  await cp(path.join(root, "photography"), path.join(stage, "photography"), {
    recursive: true,
  });

  const result = spawnSync(
    npx,
    [
      "wrangler",
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
    {
      cwd: root,
      stdio: "inherit",
    },
  );

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exitCode = result.status ?? 1;
  }
} finally {
  await rm(stage, { recursive: true, force: true });
}
