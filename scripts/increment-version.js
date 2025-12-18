const fs = require('fs');
const path = require('path');

// Read package.json
const packagePath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Parse current version
let [major, minor, patch] = packageJson.version.split('.').map(Number);

// Increment patch
patch += 1;

// Handle rollover at 9
if (patch > 9) {
  patch = 0;
  minor += 1;

  if (minor > 9) {
    minor = 0;
    major += 1;
  }
}

const newVersion = `${major}.${minor}.${patch}`;

// Update version in package.json
packageJson.version = newVersion;
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');

console.log(`Version incremented to: ${newVersion}`);
