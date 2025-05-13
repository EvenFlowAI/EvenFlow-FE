const fs = require('fs');
const path = require('path');

const hookDir = path.join(__dirname, '..', '.git', 'hooks');
const preCommitPath = path.join(hookDir, 'pre-commit');

const hookContent = `#!/bin/sh

echo "Running pre-commit hook..."

# Run version increment
npm run increment-version

# Add the modified package.json to the commit
git add package.json

# Exit successfully
exit 0
`;

// Write the hook file
fs.writeFileSync(preCommitPath, hookContent);

// Make it executable (chmod +x)
try {
  fs.chmodSync(preCommitPath, '755');
  console.log('✅ Pre-commit hook installed successfully!');
} catch (error) {
  console.error('❌ Failed to set executable permissions. You may need to run:');
  console.error(`chmod +x ${preCommitPath}`);
}
