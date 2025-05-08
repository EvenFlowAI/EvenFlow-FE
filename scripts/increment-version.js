const fs = require('fs');
const path = require('path');

// Read package.json
const packagePath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Parse current version
const versionParts = packageJson.version.split('.');
const patchVersion = parseInt(versionParts[2]) + 1;
versionParts[2] = patchVersion.toString();
const newVersion = versionParts.join('.');

// Update version in package.json
packageJson.version = newVersion;
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');

console.log(`Version incremented to: ${newVersion}`);
