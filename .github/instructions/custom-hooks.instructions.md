---
applyTo: "src/hooks/**/*.{ts,tsx}"
---

# EvenFlow Custom Hook Rules

- Keep hook names and exports in `useXxx` format and colocate each hook in its own folder.
- Hooks encapsulate logic and side effects only; do not render UI from hook modules.
- Prefer typed return values and stable APIs (`{ data, loading, error }`, helper callbacks, derived values).
- When hooking into global state, use typed selectors/dispatch and existing `RootState` patterns.
- Always clean up subscriptions, timers, observers, and listeners in `useEffect` cleanup.
- For notifications/errors, route through `useMessage` and `useException` patterns.
- Reuse existing hooks (`useValidation`, `useDebounce`, `usePaginations`, `useQueryParams`) before adding new abstractions.

