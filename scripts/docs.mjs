import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE || "http://localhost:4421";
const OUT = "/tmp/docs";
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

async function grab(path, name, buttonRe) {
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  const [download] = await Promise.all([
    page.waitForEvent("download", { timeout: 20000 }),
    page.getByRole("button", { name: buttonRe }).first().click(),
  ]);
  await download.saveAs(`${OUT}/${name}`);
  console.log("got", name);
}

await grab("/specimen", "audit.pdf", /download the full audit/i);
await grab("/brand", "brand.pdf", /brand standard/i);
await grab("/brand", "proposal.pdf", /proposal template/i);
await grab("/brand", "letterhead.pdf", /letterhead/i);

await browser.close();
console.log("done");
