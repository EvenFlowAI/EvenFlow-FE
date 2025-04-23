const fs = require('fs');
const path = require('path');

const version = process.env.npm_package_version || '1.0.0';
const buildTime = new Date().toISOString();

const versionData = {
  version,
  buildTime,
};

fs.writeFileSync(
  path.join(__dirname, '../public/version.json'),
  JSON.stringify(versionData, null, 2)
);

console.log(`Updated version.json with version ${version} and build time ${buildTime}`);
