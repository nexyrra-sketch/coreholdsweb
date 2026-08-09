import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE || "http://localhost:4501";
const OUT = process.env.OUT || "/tmp/stage";
const W = Number(process.env.W || 1440);
const H = Number(process.env.H || 900);
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
  args: ["--no-sandbox", "--use-gl=swiftshader", "--enable-unsafe-swiftshader"],
});
const ctx = await browser.newContext({
  viewport: { width: W, height: H },
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();

const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(2600); // let the boot sequence clear

const total = await page.evaluate(() => document.body.scrollHeight);
const steps = Math.min(14, Math.ceil(total / H));

for (let i = 0; i < steps; i += 1) {
  await page.evaluate((y) => window.scrollTo(0, y), i * H * 0.85);
  await page.waitForTimeout(700);
  await page.evaluate(() => {
    document
      .querySelectorAll("[data-reveal],[data-scribe]")
      .forEach((el) =>
        el.setAttribute(
          el.hasAttribute("data-scribe") ? "data-scribe" : "data-reveal",
          "in",
        ),
      );
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/${W}-${String(i).padStart(2, "0")}.png` });
}

const gl = await page.evaluate(() => {
  const c = document.createElement("canvas");
  return Boolean(c.getContext("webgl2"));
});

await browser.close();
console.log("webgl2:", gl);
console.log("console errors:", errors.length ? errors.slice(0, 5) : "none");
