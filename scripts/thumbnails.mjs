/**
 * Runs after `astro build`. Makes small WebP copies of every photo so pages
 * don't download the full 1200px photo for a thumbnail:
 *   dist/images/thumbs/sm/<name>.webp  - 200px wide (gallery thumbnails)
 *   dist/images/thumbs/md/<name>.webp  - 640px wide (product cards)
 * The originals in public/images are not touched.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'dist/images';
const SIZES = { sm: 200, md: 640 };
const IMAGE = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const files = (await fs.readdir(SRC, { withFileTypes: true }))
  .filter((f) => f.isFile() && IMAGE.has(path.extname(f.name).toLowerCase()))
  .map((f) => f.name)
  // a photo and its .webp copy share a name: use the original (jpg/png) first
  .sort((a, b) => Number(a.endsWith('.webp')) - Number(b.endsWith('.webp')));

for (const size of Object.keys(SIZES)) await fs.mkdir(path.join(SRC, 'thumbs', size), { recursive: true });

const done = new Set();
let count = 0;
for (const file of files) {
  const name = path.basename(file, path.extname(file));
  if (done.has(name)) continue;
  done.add(name);
  try {
    const input = await fs.readFile(path.join(SRC, file));
    for (const [size, width] of Object.entries(SIZES)) {
      await sharp(input)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(path.join(SRC, 'thumbs', size, `${name}.webp`));
    }
    count++;
  } catch (err) {
    console.error(`  ✗ ${file}: ${err.message}`);
  }
}
console.log(`Thumbnails: ${count} photos → dist/images/thumbs/{sm,md}/`);
