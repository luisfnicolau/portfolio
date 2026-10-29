// Crops Luis's photo into the sizes the site uses, without metadata (no camera or location data).
//
//   node scripts/prepare-photo.mjs ~/Downloads/photo.jpg [--face 0.47,0.25] [--portrait 0.14,0.08,0.76]
//
// --face      centre of the face, as fractions of width and height (for the square headshot)
// --portrait  left, top and width of the 4:5 portrait, as fractions (head to hands)
// Defaults fit the current photo (smiling, sitting, face near the top third).
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const [source, ...flags] = process.argv.slice(2);
if (!source) {
  console.error("Usage: node scripts/prepare-photo.mjs <photo.jpg> [--face x,y] [--portrait left,top,width]");
  process.exit(1);
}
const flag = (name, fallback) => {
  const i = flags.indexOf(`--${name}`);
  return (i >= 0 ? flags[i + 1] : fallback).split(",").map(Number);
};
const [faceX, faceY] = flag("face", "0.47,0.25");
const [left, top, width] = flag("portrait", "0.14,0.08,0.76");

const root = join(import.meta.dirname, "..");
const { width: W, height: H } = await sharp(source).metadata();

// 4:5 portrait for the About section.
const pw = Math.round(width * W);
const portraitBox = { left: Math.round(left * W), top: Math.round(top * H), width: pw, height: Math.round(pw * 1.25) };
// Square headshot around the face: 36% of the photo's width.
const side = Math.round(0.36 * W);
const faceBox = {
  left: Math.max(0, Math.round(faceX * W - side / 2)),
  top: Math.max(0, Math.round(faceY * H - side / 2)),
  width: side,
  height: side,
};
for (const [name, box] of Object.entries({ portrait: portraitBox, face: faceBox }))
  if (box.left + box.width > W || box.top + box.height > H) throw new Error(`${name} crop leaves the photo: ${JSON.stringify(box)}`);

await mkdir(join(root, "src/assets/photo"), { recursive: true });
const out = [
  ["src/assets/photo/portrait.jpg", portraitBox, 1000, 1250],
  ["src/assets/photo/avatar.jpg", faceBox, 512, 512],
  ["public/luis-nicolau.jpg", faceBox, 800, 800],
];
for (const [file, box, w, h] of out) {
  const info = await sharp(source).rotate().extract(box).resize(w, h).jpeg({ quality: 84, mozjpeg: true }).toFile(join(root, file));
  console.log(`${file}: ${info.width}×${info.height}, ${Math.round(info.size / 1024)} KB`);
}
