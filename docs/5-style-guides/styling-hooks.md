# Styling Hooks Style Guide

## Overview

The EvenFlow-FE project uses **TSS-React 4.9.3** as the primary styling solution. All styling hooks follow a consistent pattern using the `makeStyles()` hook from TSS-React with Material-UI integration. This guide documents the unique conventions for styling hooks in this project.

## Directory Structure

Styling hooks are organized in a dedicated `styling/` directory:

```
src/hooks/styling/
├── useActionButtonsStyles.ts
├── useAutocompleteStyles.ts
├── useCalendarStyles.ts
├── useCardStyles.ts
├── useCenterSettingsStyles.ts
├── useCustomerSelectStyles.ts
├── useDashboardStyles.ts
├── useDatePickerStyles.ts
├── useDialogStyles.ts
├── useLabelStyles.ts
├── useLoadingStyles.ts
├── useLocationStyles.ts
├── useNotificationStyles.ts
├── useOfferInputStyles.ts
├── usePackageMobileStyles.tsx
├── useSelectedAppointmentStyles.tsx
├── useTmeSelectorStyles.ts
└── useZonePlateStyles.ts
```

## Hook Naming Convention

All styling hooks follow the pattern: `use{Component}Styles`

- `useActionButtonsStyles` - Styles for action button groups
- `useDashboardStyles` - Styles for dashboard layout
- `useDialogStyles` - Styles for dialog components
- `useCardStyles` - Styles for card components

## Basic Pattern

### TSS-React makeStyles Hook

```typescript
// src/hooks/styling/useActionButtonsStyles.ts
import { makeStyles } from 'tss-react/mui';

export const useActionButtonsStyles = makeStyles()(() => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: 14,
  },
  buttonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelButton: {
    color: '#9FA2B4',
    marginRight: 20,
    border: 'none',
    outline: 'none',
  },
  saveButton: {
    background: '#7898FF',
    color: 'white',
    border: '1px solid #7898FF',
    outline: 'none',
    '&:hover': {
      color: '#7898FF',
    },
  },
}));
```

### Usage in Components

```typescript
import { useActionButtonsStyles } from '../../hooks/styling/useActionButtonsStyles';

export const ActionButtons: React.FC<Props> = () => {
  const { classes } = useActionButtonsStyles();

  return (
    <div className={classes.wrapper}>
      <div className={classes.buttonsWrapper}>
        <button className={classes.cancelButton}>Cancel</button>
        <button className={classes.saveButton}>Save</button>
      </div>
    </div>
  );
};
```

## Advanced Patterns

### Theme Integration

Styling hooks can access the MUI theme:

```typescript
import { makeStyles } from 'tss-react/mui';

export const useDashboardStyles = makeStyles()(theme => ({
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: theme.spacing(2),
    padding: theme.spacing(3),
  },
  card: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
  },
  title: {
    fontSize: theme.typography.h5.fontSize,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.primary.main,
  },
}));
```

### Conditional Styles with Props

Styling hooks can accept parameters for conditional styling:

```typescript
interface DialogStylesProps {
  fullWidth?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const useDialogStyles = makeStyles<DialogStylesProps>()(
  (theme, { fullWidth = true, maxWidth = 'sm' }) => ({
    dialog: {
      width: fullWidth ? '100%' : 'auto',
      maxWidth: maxWidth,
    },
    dialogTitle: {
      padding: theme.spacing(2),
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    dialogContent: {
      padding: theme.spacing(3),
    },
    dialogActions: {
      padding: theme.spacing(2),
      borderTop: `1px solid ${theme.palette.divider}`,
      justifyContent: 'flex-end',
    },
  })
);
```

**Usage:**

```typescript
const { classes } = useDialogStyles({ fullWidth: true, maxWidth: 'md' });
```

### Media Queries

Use MUI theme breakpoints for responsive styles:

```typescript
export const useCardStyles = makeStyles()(theme => ({
  card: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
    },
  },
  cardHeader: {
    fontSize: theme.typography.h6.fontSize,
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.typography.body1.fontSize,
    },
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      gap: theme.spacing(1),
    },
  },
}));
```

### Complex Selectors

Use CSS selectors for nested styling:

```typescript
export const useLoadingStyles = makeStyles()(theme => ({
  container: {
    position: 'relative',
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  'container:hover .loader': {
    opacity: 1,
  },
  content: {
    opacity: 0.5,
    pointerEvents: 'none',
  },
}));
```

