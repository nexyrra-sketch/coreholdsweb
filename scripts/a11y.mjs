import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const BASE = process.env.BASE || "http://localhost:4311";
const paths = [
  "/",
  "/method",
  "/ownership",
  "/capabilities",
  "/audit",
  "/register",
  "/ledger",
  "/specimen",
  "/standard",
  "/manifesto",
  "/card",
  "/brand",
  "/system",
  "/ar",
  "/ar/method",
  "/ar/ownership",
  "/ar/capabilities",
  "/ar/audit",
  "/nope",
];

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
  args: ["--no-sandbox"],
});

let failures = 0;

for (const width of [1440, 390]) {
  const ctx = await browser.newContext({
    viewport: { width, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  for (const path of paths) {
    await page.goto(BASE + path, { waitUntil: "networkidle" });
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
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
      .analyze();
    if (results.violations.length) {
      failures += results.violations.length;
      console.log(`\n=== ${path} @ ${width} ===`);
      for (const v of results.violations) {
        console.log(`- [${v.impact}] ${v.id}: ${v.help}`);
        for (const n of v.nodes.slice(0, 3)) {
          console.log(`    ${n.target.join(" ")}`);
          if (n.failureSummary)
            console.log(
              `    ${n.failureSummary.replace(/\n/g, " ").slice(0, 200)}`,
            );
        }
      }
    }
  }
  await ctx.close();
}

await browser.close();
console.log(failures === 0 ? "\nNO VIOLATIONS" : `\n${failures} violation groups`);
