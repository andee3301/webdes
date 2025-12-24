#!/usr/bin/env node

/*
  Apply downloaded stock images to the app.

  What it does:
  1) Recursively scans `stock img/` (or a provided --source dir) for image files.
  2) Copies them into `public/images/stock/` (or a provided --dest dir), de-duping by file hash.
  3) Updates every MenuItem.imageUrl in the DB to point at the local copied images.

  Usage:
    node scripts/apply-stock-images.js
    node scripts/apply-stock-images.js --source "stock img" --dest "public/images/stock" --clean
    node scripts/apply-stock-images.js --dry-run

  Notes:
  - Requires DB connectivity (same as running the app).
  - If you re-run seed, run this script again to re-apply images.
*/

const path = require('path');
const fs = require('fs/promises');
const crypto = require('crypto');

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {
    source: 'stock img',
    dest: 'public/images/stock',
    clean: true,
    dryRun: false,
  };

  for (let i = 0; i < args.length; i += 1) {
    const token = args[i];
    if (token === '--source') {
      out.source = args[i + 1];
      i += 1;
      continue;
    }
    if (token === '--dest') {
      out.dest = args[i + 1];
      i += 1;
      continue;
    }
    if (token === '--clean') {
      out.clean = true;
      continue;
    }
    if (token === '--no-clean') {
      out.clean = false;
      continue;
    }
    if (token === '--dry-run') {
      out.dryRun = true;
      continue;
    }
    if (token === '--help' || token === '-h') {
      console.log(`\nApply stock images to menu items\n\nOptions:\n  --source <dir>    Source folder to scan (default: stock img)\n  --dest <dir>      Destination folder inside public (default: public/images/stock)\n  --clean           Remove destination folder before copying (default: on)\n  --no-clean        Keep existing files in destination\n  --dry-run         Don\'t write files or update DB\n`);
      process.exit(0);
    }
  }

  return out;
}

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function walkFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await walkFiles(full)));
      continue;
    }
    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (!IMAGE_EXTS.has(ext)) continue;
    results.push(full);
  }

  return results;
}

async function hashFile(filePath) {
  const buf = await fs.readFile(filePath);
  return crypto.createHash('sha1').update(buf).digest('hex');
}

async function ensureCleanDir(dir, clean) {
  if (!clean) {
    await fs.mkdir(dir, { recursive: true });
    return;
  }

  await fs.rm(dir, { recursive: true, force: true });
  await fs.mkdir(dir, { recursive: true });
}

function toPublicUrl(destPublicDir, filename) {
  const normalized = destPublicDir.replace(/\\/g, '/').replace(/^public\//, '');
  return `/${normalized}/${filename}`;
}

async function main() {
  const { source, dest, clean, dryRun } = parseArgs();

  const repoRoot = path.join(__dirname, '..');
  const sourceDir = path.isAbsolute(source) ? source : path.join(repoRoot, source);
  const destDir = path.isAbsolute(dest) ? dest : path.join(repoRoot, dest);

  console.log(`Source: ${sourceDir}`);
  console.log(`Dest:   ${destDir}`);
  console.log(`Clean:  ${clean ? 'yes' : 'no'}`);
  console.log(`DryRun: ${dryRun ? 'yes' : 'no'}`);

  if (!(await fileExists(sourceDir))) {
    throw new Error(`Source directory not found: ${sourceDir}`);
  }

  const files = await walkFiles(sourceDir);
  if (!files.length) {
    throw new Error(`No images found under: ${sourceDir}`);
  }

  console.log(`Found ${files.length} image files.`);

  if (!dryRun) {
    await ensureCleanDir(destDir, clean);
  }

  const seen = new Map(); // hash -> filename
  const publicUrls = [];

  let copyCount = 0;
  for (let i = 0; i < files.length; i += 1) {
    const src = files[i];
    const ext = path.extname(src).toLowerCase();
    const hash = await hashFile(src);

    if (seen.has(hash)) {
      continue;
    }

    const filename = `coffee-${String(seen.size + 1).padStart(4, '0')}-${hash.slice(0, 8)}${ext}`;
    seen.set(hash, filename);

    const outPath = path.join(destDir, filename);
    const publicUrl = toPublicUrl(dest, filename);
    publicUrls.push(publicUrl);

    if (!dryRun) {
      await fs.copyFile(src, outPath);
    }

    copyCount += 1;
  }

  console.log(`Copied ${copyCount} unique images.`);
  console.log(`Public URL example: ${publicUrls[0]}`);

  // Update DB image URLs
  if (dryRun) {
    console.log('Dry-run: skipping DB update.');
    return;
  }

  const { sequelize, MenuItem } = require('../models');

  const items = await MenuItem.findAll({ order: [['id', 'ASC']] });
  if (!items.length) {
    console.log('No MenuItem records found; nothing to update.');
    await sequelize.close();
    return;
  }

  const tx = await sequelize.transaction();
  try {
    for (let i = 0; i < items.length; i += 1) {
      const url = publicUrls[i % publicUrls.length];
      items[i].imageUrl = url;
      await items[i].save({ transaction: tx });
    }

    await tx.commit();
    console.log(`Updated ${items.length} menu item imageUrl values.`);
  } catch (err) {
    await tx.rollback();
    throw err;
  } finally {
    await sequelize.close();
  }
}

main().catch((err) => {
  console.error('❌ Failed to apply stock images:', err?.message || err);
  process.exitCode = 1;
});
