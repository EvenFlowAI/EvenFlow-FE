## EvenFlowAI Project
### Requirements
- Node.js
- NPM
- YARN

### Deployment
Build project from source
```
yarn build
```
and push into environment through FTP or SFTP

### Local development environment
Clone project from git

```
cd <project_dirrectory>
yarn install
yarn start
```

### Version System

The project includes an automatic version management system with the following features:

#### Automatic Version Incrementation

- Each commit automatically increments the patch version in `package.json`
- This is handled by a Git pre-commit hook

#### Setup Git Hooks

To set up the Git hooks on a new development environment:

```
npm run setup-hooks
```

This installs the pre-commit hook that increments the version number before each commit.

#### Version Checking

The application includes a system that:

- Generates a `version.json` file during the build process containing the current version number
- Checks for version updates at runtime
- Automatically reloads the application when a new version is detected

#### Version-related npm Scripts

- `npm run increment-version` - Manually increment the patch version
- `npm run generate-version-json` - Generate the version.json file
- `npm run setup-hooks` - Set up the Git hooks for automatic versioning

#### Build Process

The build script:
1. Builds the React application
2. Generates the version.json file with the current version from package.json