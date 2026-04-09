# Notifications and Messages Domain

## Implementation Summary

The application uses notistack snackbars as the standard notification channel for success and error feedback.

## Concrete Patterns

- `SnackbarProvider` is mounted centrally in `src/App.tsx`.
- `useMessage` and `useException` hooks wrap `enqueueSnackbar` and are reused throughout features.
- Notifications commonly represent validation failures, API failures, and success confirmations.

## Code Examples

From `src/App.tsx`:

```tsx
<SnackbarProvider
  maxSnack={3}
  ref={notificationsRef}
  action={shackAction}
  anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
  variant="success"
>
```

From `src/hooks/useMessage/useMessage.tsx`:

```tsx
export function useMessage() {
  const { enqueueSnackbar } = useSnackbar();
  return (message: ReactNode, variant?: TVariant) => {
    enqueueSnackbar(message, { variant: variant || 'success' });
  };
}
```

From `src/hooks/useException/useException.ts`:

```ts
enqueueSnackbar(getAPIException(e), {
  variant: 'error',
  preventDuplicate: Boolean(preventDuplicate),
});
```

