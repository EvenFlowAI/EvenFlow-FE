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
yarn install or npm install --legacy-peer-deps
yarn start or npm start
```

### Husky Pre-Commit hook
After installing dependencies, make sure to run: `npm run prepare`.
  This command sets up Husky and installs the Git pre-commit hook, which will automatically run linters and formatters before each commit. Make sure this step is not skipped, otherwise the hooks will not work.

### Version System

The project includes an automatic version management system with the following features:

#### Automatic Version Incrementation

- Each commit automatically increments the patch version in `package.json`
- This is handled by a husky pre-commit hook

#### Version Checking

The application includes a system that:

- Generates a `version.json` file during the build process containing the current version number
- Checks for version updates at runtime
- Automatically reloads the application when a new version is detected

#### Version-related npm Scripts

- `npm run increment-version` - Manually increment the patch version
- `npm run generate-version-json` - Generate the version.json file

#### Build Process

The build script:
1. Builds the React application
2. Generates the version.json file with the current version from package.json