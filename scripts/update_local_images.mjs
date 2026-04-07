
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SOURCE_DIR = 'toupdateimages';
const TARGET_DIR = path.join(ROOT, 'public/images/menu');

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // splits accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, '') // removes all diacritical marks
    .replace(/\s+/g, '-') // replaces spaces with hyphens
    .replace(/[^\w-]+/g, '') // removes all non-word chars
    .replace(/--+/g, '-') // replaces multiple hyphens with a single hyphen
    .trim();
}

async function run() {
  const dirPath = path.join(ROOT, SOURCE_DIR);
  try {
    const files = await fs.readdir(dirPath);
    console.log(`Processing directory: ${SOURCE_DIR}`);
    
    for (const file of files) {
      if (!file.match(/\.(jpg|jpeg|png)$/i)) continue;
      
      const fileNameNoExt = path.parse(file).name;
      const newFileName = `${slugify(fileNameNoExt)}${path.extname(file).toLowerCase()}`;
      const sourcePath = path.join(dirPath, file);
      const targetPath = path.join(TARGET_DIR, newFileName);
      
      await fs.copyFile(sourcePath, targetPath);
      console.log(`Copied: ${file} -> /images/menu/${newFileName}`);
    }
  } catch (err) {
    if (err.code !== 'ENOENT') console.error(`Error processing ${SOURCE_DIR}:`, err.message);
  }
}

run();
