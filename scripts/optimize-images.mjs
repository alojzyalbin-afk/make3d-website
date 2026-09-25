/**
 * Build-time image optimizer for make3d.ie
 *
 * Reads every image in public/images/, generates:
 *   - A resized JPEG/PNG at max 1200px wide (replaces original)
 *   - A WebP version alongside it (same name, .webp extension)
 *
 * Run before `astro build` or as part of the build script.
 * Requires: sharp (npm install sharp)
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const IMG_DIR = 'public/images';
const MAX_WIDTH = 1200;
const WEBP_QUALITY = 80;
const JPEG_QUALITY = 82;

const SUPPORTED = new Set(['.jpg', '.jpeg', '.png', '.webp']);

async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!SUPPORTED.has(ext)) return;

  // Skip already-generated WebP companions
  const baseName = path.basename(filePath, ext);
  const dir = path.dirname(filePath);

  try {
    const buf = await fs.readFile(filePath);
    const img = sharp(buf);
    const meta = await img.metadata();

    // Skip tiny images (icons, thumbnails already optimized)
    if ((meta.width ?? 0) <= MAX_WIDTH && buf.length < 200_000) {
      return;
    }

    const needsResize = (meta.width ?? 0) > MAX_WIDTH;

    // Resize + compress the original format
    let pipeline = sharp(buf);
    if (needsResize) {
      pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
    }

    if (ext === '.png') {
      pipeline = pipeline.png({ quality: JPEG_QUALITY, compressionLevel: 9 });
    } else if (ext === '.jpg' || ext === '.jpeg') {
      pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
    } else if (ext === '.webp') {
      pipeline = pipeline.webp({ quality: WEBP_QUALITY });
    }

    const optimized = await pipeline.toBuffer();

    // Only write if smaller
    if (optimized.length < buf.length) {
      await fs.writeFile(filePath, optimized);
      const saved = ((buf.length - optimized.length) / buf.length * 100).toFixed(0);
      console.log(`  ✓ ${path.basename(filePath)}: ${fmt(buf.length)} → ${fmt(optimized.length)} (-${saved}%)`);
    } else {
      console.log(`  · ${path.basename(filePath)}: already optimal (${fmt(buf.length)})`);
    }

    // Generate WebP companion (skip if source is already webp)
    if (ext !== '.webp') {
      const webpPath = path.join(dir, `${baseName}.webp`);
      let webpPipeline = sharp(buf);
      if (needsResize) {
        webpPipeline = webpPipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
      }
      const webpBuf = await webpPipeline.webp({ quality: WEBP_QUALITY }).toBuffer();
      await fs.writeFile(webpPath, webpBuf);
    }
  } catch (err) {
    console.error(`  ✗ ${path.basename(filePath)}: ${err.message}`);
  }
}

function fmt(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

async function main() {
  console.log('Optimizing images in public/images/ ...\n');

  const files = await fs.readdir(IMG_DIR);
  const images = files
    .filter((f) => SUPPORTED.has(path.extname(f).toLowerCase()))
    .filter((f) => !f.endsWith('.webp') || !files.includes(f.replace('.webp', '.jpg')))
    .map((f) => path.join(IMG_DIR, f));

  let before = 0;
  for (const img of images) {
    const stat = await fs.stat(img);
    before += stat.size;
  }

  for (const img of images) {
    await optimizeImage(img);
  }

  let after = 0;
  const afterFiles = await fs.readdir(IMG_DIR);
  for (const f of afterFiles) {
    if (SUPPORTED.has(path.extname(f).toLowerCase())) {
      const stat = await fs.stat(path.join(IMG_DIR, f));
      after += stat.size;
    }
  }

  console.log(`\nDone. Before: ${fmt(before)} → After: ${fmt(after)} (all formats)`);
}

main();
