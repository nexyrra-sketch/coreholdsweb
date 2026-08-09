import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE || "http://localhost:4320";
const OUT = "/tmp/qa";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
  args: ["--no-sandbox"],
});
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  acceptDownloads: true,
});
const page = await ctx.newPage();

const settle = () => page.waitForTimeout(500);

// ---------------------------------------------------------- boot sequence --
await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/00-boot.png` });
await page.waitForTimeout(2200);

// ------------------------------------------------------- dependency graph --
const graphTop = await page.evaluate(() => {
  const el = document.querySelector("canvas");
  return el ? window.scrollY + el.getBoundingClientRect().top : 0;
});
for (const [i, frac] of [0.05, 0.4, 0.75, 0.97].entries()) {
  await page.evaluate(
    ([top, f]) => window.scrollTo(0, top + window.innerHeight * 2.2 * f),
    [graphTop, frac],
  );
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/10-graph-${i}.png` });
}

// -------------------------------------------------------- landlord switch --
await page.evaluate(() => document.getElementById("position")?.scrollIntoView());
await settle();
const toggle = page.locator('button[aria-pressed]').first();
await toggle.scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/20-switch-live.png` });
await toggle.click();
await page.waitForTimeout(1100);
await page.screenshot({ path: `${OUT}/21-switch-mid.png` });
await page.waitForTimeout(1800);
await page.screenshot({ path: `${OUT}/22-switch-dead.png` });

// --------------------------------------------------------- ownership model --
const figure = page.locator("figure").first();
await figure.scrollIntoViewIfNeeded();
await page.waitForTimeout(2000);
await page.screenshot({ path: `${OUT}/30-model.png` });

// PDF download
const [download] = await Promise.all([
  page.waitForEvent("download", { timeout: 8000 }),
  page.getByRole("button", { name: /download the sheet/i }).click(),
]);
await download.saveAs("/tmp/qa/rent-exposure.pdf");

// ------------------------------------------------------- command palette ---
await page.keyboard.press("Meta+k");
await page.waitForTimeout(400);
await page.keyboard.type("hand");
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/40-palette.png` });
await page.keyboard.press("Escape");

// ------------------------------------------------------------ method core --
await page.goto(BASE + "/method", { waitUntil: "networkidle" });
await page.evaluate(() => window.scrollTo(0, 2600));
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}/50-core.png` });

// ---------------------------------------------------------------- system ---
await page.goto(BASE + "/system", { waitUntil: "networkidle" });
await page.evaluate(() =>
  document
    .querySelectorAll("[data-reveal],[data-scribe]")
    .forEach((el) =>
      el.setAttribute(
        el.hasAttribute("data-scribe") ? "data-scribe" : "data-reveal",
        "in",
      ),
    ),
);
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/60-system.png` });
await page.evaluate(() => window.scrollTo(0, 1400));
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/61-system.png` });

await browser.close();
console.log("qa done");
