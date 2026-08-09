/**
 * Generates the static Open Graph / Twitter card image from the site's own
 * design tokens and vendored typefaces. Run with `node scripts/og.mjs`.
 * Output: public/og.png (1200x630).
 */
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const archivo = `file://${root}/src/fonts/archivo-latin-wght-normal.woff2`;
const mono = `file://${root}/src/fonts/ibm-plex-mono-latin-500-normal.woff2`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Archivo;src:url('${archivo}') format('woff2');font-weight:100 900;}
@font-face{font-family:Plex;src:url('${mono}') format('woff2');font-weight:500;}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#0b0d0c;font-family:Archivo;position:relative;overflow:hidden;-webkit-font-smoothing:antialiased}
.grid{position:absolute;inset:0;background-image:
 linear-gradient(to right,rgba(201,205,200,.055) 1px,transparent 1px),
 linear-gradient(to bottom,rgba(201,205,200,.04) 1px,transparent 1px);
 background-size:100px 100px}
.wrap{position:relative;padding:72px 76px;height:100%;display:flex;flex-direction:column;justify-content:space-between}
.top{display:flex;align-items:center;gap:14px}
.word{font-size:27px;font-weight:600;letter-spacing:-.03em;color:#e8e7e1}
h1{font-size:82px;line-height:.94;letter-spacing:-.035em;font-weight:600;color:#e8e7e1;max-width:16ch}
h1 span{color:#7a827d;display:block}
.meta{display:flex;justify-content:space-between;align-items:flex-end;border-top:1px solid #232927;padding-top:24px}
.tag{font-family:Plex;font-size:14px;letter-spacing:.16em;text-transform:uppercase;color:#949b95}
.tag b{color:#d9622b;font-weight:500}
.big{position:absolute;right:64px;top:112px;opacity:.95}
</style></head><body>
<div class="grid"></div>
<svg class="big" width="392" height="392" viewBox="0 0 32 32" fill="none">
  <path d="M3 13.5V3h10.5" stroke="#232927" stroke-width="3" stroke-linecap="square"/>
  <path d="M29 18.5V29H18.5" stroke="#232927" stroke-width="3" stroke-linecap="square"/>
  <rect x="11" y="11" width="10" height="10" fill="#d9622b" opacity=".9"/>
</svg>
<div class="wrap">
  <div class="top">
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
      <path d="M3 13.5V3h10.5" stroke="#d9622b" stroke-width="3" stroke-linecap="square"/>
      <path d="M29 18.5V29H18.5" stroke="#d9622b" stroke-width="3" stroke-linecap="square"/>
      <rect x="11" y="11" width="10" height="10" fill="#d9622b"/>
    </svg>
    <span class="word">Corehold</span>
  </div>
  <h1>Own the system your business runs on.<span>Stop renting it.</span></h1>
  <div class="meta">
    <span class="tag">Intelligent systems studio &nbsp;·&nbsp; Dubai, UAE</span>
    <span class="tag"><b>&#9632;</b> &nbsp;No licences. No lock-in. No landlord.</span>
  </div>
</div>
</body></html>`;

writeFileSync("/tmp/og.html", html);

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
  args: ["--no-sandbox"],
});
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await page.goto("file:///tmp/og.html", { waitUntil: "networkidle" });
await page.waitForTimeout(500);
await page.screenshot({ path: `${root}/public/og.png` });
await browser.close();
console.log("wrote public/og.png");
