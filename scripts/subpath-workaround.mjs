#!/usr/bin/env zx

import fs from "fs";
import { argv } from "zx";

const loadJSON = (path) =>
  JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));
const writeJSON = (path, contents) =>
  fs.writeFileSync(
    new URL(path, import.meta.url),
    JSON.stringify(contents, null, 2)
  );

const pkgJsonPlaceholder = (name) => ({
  main: `../dist/${name}.js`,
  types: `../dist/${name}.ts`
});
const pkgJsonBarrelPlaceholder = (name) => ({
  main: `../dist/${name}/index.js`,
  types: `../dist/${name}/index.ts`
});

async function run() {
  const pkgName = argv._[0];
  console.log(`Loading package.json for ${pkgName}`);
  const pkgFile = loadJSON(`../packages/${pkgName}/package.json`);
  const subpathHelperFile = await import(`../packages/${pkgName}/subpaths.mjs`);

  console.log(
    `Found ${subpathHelperFile.subpathNames.length} subpaths and ${subpathHelperFile.subpathFoldersBarrel.length} subpath barrels`
  );

  const allFilesNames = [
    ...subpathHelperFile.subpathNames,
    ...subpathHelperFile.subpathFoldersBarrel,
    ...subpathHelperFile.ignoredFolders,
    "dist",
  ];

  if (pkgFile.files.length !== allFilesNames.length) {
    throw new Error(
      'The package.json "files" array length does not match the subpaths.mjs'
    );
  }

  const hasAllSubpathsInFiles = pkgFile.files.every((name) =>
    allFilesNames.includes(name)
  );

  if (!hasAllSubpathsInFiles) {
    throw new Error(
      'Not all subpaths from the package.json "files" array are in the subpaths.mjs'
    );
  }

  // Create directories for each subpath name using the pkgJsonPlaceholder
  subpathHelperFile.subpathNames.forEach((name) => {
    const dir = new URL(`../packages/${pkgName}/${name}`, import.meta.url);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    writeJSON(
      `../packages/${pkgName}/${name}/package.json`,
      pkgJsonPlaceholder(name)
    );
  });

  // Create directories for each subpath barrel file using the pkgJsonBarrelPlaceholder
  subpathHelperFile.subpathFoldersBarrel.forEach((name) => {
    const dir = new URL(`../packages/${pkgName}/${name}`, import.meta.url);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    writeJSON(
      `../packages/${pkgName}/${name}/package.json`,
      pkgJsonBarrelPlaceholder(name)
    );
  });

  console.log(
    "Successfully created subpath directories with placeholder files"
  );
}

await run();
