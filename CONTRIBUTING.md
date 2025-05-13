# Contributing to EvenFlowAI

This document provides guidelines and information for contributors to the EvenFlowAI project.

## Development Workflow

### Setup

1. Clone the repository
2. Install dependencies:
   ```
   yarn install
   ```
3. Set up Git hooks:
   ```
   npm run setup-hooks
   ```
4. Start the development server:
   ```
   yarn start
   ```

## Versioning System

### Automatic Version Incrementation

The project uses automatic version incrementation with every commit:

1. When you make a commit, a pre-commit hook runs automatically
2. The hook increments the patch version in `package.json`
3. The updated `package.json` is added to your commit

This ensures that:
- Each commit has a unique version number
- The version is always increasing
- The build process always includes the latest version

### How It Works

The versioning system consists of:

1. **Pre-commit Hook**: Runs `npm run increment-version` before each commit
2. **Version Incrementer**: Increments the patch number in package.json
3. **Version.json Generator**: Creates a version.json file during build
4. **Version Checker**: App checks for version changes at runtime

### Runtime Version Checking

The application implements a version checking system that:
- Fetches version.json periodically (with cache-control headers to prevent caching)
- Compares the current version with the cached version
- Automatically reloads the app when a new version is detected
- Uses a check interval to avoid excessive version checks

## Important Scripts

- `npm run increment-version` - Manually increment the version
- `npm run generate-version-json` - Generate version.json file
- `npm run setup-hooks` - Install Git hooks for versioning

## Build Process

When building the application (`yarn build`):
1. The React application is built normally
2. The version.json generator runs automatically
3. The version.json file is created with the current version from package.json

This ensures that deployed builds include the correct version information for runtime checking. 