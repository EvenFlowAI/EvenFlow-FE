# Internationalization Domain

## Implementation Summary

Internationalization is configured through i18next and react-i18next with browser language detection and JSON translation resources.

## Concrete Patterns

- i18n bootstrap happens in `src/i18n.js`.
- Translation resources are loaded from `src/translations/translations.json`.
- `LanguageDetector` is part of initialization, and interpolation escaping is disabled for React safety model.

## Code Examples

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

This file-level setup is the canonical source for localization behavior in the app.

