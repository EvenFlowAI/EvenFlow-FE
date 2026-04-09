---
applyTo: "src/routes/**/*.{ts,tsx},src/permissions.ts"
---

# EvenFlow Routing and Auth Rules

- Use React Router v5 conventions (`Route`, `Switch`, `Redirect`, `useHistory`, `useParams`).
- Keep route paths centralized in `src/routes/constants.ts`; avoid hardcoded paths.
- Protected screens should use `PrivateRoute` and existing permission checks.
- Align access rules with `src/permissions.ts` and existing role mapping behavior.
- Preserve redirect behavior for unauthorized or unauthenticated users.
- Use `useQueryParams` and existing route-typing patterns for query/param handling.

