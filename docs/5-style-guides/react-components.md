# React Components Style Guide

## Overview

The EvenFlow-FE project uses React 18.2.0 with TypeScript 4.9.5 in strict mode. Components follow a feature-based file structure with Material-UI as the primary component library. This guide documents the unique conventions and patterns specific to this project.

## Component File Structure

### Single Component Directory Pattern

Each component is organized in its own directory with the following structure:

```
src/components/buttons/EditButton/
├── EditButton.tsx       # Main component file
├── types.ts            # TypeScript interfaces/types (optional)
└── index.ts            # Export file (optional)
```

### Multi-Component Modules

Larger features have organized directory structures:

```
src/features/admin/ServiceCenters/
├── ServiceCentersTable/
├── CreateServiceCenterModal/
├── CreateServiceCenterForm/
├── ServiceCenterActions/
└── types.ts            # Shared types for the feature
```

## Component Patterns

### Functional Component with React.FC

All components use the functional component pattern with `React.FC<Props>` type annotation:

```typescript
import React from 'react';

interface EditButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

export const EditButton: React.FC<EditButtonProps> = ({
  onClick,
  disabled = false,
}) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      Edit
    </button>
  );
};
```

### Props Typing Convention

Props are defined as interfaces with the `{ComponentName}Props` naming convention:

```typescript
interface ServiceCentersTableProps {
  data: IServiceCenter[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}
```

### Generic Components

For reusable generic components, use TypeScript generics with appropriate constraints:

```typescript
interface BaseTableProps<T> {
  data: T[];
  columns: ITableColumn<T>[];
  onRowClick?: (row: T) => void;
}

export const BaseTable = <T extends Record<string, any>>(
  props: BaseTableProps<T>
): React.ReactElement => {
  // Component implementation
};
```

## Styling Patterns

### TSS-React (Primary Pattern)

The project uses **TSS-React** as the preferred styling solution with Material-UI:

```typescript
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
}));
```

**Usage in component:**

```typescript
export const ActionButtons: React.FC<ActionButtonsProps> = (props) => {
  const { classes } = useActionButtonsStyles();

  return (
    <div className={classes.wrapper}>
      <div className={classes.buttonsWrapper}>
        {/* content */}
      </div>
    </div>
  );
};
```

### TSS-React withStyles for MUI Components

Styled MUI components use `withStyles`:

```typescript
import { withStyles } from 'tss-react/mui';
import { Button } from '@mui/material';

export const EditButton = withStyles(Button, {
  root: {
    textTransform: 'none',
  },
});
```

### MUI sx Prop (Secondary Pattern)

For inline styles, the MUI `sx` prop is used for one-off styling:

```typescript
<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
  {/* content */}
</Box>
```

### Emotion Styled Components (Legacy Pattern)

Some components use Emotion's `styled` API, though TSS-React is preferred:

```typescript
import styled from '@emotion/styled';

const StyledContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 14px;
`;
```

## Modal Components

Modals follow a consistent pattern using Redux for state management:

### Modal Pattern

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: IModalData) => void;
}

export const CustomModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      {/* Modal content */}
    </BaseModal>
  );
};
```

### Redux-Connected Modals

Modals controlled by Redux state use the custom hook pattern:

```typescript
const MyFeature: React.FC = () => {
  const { isOpen } = useSelector(state => state.modals.myModal);
  const dispatch = useDispatch();

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={() => dispatch(closeMyModal())}
      onConfirm={(data) => dispatch(submitMyModal(data))}
    />
  );
};
```

## Form Controls

Form controls in `src/components/formControls/` follow a wrapper pattern around MUI components:

### TextInput Pattern

```typescript
interface TextInputProps extends TextInputBaseProps {
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  placeholder,
  required,
  error,
  helperText,
  ...props
}) => {
  return (
    <TextField
      label={label}
      placeholder={placeholder}
      required={required}
      error={error}
      helperText={helperText}
      fullWidth
      {...props}
    />
  );
};
```

## Responsive Design

Components use MUI's `useMediaQuery` hook for responsive behavior:

```typescript
import { useMediaQuery, useTheme } from '@mui/material';

export const ResponsiveLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{
      flexDirection: isMobile ? 'column' : 'row',
      display: 'flex'
    }}>
      {/* content */}
    </Box>
  );
};
```

## Component Composition

### Hook-Based Logic Extraction

Complex component logic is extracted to custom hooks:

```typescript
// Hook
export const useTableData = (serviceCenterId: number) => {
  const [data, setData] = useState<IServiceCenter[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch logic
  }, [serviceCenterId]);

  return { data, loading };
};

// Component
export const ServiceCentersTable: React.FC<Props> = ({ serviceCenterId }) => {
  const { data, loading } = useTableData(serviceCenterId);

  return (
    <Table data={data} loading={loading} />
  );
};
```

## Import Organization

Imports follow a consistent order:

```typescript
// 1. React and external libraries
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

// 2. MUI components and utilities
import { Box, Button, TextField } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

// 3. Local components and hooks
import { CustomModal } from '../common/CustomModal/CustomModal';
import { useTableData } from '../../hooks/useTableData/useTableData';

// 4. Types and interfaces
import { IServiceCenter } from '../../types/types';
import { ServiceCentersTableProps } from './types';

// 5. Redux and state
import { fetchServiceCenters } from '../../store/reducers/serviceCenters/actions';
```

## Key Conventions

1. **No PropTypes** - Use TypeScript interfaces exclusively for type safety
2. **No Inline Handlers** - Define event handlers as named functions or use callbacks
3. **No Component Nesting** - Keep component definitions at module level
4. **Memoization** - Use `React.memo()` only for expensive renders, documented with comments
5. **Type Exports** - Component props types are exported for use in tests and parent components
6. **Barrel Exports** - Each component directory includes an `index.ts` for clean imports
7. **Naming Convention** - Component files use PascalCase (EditButton.tsx), not camelCase
8. **Children Prop** - Use `React.PropsWithChildren<Props>` for components accepting children

## Example: Complete Component

```typescript
import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

interface ServiceCenterFormProps {
  initialData?: IServiceCenter;
  onSubmit: (data: IServiceCenter) => Promise<void>;
  isLoading?: boolean;
}

const useStyles = makeStyles()(() => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 8,
  },
}));

export const ServiceCenterForm: React.FC<ServiceCenterFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const { classes } = useStyles();
  const [formData, setFormData] = useState(initialData || {});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (error) {
      setErrors({ submit: 'Failed to submit form' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      {/* Form fields */}
      <Box className={classes.buttonGroup}>
        <Button type="submit" variant="contained" disabled={isLoading}>
          Save
        </Button>
      </Box>
    </form>
  );
};
```

## Migration Notes

- **From Emotion to TSS-React**: Prefer `makeStyles()` from TSS-React over Emotion `styled()` for new components
- **From inline styles to sx prop**: Use MUI's `sx` prop for responsive styling
- **From MUI v4 to v5**: All new components use MUI v5 API with proper imports from `@mui/material`
