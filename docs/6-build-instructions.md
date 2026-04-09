# Step 6 Output - Build Instructions and Final Synthesis

## Inputs Used

- `docs/1-determine-techstack.md`
- `docs/2-file-categorization.json`
- `docs/3-architectural-domains.json`
- `docs/4-domains/*.md`
- `docs/5-style-guides/*.md`
- `package.json`
- `README.md`
- `buildspec.yml`
- `appspec.yml`

## Verified Build/Run Commands (from repo files)

From `package.json` scripts:

- `npm start`
- `npm run startDev`
- `npm run startUat`
- `npm run startPreProd`
- `npm run startProduction`
- `npm run build`
- `npm test`
- `npm run lint`
- `npm run lint:fix`
- `npm run prettier:fix`
- `npm run all-fix`

## Environment/CI Notes

- `buildspec.yml` uses Node.js `20.19.0` in install phase.
- CI pre-build appends `REACT_APP_ENV` to `.env` and runs `yarn install`.
- CI build uses `yarn run build`.
- Build artifacts include `build/**/*`, `deploy-scripts/*`, and `appspec.yml`.

## Deployment Notes

From `appspec.yml`:

- Build output copies from `build` to `/home/ubuntu/evenflow/client`.
- `deploy-scripts/before_install.sh` runs as root during `BeforeInstall`.

## Final Output Generated

- Final synthesized instructions file is written to `.github/copilot-instructions.md`.
- This file incorporates:
  - tech stack + domain boundaries
  - file category conventions
  - architectural domains and constraints
  - category-specific style guidance
  - feature scaffold and prompt usage examples

