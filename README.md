## EvenFlowAI Project
### Requirements
- Node.js
- NPM
- YARN

### Deployment
Build project from source
```bash
  yarn build
```
and push into environment through FTP or SFTP

### Local development environment
Clone project from git

```
cd <project_dirrectory>
yarn install
yarn global add cross-env or npm install -g cross-env 
yarn start
```

### Husky Pre-Commit Hook Setup

To set up Husky and ensure your code is automatically linted and formatted before every commit, follow these steps after installing dependencies:

1. **Install Husky and lint-staged globally:**
    ```bash
    yarn global add husky lint-staged
    ```

   or

   ```bash
    npm install -g husky lint-staged 
    ```

2. **Initialize Husky in your project:**

    ```bash
    npx husky install
    ```

3. **Create the pre-commit hook script:**

   Inside the `.husky` directory, create a file named `pre-commit` with the following content:

    ```
    npm run all-fix
    npm run increment-version
    git add .
    ```

These steps set up Husky on your local machine and install a Git pre-commit hook that automatically runs linters and formatters before each commit. Note that these hooks run only locally and are not executed in Continuous Integration (CI) environments.

**Important:** Do not skip this setup, or the pre-commit hooks will not function correctly.

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