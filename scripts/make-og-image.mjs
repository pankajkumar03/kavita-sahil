/**
 * Renders the WhatsApp / social link-preview picture (1200×630) to match the site's hero:
 * a wide haveli arch card with Shri Ganesh, the names on one line, the ceremony, date and place.
 *
 *   npm run og   →   public/images/og-cover.jpg
 *
 * Uses the installed Chrome or Edge (headless) and reads all text from src/config/invitation.ts.
 * Re-run it after changing the details or the emblem.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { extname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { transform } from "esbuild";

const root = fileURLToPath(new URL("..", import.meta.url));

// Load the TypeScript config without a build step
const ts = readFileSync(join(root, "src/config/invitation.ts"), "utf8");
const { code } = await transform(ts, { loader: "ts", format: "esm" });
const { invitation } = await import("data:text/javascript," + encodeURIComponent(code));
const { bride, groom, event, hero } = invitation;

const [y, m, d] = event.date.split("-").map(Number);
const day = new Date(Date.UTC(y, m - 1, d));
const fmt = (o) => new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", ...o }).format(day);
const [hh, mm] = event.time.split(":").map(Number);
const time = `${hh % 12 || 12}:${String(mm).padStart(2, "0")} ${hh >= 12 ? "PM" : "AM"}`;
const place = [event.address, event.city.split(",")[0]].filter(Boolean).join(", ");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

// Shri Ganesh (or whichever emblem the site uses)
const MIME = { ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml" };
const emblemPath = hero.emblem ? join(root, "public", hero.emblem.replace(/^\//, "")) : "";
const emblem =
  emblemPath && existsSync(emblemPath)
    ? `data:${MIME[extname(emblemPath).toLowerCase()] || "image/png"};base64,${readFileSync(emblemPath).toString("base64")}`
    : "";

const ARCH = "M0 100V36C0 20 16 13 30 10C40 7.5 46 4 50 0C54 4 60 7.5 70 10C84 13 100 20 100 36V100Z";
const archMask = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'><path d='${ARCH}'/></svg>`)}")`;
const jaali = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><g fill='none' stroke='#C8A15A' stroke-opacity='.2' stroke-width='.7'><circle cx='16' cy='16' r='8'/><circle cx='0' cy='0' r='8'/><circle cx='32' cy='0' r='8'/><circle cx='0' cy='32' r='8'/><circle cx='32' cy='32' r='8'/></g></svg>`)}")`;

const mandala = `<svg viewBox="0 0 120 120"><g fill="none" stroke="#C8A15A" stroke-width=".55"><circle cx="60" cy="60" r="6"/><circle cx="60" cy="60" r="13"/><circle cx="60" cy="60" r="41"/>${Array.from({ length: 8 }, (_, i) => `<path d="M60 47C65 38 65 29 60 20 55 29 55 38 60 47Z" transform="rotate(${i * 45} 60 60)"/>`).join("")}${Array.from({ length: 16 }, (_, i) => `<path d="M60 19C62.5 15 62.5 11 60 7 57.5 11 57.5 15 60 19Z" transform="rotate(${i * 22.5} 60 60)"/>`).join("")}</g>${Array.from({ length: 16 }, (_, i) => `<circle cx="60" cy="14" r=".9" fill="#C8A15A" transform="rotate(${i * 22.5 + 11.25} 60 60)"/>`).join("")}</svg>`;

// Corner sprig with rose and marigold, matching the site's line art
const leaf = (x, yy, r) => `<g transform="translate(${x} ${yy}) rotate(${r})"><path d="M0 0C5-6 15-6.5 21 0 15 6.5 5 6 0 0Z" fill="#7B8064" fill-opacity=".28" stroke="#7B8064" stroke-width=".7"/></g>`;
const sprig = `<svg viewBox="0 0 200 200" width="170"><path d="M8 12C60 16 110 14 190 30M12 8C16 60 14 110 30 190" fill="none" stroke="#7B8064" stroke-width=".8"/>${[[50, 15, -28], [80, 16, 30], [112, 18, -24], [146, 23, 28]].map(([a, b, c]) => leaf(a, b, c)).join("")}${[[15, 50, 118], [16, 80, 60], [18, 112, 114], [23, 146, 62]].map(([a, b, c]) => leaf(a, b, c)).join("")}<circle cx="28" cy="28" r="13" fill="#F3E1DD"/><path d="M19 32C17 22 27 16 35 20S40 33 32 36 22 33 24 27 31 23 32 28" fill="none" stroke="#8F2635" stroke-width="1"/><g transform="translate(64 24)">${Array.from({ length: 12 }, (_, i) => `<ellipse cy="-8" rx="3.2" ry="4.4" transform="rotate(${i * 30})" fill="#D8BB7A" fill-opacity=".6" stroke="#C8A15A" stroke-width=".5"/>`).join("")}<circle r="5" fill="#D8BB7A"/></g></svg>`;

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@500&family=Noto+Serif+Devanagari:wght@500&display=block" rel="stylesheet">
<style>
  *{margin:0;box-sizing:border-box}
  html,body{width:1200px;height:630px;overflow:hidden}
  body{background:#FFF8ED;font-family:"DM Sans",sans-serif;position:relative}
  .b1{position:absolute;inset:12px;border:1.5px solid rgba(200,161,90,.55)}
  .b2{position:absolute;inset:19px;border:1px solid rgba(200,161,90,.3)}
  .arch{position:absolute;left:70px;right:70px;top:30px;bottom:34px}
  .arch .line{position:absolute;overflow:visible}
  .arch .outer{left:-12px;top:-12px;width:calc(100% + 24px);height:calc(100% + 12px)}
  .arch .inner{left:-5px;top:-5px;width:calc(100% + 10px);height:calc(100% + 5px)}
  .card{position:absolute;inset:0;overflow:hidden;-webkit-mask:${archMask} 0 0/100% 100% no-repeat;mask:${archMask} 0 0/100% 100% no-repeat;
    background:${jaali},radial-gradient(ellipse 70% 75% at 50% 55%,#fffdf9 0%,#fbf1ea 45%,#f3e1dd 100%)}
  .mandala{position:absolute;left:50%;top:58%;width:640px;transform:translate(-50%,-50%);opacity:.28}
  .mandala svg{display:block;width:100%}
  .content{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding-top:62px;text-align:center}
  .ganesh{width:178px;height:auto;mix-blend-mode:multiply;margin-bottom:4px}
  .deva{font-family:"Noto Serif Devanagari",serif;font-size:21px;color:#6B1F2A}
  .names{margin-top:6px;font-family:"Cormorant Garamond",serif;font-variant-caps:small-caps;color:#6B1F2A;font-size:96px;line-height:1;font-weight:400;display:flex;align-items:baseline;gap:22px}
  .names .amp{font-variant-caps:normal;font-style:italic;color:#8A6A2F;font-size:60px}
  .label{margin-top:16px;font-size:17px;letter-spacing:.38em;text-transform:uppercase;color:#6B1F2A}
  .rule{width:340px;height:1px;background:linear-gradient(90deg,transparent,#C8A15A,transparent);margin:16px 0 13px}
  .date{font-family:"Cormorant Garamond",serif;font-size:32px;color:#382820;letter-spacing:.05em;font-variant-numeric:lining-nums}
  .place{margin-top:8px;font-size:14px;letter-spacing:.24em;text-transform:uppercase;color:#8A6A2F}
  .sprig{position:absolute}
  .tl{top:14px;left:52px}
  .br{bottom:18px;right:52px;transform:scale(-1,-1)}
  .paisley{position:absolute;top:52%;width:22px}
  .pl{left:30px}.pr{right:30px;transform:scaleX(-1)}
</style></head><body>
<div class="b1"></div><div class="b2"></div>
<div class="arch">
  <svg class="line outer" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${ARCH}" fill="none" stroke="#C8A15A" stroke-opacity=".55" stroke-width="1.2" vector-effect="non-scaling-stroke"/></svg>
  <svg class="line inner" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${ARCH}" fill="none" stroke="#C8A15A" stroke-width="1.4" vector-effect="non-scaling-stroke"/></svg>
  <div class="card">
    <div class="mandala">${mandala}</div>
    <div class="content">
      ${emblem ? `<img class="ganesh" src="${emblem}">` : ""}
      <div class="deva">॥ शुभ सगाई ॥</div>
      <div class="names"><span>${esc(bride.name)}</span><span class="amp">&amp;</span><span>${esc(groom.name)}</span></div>
      <div class="label">${esc(event.title)}</div>
      <div class="rule"></div>
      <div class="date">${fmt({ weekday: "long" })} · ${fmt({ day: "numeric", month: "long", year: "numeric" })} · ${time}</div>
      <div class="place">${esc(place)}</div>
    </div>
  </div>
</div>
<div class="sprig tl">${sprig}</div><div class="sprig br">${sprig}</div>
<svg class="paisley pl" viewBox="0 0 40 60"><g fill="none" stroke="#C8A15A" stroke-width="1.1" stroke-linecap="round"><path d="M22 56C8 52 2 38 6 26 10 14 22 8 30 14 37 19 36 30 28 32 22 34 18 28 22 24"/><path d="M20 49C12 45 9 36 12 28 15 20 23 17 27 21"/></g></svg>
<svg class="paisley pr" viewBox="0 0 40 60"><g fill="none" stroke="#C8A15A" stroke-width="1.1" stroke-linecap="round"><path d="M22 56C8 52 2 38 6 26 10 14 22 8 30 14 37 19 36 30 28 32 22 34 18 28 22 24"/><path d="M20 49C12 45 9 36 12 28 15 20 23 17 27 21"/></g></svg>
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
];
const browser = browsers.find((b) => existsSync(b)) || "google-chrome";
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
