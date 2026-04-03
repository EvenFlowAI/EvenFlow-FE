# Forms and Validation Domain

## Implementation Summary

Forms are built with shared controls in `src/components/formControls/` and validation logic is commonly delegated to hooks.

## Concrete Patterns

- **Reusable field wrappers** (`TextInput`, `SelectInput`, `DateInput`, `PhoneInput`, etc.) are used instead of raw inputs.
- **Validation behavior** is encapsulated in `src/hooks/useValidation/useValidation.tsx`.
- **Notification-based validation feedback** uses notistack via `enqueueSnackbar`.

## Code Examples

From `src/hooks/useValidation/useValidation.tsx`:

```tsx
export function useValidation<U>(fields: ValidationKeyPairs<U>[], data: U) {
  const { enqueueSnackbar } = useSnackbar();

  return () => {
    const errors: ValidationKeyPairs<U>[] = [];
    for (const field of fields) {
      if (!data[field.field]) {
        enqueueSnackbar(field.message, { variant: 'error' });
        errors.push(field);
      }
    }
    return errors;
  };
}
```

The above pattern is used as a reusable validator callback that components can call before submit actions.

