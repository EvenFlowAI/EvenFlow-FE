---
applyTo: "src/store/reducers/**/actions.ts,src/store/reducers/**/reducer.ts,src/store/reducers/**/types.ts,src/store/reducers/**/selectors.ts"
---

# EvenFlow Redux Rules

- Follow the feature triad structure: `types.ts`, `actions.ts`, and `reducer.ts` per reducer folder.
- Keep action type strings namespaced by feature (for example `appointment/setSessionId`).
- Async flows belong in thunk actions using `AppThunk`; keep success/error/loading branches explicit.
- Route API I/O through `src/api/api.ts` methods, then dispatch reducer-facing payloads.
- Keep state contracts strongly typed (`I*`/`E*` naming, `TFeatureState` where established).
- Use Redux Toolkit reducer patterns and immutable updates through toolkit/Immer.
- Keep selector usage for derived state, especially for expensive computations.

