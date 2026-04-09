# EvenFlow-FE Copilot Instructions

**Last Updated:** 2026-04-03  
**AI Assistant Target:** GitHub Copilot and other AI coding assistants  
**Purpose:** Help assistants generate features that match EvenFlow-FE architecture and conventions.

## Overview

This instruction file is synthesized from:

- `docs/1-determine-techstack.md`
- `docs/2-file-categorization.json`
- `docs/3-architectural-domains.json`
- `docs/4-domains/*.md`
- `docs/5-style-guides/*.md`
- `docs/6-build-instructions.md`

Use this as a project-specific coding map. Prioritize observed repository patterns over generic best practices.

## Technology Snapshot

- Frontend: React 18 + TypeScript + React Router v5
- State: Redux Toolkit + Redux Thunk + Redux Persist
- UI: MUI + tss-react + Emotion
- API: Axios client in `src/api/request.ts` and endpoint facade in `src/api/api.ts`
- i18n: i18next + react-i18next (`src/i18n.js`)
- Monitoring: Sentry, GA/GA4, GTM, AWS RUM
- Date handling: dayjs + MUI date pickers

## File Category Reference

### 1) `react-components`

- Purpose: UI rendering and interaction layers across `src/components/`, `src/features/`, and `src/pages/`.
- Examples: `src/components/formControls/TextInput/TextInput.tsx`, `src/features/booking/BookingFlowPage/BookingFlowPage.tsx`
- Conventions: typed props, function components, MUI-first composition, shared wrappers before bespoke UI.

### 2) `custom-hooks`

- Purpose: reusable stateful logic and side-effect orchestration.
- Examples: `src/hooks/useMessage/useMessage.tsx`, `src/hooks/useValidation/useValidation.tsx`
- Conventions: `use*` naming, return helpers/data, encapsulate behavior used by multiple features.

### 3) `styling-hooks`

- Purpose: reusable visual rules with `makeStyles`.
- Examples: `src/hooks/styling/useActionButtonsStyles.ts`, `src/hooks/styling/useCardStyles.ts`
- Conventions: theme-aware style objects, centralized class composition for repeated UI patterns.

### 4) `redux-reducers`

- Purpose: feature-level state transitions.
- Examples: `src/store/reducers/appointment/reducer.ts`, `src/store/reducers/serviceCenters/reducer.ts`
- Conventions: reducer per feature folder, typed state, immutable updates through toolkit reducers.

### 5) `redux-actions`

- Purpose: sync + async dispatch flows.
- Examples: `src/store/reducers/appointment/actions.ts`, `src/store/reducers/serviceRequests/actions.ts`
- Conventions: thunk-based async operations, success/error branches, reducer-facing payload discipline.

### 6) `redux-types`

- Purpose: typed contracts for each store feature.
- Examples: `src/store/reducers/appointment/types.ts`, `src/store/reducers/pricingSettings/types.ts`
- Conventions: explicit interfaces/enums/constants per reducer domain.

### 7) `type-definitions`

- Purpose: global/shared type contracts.
- Examples: `src/types/types.ts`, `src/types/auth.ts`
- Conventions: cross-feature interfaces and utility types remain centralized here.

### 8) `api-layer`

- Purpose: request infrastructure and typed endpoint methods.
- Examples: `src/api/request.ts`, `src/api/api.ts`
- Conventions: shared axios instance, interceptors for token/session behavior, typed payloads.

### 9) `routing`

- Purpose: route grouping and access control.
- Examples: `src/routes/AppRoutes/AppRoutes.tsx`, `src/routes/PrivateRoute/PrivateRoute.tsx`
- Conventions: route constants from `src/routes/constants.ts`; protected areas use `PrivateRoute`.

### 10) `styling-utilities`

- Purpose: theme and style support modules.
- Examples: `src/theme/theme.ts`, `src/theme/colors.ts`
- Conventions: design tokens and shared style helpers over hardcoded values.

### 11) `utility-functions`

- Purpose: pure helper logic and constants.
- Examples: `src/utils/getDate.ts`, `src/utils/collectServiceRequestIds.ts`
- Conventions: stateless utility behavior; reuse before creating duplicate helpers.

### 12) `feature-modules`

- Purpose: feature-oriented slices under admin/booking domains.
- Examples: `src/features/admin/ServiceCenters/`, `src/features/booking/BookingFlowSteps/`
- Conventions: folder-by-feature organization with colocated component/layout/support files.

### 13) `pages`

- Purpose: route-level screens.
- Examples: `src/pages/admin/AdminPanel/AdminPanel.tsx`, `src/pages/booking/BookingFlow/BookingFlow.tsx`
- Conventions: compose features/components; avoid duplicating low-level logic.

