import fs from "fs";
import path from "path";
import { promisify } from "util";

const unlink = promisify(fs.unlink);
const rmdir = promisify(fs.rmdir);
const stat = promisify(fs.stat);

const packageJsonPath = path.join(process.cwd(), "package.json");

async function removeItem(itemPath) {
  try {
    const fullPath = path.join(process.cwd(), itemPath);
    const stats = await stat(fullPath);
    if (stats.isDirectory()) {
      await rmdir(fullPath, { recursive: true });
      console.log(`Removed directory: ${fullPath}`);
    } else {
      await unlink(fullPath);
      console.log(`Removed file: ${fullPath}`);
    }
  } catch (error) {
    console.error(`Error removing ${itemPath}:`, error.message);
  }
}

async function removeFilesAndFolders() {
  try {
    const packageJson = JSON.parse(
      await fs.promises.readFile(packageJsonPath, "utf-8")
    );
    const itemsToRemove = packageJson.files || [];

    for (const item of itemsToRemove) {
      await removeItem(item);
    }
  } catch (error) {
    console.error("Error reading package.json:", error.message);
  }
}

removeFilesAndFolders();
