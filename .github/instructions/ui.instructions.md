---
applyTo: "src/App.tsx,src/index.tsx,src/components/**/*.{ts,tsx},src/features/**/*.{ts,tsx},src/pages/**/*.{ts,tsx}"
---

# EvenFlow UI and Feature Rules

- Build UI with typed function components (`React.FC<Props>`), no class components.
- Prefer MUI primitives and existing wrappers in `src/components/` before creating bespoke controls.
- Keep feature-level orchestration in `src/features/` and route-level composition in `src/pages/`.
- Extract non-trivial stateful logic to hooks in `src/hooks/useXxx` instead of growing component bodies.
- Reuse existing modal patterns (`BaseModal`, `ConfirmModal`, `useModal`) for dialog flows.
- Keep user-visible text translatable; use i18n keys from `src/translations/translations.json`.
- For date/time UX, keep dayjs + picker wrapper patterns from `src/components/pickers/`.
- For large lists and interactive tables, prefer existing pagination/debounce/virtualization patterns.

