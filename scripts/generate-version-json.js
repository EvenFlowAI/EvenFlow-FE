const fs = require('fs');
const path = require('path');

// Read package.json to get current version
const packagePath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const version = packageJson.version;

// Create build directory if it doesn't exist
const buildDir = path.join(__dirname, '..', 'build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Write version.json
const versionPath = path.join(buildDir, 'version.json');
fs.writeFileSync(versionPath, JSON.stringify({ version }));

console.log(`Generated version.json with version: ${version}`);
