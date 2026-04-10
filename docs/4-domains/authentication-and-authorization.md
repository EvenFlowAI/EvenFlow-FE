# Authentication and Authorization Domain

## Implementation Summary

Authentication and authorization are implemented through a combination of:

- token lifecycle utilities in `src/api/AuthService/`
- route guards in `src/routes/PrivateRoute/PrivateRoute.tsx`
- route-to-role mapping in `src/permissions.ts`

The codebase supports two auth contexts: admin (local storage token path) and self-booking (session storage/session id path).

## Concrete Patterns

- **Permission map is centralized** in `src/permissions.ts` via `PERMISSIONS`.
- **Protected routes use `PrivateRoute`**, which checks both `authService.isAuthenticated()` and `hasPermission(...)`.
- **401 handling and refresh logic** runs in the shared axios response interceptor in `src/api/request.ts`.

## Code Examples

From `src/routes/PrivateRoute/PrivateRoute.tsx`:

```tsx
if (authService.isAuthenticated()) {
  if (!hasPermission(currentUser, rest.path as string)) {
    return <Redirect to={'/'} />;
  }
  return <Component {...props} />;
}
```

From `src/permissions.ts`:

```ts
export const PERMISSIONS: TRouteRoleMap[] = [
  { route: Routes.Login.Base, roles: true },
  { route: Routes.CenterProfile.Base, roles: baseRoles },
  { route: Routes.Admin.DealershipGroups, roles: [Roles.EvenFlowAdmin] },
];
```

From `src/api/request.ts`:

```ts
if (error?.response?.status === 401 && authService.getRefreshToken()) {
  await authService.refresh();
  rq.headers['Authorization'] = `Bearer ${authService.getLocalToken()}`;
  return request(rq);
}
```

