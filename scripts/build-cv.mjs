// Prints the Portuguese CV (cv/full-stack-pt.html) to public/cv/ as an A4 PDF.
//
//   npm run cv:pdf
//
// The English PDF in public/cv/ is Luis's own file (made from a .docx) and is not generated here.
import { chromium } from "@playwright/test";
import { stat } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const root = join(import.meta.dirname, "..");
const source = join(root, "cv", "full-stack-pt.html");
const output = join(root, "public", "cv", "luis-nicolau-full-stack-cv-pt.pdf");

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(source).href, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);

const family = await page.evaluate(() => document.fonts.check('12px "Carlito"'));
if (!family) throw new Error("Carlito did not load; the PDF would fall back to another font.");

await page.pdf({ path: output, format: "A4", preferCSSPageSize: true, printBackground: true, tagged: true, outline: true });
await browser.close();

const { size } = await stat(output);
console.log(`Wrote ${output} (${Math.round(size / 1024)} KB)`);