## Color and Typography

### Using Theme Colors

```typescript
export const useNotificationStyles = makeStyles()(theme => ({
  success: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  },
  error: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
  warning: {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.warning.contrastText,
  },
  info: {
    backgroundColor: theme.palette.info.main,
    color: theme.palette.info.contrastText,
  },
}));
```

### Using Theme Typography

```typescript
export const useLabelStyles = makeStyles()(theme => ({
  label: {
    ...theme.typography.body2,
    fontWeight: theme.typography.fontWeightMedium,
  },
  required: {
    ...theme.typography.body2,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.error.main,
  },
  disabled: {
    ...theme.typography.body2,
    color: theme.palette.text.disabled,
  },
}));
```

## Animation and Transitions

```typescript
export const useSelectedAppointmentStyles = makeStyles()(theme => ({
  container: {
    transition: theme.transitions.create(['background-color', 'box-shadow'], {
      duration: theme.transitions.duration.standard,
    }),
  },
  selected: {
    backgroundColor: theme.palette.action.selected,
    boxShadow: theme.shadows[3],
  },
  highlight: {
    animation: '$highlight 0.3s ease-in-out',
  },
  '@keyframes highlight': {
    '0%': {
      backgroundColor: theme.palette.primary.light,
    },
    '100%': {
      backgroundColor: theme.palette.background.paper,
    },
  },
}));
```

## Layout Utilities

### Flexbox Patterns

```typescript
export const useLocationStyles = makeStyles()(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  spaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));
```

### Grid Patterns

```typescript
export const useTmeSelectorStyles = makeStyles()(theme => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  },
}));
```

## Overflow and Text

```typescript
export const useCalendarStyles = makeStyles()(theme => ({
  header: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  multiline: {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
}));
```

## Custom Hooks with Styling

Some styling hooks are defined as React components (.tsx) when they need additional logic:

```typescript
// src/hooks/styling/usePackageMobileStyles.tsx
import { makeStyles } from 'tss-react/mui';

export const usePackageMobileStyles = makeStyles()(theme => ({
  container: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
  },
  package: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
  },
  [theme.breakpoints.up('md')]: {
    container: {
      padding: theme.spacing(3),
    },
  },
}));
```

## Key Conventions

1. **Always use makeStyles()** - All styling hooks use TSS-React's `makeStyles()`
2. **Theme access** - Access theme via the second parameter: `(theme) => ({ ... })`
3. **Breakpoints** - Use `theme.breakpoints.up/down()` for responsive styles
4. **Spacing** - Use `theme.spacing()` instead of hardcoded values
5. **Colors** - Use `theme.palette.*` for colors instead of hardcoded hex values
6. **Shadows** - Use `theme.shadows[n]` instead of custom box-shadow
7. **Transitions** - Use `theme.transitions.create()` for animations
8. **Typography** - Use `...theme.typography.*` to apply font styles
9. **No inline styles** - Always extract to styling hooks, never use inline `style` prop
10. **Class naming** - Use camelCase for class names: `saveButton`, `dialogContent`, etc.

## Comparison: TSS-React vs Emotion

### TSS-React (Preferred)

```typescript
const useStyles = makeStyles()(() => ({
  button: { color: 'blue' }
}));

const { classes } = useStyles();
<button className={classes.button} />
```

### Emotion (Legacy)

```typescript
const StyledButton = styled.button`
  color: blue;
`;

<StyledButton />
```

New styling hooks should always use TSS-React, not Emotion.

## Complete Example

```typescript
import { makeStyles } from 'tss-react/mui';

export const useOfferInputStyles = makeStyles()(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  inputGroup: {
    display: 'flex',
    gap: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  input: {
    flex: 1,
    padding: theme.spacing(1),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    fontSize: theme.typography.body2.fontSize,
    '&:focus': {
      outline: 'none',
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 3px ${theme.palette.primary.light}`,
    },
  },
  label: {
    ...theme.typography.body2,
    fontWeight: theme.typography.fontWeightMedium,
    marginBottom: theme.spacing(0.5),
  },
  error: {
    color: theme.palette.error.main,
    fontSize: theme.typography.caption.fontSize,
    marginTop: theme.spacing(0.5),
  },
}));
```
