# Setup Files Style Guide

## Scope

This category covers foundational app setup files that bootstrap global behavior:

- `src/i18n.js`
- `src/serviceWorker.ts`
- `src/setupTests.ts`
- `src/App.css`
- `src/index.css`

## Project-Specific Conventions

- `src/i18n.js` is the single i18n initialization file using i18next + language detector + JSON resources.
- `src/serviceWorker.ts` is CRA-style service worker infrastructure and currently uses `unregister()` from `src/index.tsx`.
- `src/setupTests.ts` is the Jest setup point and remains minimal.
- Global CSS files (`src/App.css`, `src/index.css`) provide baseline document-level styles, while most feature styling is done through MUI/TSS-React.

## Distinctive Patterns

1. **Bootstrap in entrypoints, not feature modules**
   - Setup concerns are defined once in root-level files and consumed by `src/index.tsx`/`src/App.tsx`.

2. **Configuration-first initialization**
   - Libraries like i18n and service worker registration are initialized from dedicated setup files rather than scattered across components.

3. **CSS-in-JS preferred for feature UI**
   - Even with global CSS files present, feature and component styling primarily uses MUI/TSS hooks.

## Example

From `src/i18n.js`:

```js
i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
```

## Guidance for New Setup Files

- Put cross-app initialization in root setup files under `src/`.
- Keep setup files side-effect focused and dependency-light.
- Avoid embedding feature/business logic in setup files.