### 14) `setup-files`

- Purpose: app bootstrap and global runtime wiring.
- Examples: `src/i18n.js`, `src/setupTests.ts`
- Conventions: initialization-only responsibilities; keep business logic out of setup files.

## Architectural Domains and Integration Rules

Follow constraints from `docs/3-architectural-domains.json` and domain notes under `docs/4-domains/`.

1. `ui`
   - Use typed React functional components with MUI/tss-react patterns.
2. `custom-hooks`
   - Extract reusable stateful logic into `src/hooks/useXxx`.
3. `state-management`
   - Keep global state in Redux feature triads (`actions.ts`, `reducer.ts`, `types.ts`).
4. `routing`
   - Use route constants and `PrivateRoute` for permissioned routes.
5. `data-layer`
   - Route API traffic through `src/api/request.ts` + `src/api/api.ts`.
6. `authentication-and-authorization`
   - Preserve permissions map + dual token flow behavior.
7. `forms-and-validation`
   - Reuse shared form controls + `useValidation`/error feedback patterns.
8. `modals-and-dialogs`
   - Build from `BaseModal`/`ConfirmModal` and existing modal hook flow.
9. `notifications-and-messages`
   - Use notistack through `useMessage`/`useException`.
10. `date-and-time-handling`
   - Continue dayjs + picker wrapper approach.
11. `drag-and-drop`
   - Reuse react-dnd/@hello-pangea patterns already present.
12. `internationalization`
   - Add user-facing strings through i18n keys, not inline literals.
13. `analytics-and-monitoring`
   - Keep instrumentation aligned with hook/app startup integrations.
14. `error-handling-and-boundaries`
   - Maintain ErrorBoundary + fallback + snackbar error reporting pipeline.
15. `performance-and-virtualization`
   - Apply debounce/pagination/virtualization patterns for large, interactive lists.

## Feature Scaffold Guide

When adding a feature, use this sequence:

1. Define/extend types (`redux-types`, `type-definitions` if needed).
2. Add API methods (`api-layer`) and integrate with thunk actions (`redux-actions`).
3. Update reducer state transitions (`redux-reducers`) and selectors.
4. Build UI in `feature-modules` + `react-components` with shared form/modal/table primitives.
5. Wire route/page entries (`routing`, `pages`) and permission mapping if protected.
6. Add/extend hooks for reusable logic and message/exception handling.
7. Ensure i18n keys exist for new user-facing strings.

### Typical file scaffolds

- New component
  - `src/components/<Feature>/<Feature>.tsx`
  - `src/components/<Feature>/styles.ts` or `use<Feature>Styles.ts`
  - `src/components/<Feature>/types.ts` (if needed)
  - `src/components/<Feature>/index.ts`
- New Redux feature slice
  - `src/store/reducers/<feature>/types.ts`
  - `src/store/reducers/<feature>/actions.ts`
  - `src/store/reducers/<feature>/reducer.ts`
- New API integration
  - add endpoint section/methods in `src/api/api.ts`
  - request/response contracts in `src/api/types.ts` (or feature type files)

## Example Prompt Usage

User prompt:

> Create a searchable dropdown for service categories in admin screens, with async options and validation.

Expected project-aligned output shape:

- `src/components/formControls/ServiceCategoryAutocomplete/ServiceCategoryAutocomplete.tsx`
- `src/components/formControls/ServiceCategoryAutocomplete/styles.ts`
- `src/hooks/useServiceCategoryOptions/useServiceCategoryOptions.ts`
- `src/store/reducers/<feature>/actions.ts` (if options come from API)
- `src/api/api.ts` (if new endpoint required)
- i18n key additions in `src/translations/translations.json`

## Build and Run Reference

From repository scripts/config:

- local: `npm start`
- env variants: `npm run startDev`, `npm run startUat`, `npm run startPreProd`, `npm run startProduction`
- build: `npm run build`
- test: `npm test`
- quality: `npm run lint`, `npm run lint:fix`, `npm run prettier:fix`, `npm run all-fix`

CI/CD notes:

- `buildspec.yml` uses Node.js `20.19.0`, installs via yarn, and builds with `yarn run build`.
- `appspec.yml` deploys `build` output to `/home/ubuntu/evenflow/client`.

## Reference Docs

- `docs/1-determine-techstack.md`
- `docs/2-file-categorization.json`
- `docs/3-architectural-domains.json`
- `docs/4-domain-deep-dive.md`
- `docs/4-domains/*.md`
- `docs/5-styleguide-generation.md`
- `docs/5-style-guides/*.md`
- `docs/6-build-instructions.md`
