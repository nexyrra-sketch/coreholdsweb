import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE || "http://localhost:4311";
const OUT = process.env.OUT || "/tmp/slices";
const PATHS = (process.env.PATHS || "/").split(",");
const W = Number(process.env.W || 1440);
const H = Number(process.env.H || 900);
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
  args: ["--no-sandbox"],
});
const ctx = await browser.newContext({
  viewport: { width: W, height: H },
  deviceScaleFactor: 1,
  reducedMotion: "reduce",
});
const page = await ctx.newPage();

for (const path of PATHS) {
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  // force every reveal in
  await page.evaluate(() => {
    document.querySelectorAll("[data-reveal],[data-scribe]").forEach((el) => {
      if (el.hasAttribute("data-scribe")) el.setAttribute("data-scribe", "in");
      else el.setAttribute("data-reveal", "in");
    });
  });
  await page.waitForTimeout(300);
  const total = await page.evaluate(() => document.body.scrollHeight);
  const slug = path === "/" ? "home" : path.replace(/\//g, "");
  const steps = Math.ceil(total / H);
  for (let i = 0; i < steps; i += 1) {
    await page.evaluate((y) => window.scrollTo(0, y), i * H);
    await page.waitForTimeout(220);
    await page.screenshot({ path: `${OUT}/${slug}-${W}-${String(i).padStart(2, "0")}.png` });
  }
}

await browser.close();
console.log("done");
