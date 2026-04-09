---
applyTo: "src/i18n.js,src/translations/**/*.json,src/setupTests.ts,src/serviceWorker.ts,src/App.css,src/index.css"
---

# EvenFlow Setup and I18n Rules

- Keep setup files bootstrap-focused; do not introduce business logic in setup entry points.
- Treat `src/i18n.js` as the central i18n initialization source of truth.
- Add or update user-facing copy via translation keys in `src/translations/translations.json`.
- Avoid introducing hardcoded UI strings when translation keys are expected.
- Preserve existing service worker registration strategy from `src/index.tsx` unless explicitly changing app behavior.

