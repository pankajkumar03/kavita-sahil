/**
 * Builds ONE self-contained, shareable HTML file of the invitation:
 * code, styles, decorations, the song and any photos in /public/images are all embedded.
 *
 *   npm run build:single   →   share/<Bride>-<Groom>-Engagement-Invitation.html
 *
 * Needs internet only for the Google fonts (falls back to Georgia) and the live map.
 */
import { execSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const pub = join(root, "public");
const MIME = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".m4a": "audio/mp4" };
const dataUri = (file, mime) => `data:${mime};base64,${readFileSync(file).toString("base64")}`;
const mb = (bytes) => (bytes / 1024 / 1024).toFixed(1) + " MB";

// 1. Build with everything inlined
console.log("› Building single-file bundle…");
execSync("npx vite build", { cwd: root, stdio: "inherit", env: { ...process.env, SINGLE_FILE: "1" } });
let html = readFileSync(join(root, "dist-single", "index.html"), "utf8");

// 2. Embed the song (a lighter 64 kbps copy if ffmpeg is installed — fine for solo violin)
const song = join(pub, "music", "background.mp3");
if (existsSync(song)) {
  let file = song;
  const light = join(tmpdir(), `invitation-song-${Date.now()}.mp3`);
  const ff = spawnSync("ffmpeg", ["-v", "error", "-y", "-i", song, "-codec:a", "libmp3lame", "-b:a", "64k", "-ac", "1", "-map_metadata", "-1", light]);
  if (ff.status === 0 && existsSync(light)) file = light;
  else console.log("  (ffmpeg not found — embedding the song as is)");
  const uri = dataUri(file, "audio/mpeg");
  const count = html.split('"/music/background.mp3"').length - 1;
  html = html.replaceAll('"/music/background.mp3"', JSON.stringify(uri));
  console.log(`› Song embedded (${mb(statSync(file).size)}, ${count} reference${count === 1 ? "" : "s"})`);
  if (file !== song) rmSync(file);
} else {
  console.log("› No public/music/background.mp3 — the music button will stay hidden");
}

// 3. Embed any photos that exist (missing ones keep their elegant placeholder)
const imgDir = join(pub, "images");
let photos = 0;
for (const name of existsSync(imgDir) ? readdirSync(imgDir) : []) {
  const mime = MIME[extname(name).toLowerCase()];
  const ref = `"/images/${name}"`;
  if (!mime || !html.includes(ref)) continue;
  html = html.replaceAll(ref, JSON.stringify(dataUri(join(imgDir, name), mime)));
  photos++;
}
// Photos not added yet: blank the path so the page shows its placeholder without a failed request
const missing = html.match(/"\/images\/[^"]+"/g) ?? [];
html = html.replace(/"\/images\/[^"]+"/g, '""');
console.log(`› Photos embedded: ${photos}${missing.length ? ` (${missing.length} not added yet → placeholders)` : ""}`);

// 4. Inline the icon; drop the web-app manifest (it can't load from a local file)
html = html.replace(/href="\.\/favicon\.svg"/, `href="${dataUri(join(pub, "favicon.svg"), "image/svg+xml")}"`);
html = html.replace(/\s*<link rel="manifest"[^>]*>/, "");

// 5. Write it out
// Named after the couple, taken from the page title ("Kavita &amp; Sahil — Engagement Invitation")
const title = (html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "").replace(/&amp;/g, "&");
const couple = title.split("—")[0].trim();
const slug = (s) => s.replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "");
const name = couple ? `${slug(couple)}-Engagement-Invitation.html` : "Engagement-Invitation.html";
mkdirSync(join(root, "share"), { recursive: true });
const out = join(root, "share", name);
writeFileSync(out, html);
console.log(`\n✓ ${out}\n  ${mb(Buffer.byteLength(html))} — open it in any browser, or send the file.`);
