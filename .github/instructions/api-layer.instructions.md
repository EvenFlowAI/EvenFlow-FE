---
applyTo: "src/api/**/*.{ts,tsx}"
---

# EvenFlow API Layer Rules

- Keep network access centralized in `src/api/request.ts` and endpoint facades in `src/api/api.ts`.
- Do not introduce direct axios calls from features/pages/components; use shared API modules.
- Preserve interceptor-driven auth/session behavior, including dual admin and self-booking token flows.
- Keep request/response contracts typed in `src/api/types.ts` or feature type files.
- Group endpoints by domain and keep method names predictable (`list`, `getById`, `create`, `update`, `delete`).
- Keep error handling consistent and propagate actionable error data back to thunk flows.

