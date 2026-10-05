/**
 * Renders the WhatsApp / social link-preview picture (1200×630) in the invitation's style:
 * the couple photo in a haveli arch beside the names, date and place.
 *
 *   npm run og   →   public/images/og-cover.jpg
 *
 * Uses the installed Chrome or Edge (headless) and reads all text from src/config/invitation.ts.
 * Re-run it after changing the photo or details.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { transform } from "esbuild";

const root = fileURLToPath(new URL("..", import.meta.url));

// Load the TypeScript config without a build step
const ts = readFileSync(join(root, "src/config/invitation.ts"), "utf8");
const { code } = await transform(ts, { loader: "ts", format: "esm" });
const { invitation } = await import("data:text/javascript," + encodeURIComponent(code));
const { bride, groom, event, hero, text } = invitation;

const [y, m, d] = event.date.split("-").map(Number);
const day = new Date(Date.UTC(y, m - 1, d));
const fmt = (o) => new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", ...o }).format(day);
const [hh, mm] = event.time.split(":").map(Number);
const time = `${hh % 12 || 12}:${String(mm).padStart(2, "0")} ${hh >= 12 ? "PM" : "AM"}`;
const place = [event.address, event.city.split(",")[0]].filter(Boolean).join(", ");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

const photoPath = join(root, "public", hero.image.replace(/^\//, ""));
const photo = existsSync(photoPath) ? `data:image/jpeg;base64,${readFileSync(photoPath).toString("base64")}` : "";
const focus = hero.imagePosition || "50% 0%";
const ARCH = "M0 100V36C0 20 16 13 30 10C40 7.5 46 4 50 0C54 4 60 7.5 70 10C84 13 100 20 100 36V100Z";
const mask = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'><path d='${ARCH}'/></svg>`)}")`;

// A small gold lotus and a corner sprig, matching the site's line art
const lotus = `<svg viewBox="0 0 64 44" width="70"><g fill="#D8BB7A" fill-opacity=".25" stroke="#C8A15A" stroke-width="1.1" stroke-linejoin="round"><path d="M32 36C22 36 10 32 4 24 14 23 24 28 32 36Z"/><path d="M32 36C42 36 54 32 60 24 50 23 40 28 32 36Z"/><path d="M32 36C24 32 16 24 14 13 22 16 29 25 32 36Z"/><path d="M32 36C40 32 48 24 50 13 42 16 35 25 32 36Z"/><path d="M32 4C38 13 38 26 32 36 26 26 26 13 32 4Z"/></g><path d="M12 40H52" stroke="#C8A15A"/></svg>`;
const leaf = (x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M0 0C5-6 15-6.5 21 0 15 6.5 5 6 0 0Z" fill="#7B8064" fill-opacity=".28" stroke="#7B8064" stroke-width=".7"/></g>`;
const sprig = `<svg viewBox="0 0 200 200" width="190"><path d="M8 12C60 16 110 14 190 30M12 8C16 60 14 110 30 190" fill="none" stroke="#7B8064" stroke-width=".8"/>${[[50, 15, -28], [80, 16, 30], [112, 18, -24], [146, 23, 28]].map(([a, b, c]) => leaf(a, b, c)).join("")}${[[15, 50, 118], [16, 80, 60], [18, 112, 114], [23, 146, 62]].map(([a, b, c]) => leaf(a, b, c)).join("")}<circle cx="28" cy="28" r="13" fill="#F3E1DD"/><path d="M19 32C17 22 27 16 35 20S40 33 32 36 22 33 24 27 31 23 32 28" fill="none" stroke="#8F2635" stroke-width="1"/><g transform="translate(64 24)">${Array.from({ length: 12 }, (_, i) => `<ellipse cy="-8" rx="3.2" ry="4.4" transform="rotate(${i * 30})" fill="#D8BB7A" fill-opacity=".6" stroke="#C8A15A" stroke-width=".5"/>`).join("")}<circle r="5" fill="#D8BB7A"/></g></svg>`;

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@500&family=Noto+Serif+Devanagari:wght@500&display=block" rel="stylesheet">
<style>
  *{margin:0;box-sizing:border-box}
  html,body{width:1200px;height:630px;overflow:hidden}
  body{background:radial-gradient(ellipse 60% 80% at 68% 50%,#fff,#FFF8ED 70%),#FFF8ED;font-family:"DM Sans",sans-serif;position:relative}
  .b1{position:absolute;inset:18px;border:1.5px solid rgba(200,161,90,.6)}
  .b2{position:absolute;inset:26px;border:1px solid rgba(200,161,90,.32)}
  .sprig{position:absolute}
  .tl{top:22px;left:22px}.br{bottom:22px;right:22px;transform:scale(-1,-1)}
  .photo{position:absolute;left:96px;top:70px;width:372px;height:490px}
  .photo .line{position:absolute;inset:-12px -12px 0 -12px;width:calc(100% + 24px);height:calc(100% + 12px)}
  .photo .img{position:absolute;inset:0;-webkit-mask:${mask} 0 0/100% 100% no-repeat;mask:${mask} 0 0/100% 100% no-repeat;
    background:${photo ? `url(${photo}) ${focus}/cover no-repeat` : "#F3E1DD"}}
  .text{position:absolute;left:520px;right:60px;top:0;bottom:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
  .deva{font-family:"Noto Serif Devanagari",serif;font-size:24px;color:#6B1F2A;margin-top:6px}
  .label{font-size:16px;letter-spacing:.38em;text-transform:uppercase;color:#8A6A2F;margin:16px 0 4px}
  .names{font-family:"Cormorant Garamond",serif;font-variant-caps:small-caps;color:#6B1F2A;font-size:100px;line-height:.98;font-weight:400}
  .amp{font-family:"Cormorant Garamond",serif;font-style:italic;color:#8A6A2F;font-size:54px;line-height:1;display:flex;align-items:center;gap:18px;justify-content:center}
  .amp i{display:block;width:70px;height:1px;background:linear-gradient(90deg,transparent,#C8A15A)}
  .amp i+span+i{background:linear-gradient(90deg,#C8A15A,transparent)}
  .rule{width:300px;height:1px;background:linear-gradient(90deg,transparent,#C8A15A,transparent);margin:20px 0 16px}
  .date{font-family:"Cormorant Garamond",serif;font-size:34px;color:#382820;letter-spacing:.04em;font-variant-numeric:lining-nums}
  .place{font-size:15px;letter-spacing:.22em;text-transform:uppercase;color:#8A6A2F;margin-top:10px}
</style></head><body>
<div class="b1"></div><div class="b2"></div>
<div class="sprig tl">${sprig}</div><div class="sprig br">${sprig}</div>
<div class="photo">
  <svg class="line" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${ARCH}" fill="none" stroke="#C8A15A" stroke-width="1.2" vector-effect="non-scaling-stroke"/></svg>
  <div class="img"></div>
</div>
<div class="text">
  ${lotus}
  <div class="deva">${esc(text.invocation.includes("गणेश") ? "॥ शुभ सगाई ॥" : text.invocation)}</div>
  <div class="label">${esc(event.title)}</div>
  <div class="names">${esc(bride.name)}</div>
  <div class="amp"><i></i><span>&amp;</span><i></i></div>
  <div class="names">${esc(groom.name)}</div>
  <div class="rule"></div>
  <div class="date">${fmt({ weekday: "long" })} · ${fmt({ day: "numeric", month: "long", year: "numeric" })} · ${time}</div>
  <div class="place">${esc(place)}</div>
</div>
</body></html>`;

const dir = mkdtempSync(join(tmpdir(), "og-"));
const page = join(dir, "og.html");
const png = join(dir, "og.png");
writeFileSync(page, html);

const browsers = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "google-chrome",
  "chromium",
];
const browser = browsers.find((b) => !b.includes("\\") && !b.startsWith("/") ? true : existsSync(b));
console.log(`› Rendering with ${browser}`);
const run = spawnSync(
  browser,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "--window-size=1200,630",
    "--virtual-time-budget=8000",
    `--screenshot=${png}`,
    pathToFileURL(page).href,
  ],
  { stdio: "pipe" },
);
if (!existsSync(png)) {
  console.error(run.stderr?.toString() || "Screenshot failed");
  process.exit(1);
}

const out = join(root, "public", "images", "og-cover.jpg");
const ff = spawnSync("ffmpeg", ["-v", "error", "-y", "-i", png, "-q:v", "3", out]);
if (ff.status !== 0) {
  writeFileSync(out, readFileSync(png)); // PNG bytes still display fine everywhere
  console.log("  (ffmpeg not found — saved as PNG data)");
}
rmSync(dir, { recursive: true, force: true });
console.log(`✓ ${out}`);
