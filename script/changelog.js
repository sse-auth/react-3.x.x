const { execSync } = require("child_process");
const { readdirSync, writeFileSync, existsSync } = require("fs");
const { join } = require("path");

const packagesDir = "packages"; // Adjust this if your packages directory is named differently

// Function to get the latest tag for a specific package
const getLatestTag = (packageName) => {
  try {
    const tags = execSync(`git tag --list '@sse-auth/${packageName}@*'`)
      .toString()
      .trim()
      .split("\n");
    if (tags.length === 0) return null;

    // Sort tags and return the latest one
    return tags.sort().pop() || null;
  } catch (error) {
    console.error(`Failed to fetch tags for ${packageName}:`, error);
    return null;
  }
};

// Function to generate changelog for a specific package
const generateChangelog = (packageName) => {
  const changelogPath = join(
    process.cwd(),
    packagesDir,
    packageName,
    "CHANGELOG.md"
  );

  // Check if the CHANGELOG.md file exists; if not, create it with a header
  if (!existsSync(changelogPath)) {
    writeFileSync(
      changelogPath,
      `# Changelog for ${packageName}\n\nAll notable changes to this project will be documented in this file.\n\n## [Unreleased]\n\n`,
      { flag: "a" }
    );
    console.log(`Initialized CHANGELOG.md for ${packageName}`);
  }

  // Get the latest tag for the package
  const latestTag = getLatestTag(packageName);
  console.log(latestTag)
  const command = latestTag
    ? `npx conventional-changelog -p angular -i ${changelogPath} -s --tag ${latestTag} --scope ${packageName}`
    : `npx conventional-changelog -p angular -i ${changelogPath} -s --scope ${packageName}`;

  try {
    execSync(command, { stdio: "inherit" });
    console.log(
      `Changelog updated for ${packageName} based on tag ${
        latestTag || "latest commits"
      }`
    );
  } catch (error) {
    console.error(`Failed to generate changelog for ${packageName}:`, error);
  }
};

// Main function to iterate over packages and generate changelogs
const main = () => {
  const packages = readdirSync(packagesDir).filter((dir) => {
    return dir !== "node_modules" && dir !== ".git" && dir !== "CHANGELOG.md";
  });

  packages.forEach((packageName) => {
    generateChangelog(packageName);
  });
};

// Run the main function
main();
