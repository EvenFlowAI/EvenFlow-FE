# Modals and Dialogs Domain

## Implementation Summary

Modal UIs are standardized around shared modal primitives and hook-driven visibility control.

## Concrete Patterns

- `BaseModal`, `DialogTitle`, `DialogContent`, and `DialogActions` are shared in `src/components/modals/BaseModal/BaseModal.tsx`.
- Feature modals compose these primitives and usually pair with `useModal` for local open/close mechanics.
- Confirmation and destructive actions reuse confirm-style modal flows.

## Code Examples

From `src/components/modals/BaseModal/BaseModal.tsx`:

```tsx
export const BaseModal: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<DialogProps>>
> = props => {
  return (
    <StyledDialog
      maxWidth={props.maxWidth ?? 'md'}
      fullWidth
      {...props}
      sx={{ '& .MuiDialog-paper': { height: props.height } }}
      mW={props.width}
    />
  );
};
```

From `src/features/admin/Transportations/EditTransportationModal/EditTransportationModal.tsx`:

```tsx
const { onOpen, isOpen, onClose } = useModal();

return (
  <BaseModal {...props} width={600} onClose={onCancel}>
    <DialogTitle onClose={onCancel}>Manage Rules</DialogTitle>
    <DialogContent>{/* ... */}</DialogContent>
  </BaseModal>
);
```

