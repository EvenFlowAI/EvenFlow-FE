# Feature Modules Style Guide

## Overview

The EvenFlow-FE project organizes complex features in `src/features/` directory. Features contain feature-specific components, forms, modals, and services that are not globally reusable. This guide documents the unique conventions for feature modules.

## Feature Directory Structure

Features follow a consistent organizational pattern:

```
src/features/
├── admin/                    # Admin-specific features
│   ├── SideBar/
│   │   ├── SideBar.tsx
│   │   ├── Link/
│   │   │   └── Link.tsx
│   │   └── types.ts
│   ├── NavBar/
│   ├── ServiceCenters/
│   │   ├── ServiceCentersTable/
│   │   ├── CreateServiceCenterModal/
│   │   ├── CreateServiceCenterForm/
│   │   ├── ServiceCenterActions/
│   │   └── types.ts
│   └── ... (20+ sub-features)
│
└── booking/                  # Booking flow features
    ├── PaymentBill/
    ├── ServiceBookModal/
    └── ... (sub-features)
```

## Feature Component Organization

### Single Feature Structure

```
src/features/admin/ServiceCenters/
├── ServiceCentersTable/
│   ├── ServiceCentersTable.tsx      # Main component
│   ├── useTableData.ts              # Custom hook for data
│   ├── types.ts                     # Feature-specific types
│   └── index.ts                     # Barrel export
├── CreateServiceCenterModal/
│   ├── CreateServiceCenterModal.tsx
│   └── types.ts
├── CreateServiceCenterForm/
├── ServiceCenterActions/
├── index.ts                          # Feature export
└── types.ts                          # Shared feature types
```

## Feature Types Pattern

### Feature-Specific Types

```typescript
// src/features/admin/ServiceCenters/types.ts
import { IServiceCenter } from '../../../store/reducers/serviceCenters/types';

export interface IServiceCenterTableColumn {
  id: keyof IServiceCenter;
  header: string;
  width?: number;
  sortable?: boolean;
  render?: (value: any, row: IServiceCenter) => React.ReactNode;
}

export interface IServiceCenterTableProps {
  data: IServiceCenter[];
  loading?: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onRowClick?: (row: IServiceCenter) => void;
}

export interface ICreateServiceCenterFormData {
  name: string;
  email: string;
  phone: string;
  address: IAddress;
  timezone: string;
  isActive: boolean;
}

export interface IServiceCenterFilter {
  searchText?: string;
  isActive?: boolean;
  dealershipId?: number;
}
```

## Feature Component Patterns

### Container Component

The main feature component orchestrates the feature:

```typescript
// src/features/admin/ServiceCenters/ServiceCenters.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { ServiceCentersTable } from './ServiceCentersTable/ServiceCentersTable';
import { CreateServiceCenterModal } from './CreateServiceCenterModal/CreateServiceCenterModal';
import { IServiceCenterFilter } from './types';

export const ServiceCenters: React.FC = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector(state => state.serviceCenters);
  const [filters, setFilters] = useState<IServiceCenterFilter>({});
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchServiceCenters(filters));
  }, [filters, dispatch]);

  const handleEdit = (id: number) => {
    setSelectedId(id);
  };

  const handleDelete = (id: number) => {
    dispatch(deleteServiceCenter(id));
  };

  const handleCreate = () => {
    setSelectedId(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <CreateServiceCenterModal
        centerId={selectedId}
        onClose={() => setSelectedId(null)}
      />
      <ServiceCentersTable
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Box>
  );
};
```

### Sub-Component Pattern

Feature sub-components handle specific concerns:

```typescript
// src/features/admin/ServiceCenters/ServiceCentersTable/ServiceCentersTable.tsx
import React, { useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Box } from '@mui/material';
import { IServiceCenterTableProps, IServiceCenterTableColumn } from '../types';

export const ServiceCentersTable: React.FC<IServiceCenterTableProps> = ({
  data,
  loading,
  onEdit,
  onDelete,
  onRowClick,
}) => {
  const { classes } = useTableStyles();

  const columns: IServiceCenterTableColumn[] = useMemo(
    () => [
      {
        id: 'name',
        header: 'Name',
        width: 250,
        sortable: true,
      },
      {
        id: 'email',
        header: 'Email',
        sortable: false,
      },
      {
        id: 'phone',
        header: 'Phone',
        width: 150,
      },
    ],
    []
  );

  if (loading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          {columns.map(col => (
            <TableCell key={col.id} width={col.width}>
              {col.header}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map(row => (
          <TableRow
            key={row.id}
            onClick={() => onRowClick?.(row)}
            className={classes.row}
          >
            {columns.map(col => (
              <TableCell key={`${row.id}-${col.id}`}>
                {col.render ? col.render(row[col.id], row) : row[col.id]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
```

### Form Component Pattern

Forms are contained within feature modules:

```typescript
// src/features/admin/ServiceCenters/CreateServiceCenterForm/CreateServiceCenterForm.tsx
import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { TextInput, PhoneInput, SelectInput } from '../../../components/formControls';
import { useValidation } from '../../../hooks/useValidation/useValidation';
import { ICreateServiceCenterFormData } from '../types';

interface CreateServiceCenterFormProps {
  initialData?: ICreateServiceCenterFormData;
  onSubmit: (data: ICreateServiceCenterFormData) => Promise<void>;
  isLoading?: boolean;
}

export const CreateServiceCenterForm: React.FC<CreateServiceCenterFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState<ICreateServiceCenterFormData>(
    initialData || getDefaultFormData()
  );

  const { errors, validate } = useValidation({
    name: [{ validate: (v) => Boolean(v), message: 'Name is required' }],
    email: [
      { validate: (v) => Boolean(v), message: 'Email is required' },
      { validate: (v) => /\S+@\S+\.\S+/.test(v), message: 'Invalid email' },
    ],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(formData)) return;
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextInput
          label="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={Boolean(errors.name)}
          helperText={errors.name}
        />

        <TextInput
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={Boolean(errors.email)}
          helperText={errors.email}
        />

        <PhoneInput
          label="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />

        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" disabled={isLoading}>
            Save
          </Button>
        </Box>
      </Box>
    </form>
  );
};

const getDefaultFormData = (): ICreateServiceCenterFormData => ({
  name: '',
  email: '',
  phone: '',
  address: { street: '', city: '', state: '', zip: '' },
  timezone: 'America/Chicago',
  isActive: true,
});
```

### Modal Component Pattern

```typescript
// src/features/admin/ServiceCenters/CreateServiceCenterModal/CreateServiceCenterModal.tsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { CreateServiceCenterForm } from '../CreateServiceCenterForm/CreateServiceCenterForm';
import { updateServiceCenter, createServiceCenter } from '../../../store/actions';

interface CreateServiceCenterModalProps {
  centerId?: number | null;
  onClose: () => void;
}

export const CreateServiceCenterModal: React.FC<CreateServiceCenterModalProps> = ({
  centerId,
  onClose,
}) => {
  const dispatch = useDispatch();
  const isOpen = Boolean(centerId || centerId === null);
  const { loading } = useSelector(state => state.serviceCenters);
  const center = useSelector(state =>
    centerId ? state.serviceCenters.data.find(c => c.id === centerId) : null
  );

  const handleSubmit = async (data: ICreateServiceCenterFormData) => {
    try {
      if (centerId) {
        await dispatch(updateServiceCenter(centerId, data));
      } else {
        await dispatch(createServiceCenter(data));
      }
      onClose();
    } catch (error) {
      // Error handled by Redux
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {centerId ? 'Edit Service Center' : 'Create Service Center'}
      </DialogTitle>
      <DialogContent>
        <CreateServiceCenterForm
          initialData={center}
          onSubmit={handleSubmit}
          isLoading={loading}
        />
      </DialogContent>
    </Dialog>
  );
};
```

## Feature Hooks

Feature-specific hooks are colocated with their features:

```typescript
// src/features/admin/ServiceCenters/ServiceCentersTable/useTableData.ts
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServiceCenters } from '../../../store/reducers/serviceCenters/actions';
import { IServiceCenterFilter } from '../types';

export const useTableData = (filters: IServiceCenterFilter) => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(state => state.serviceCenters);

  useEffect(() => {
    dispatch(fetchServiceCenters(filters));
  }, [filters, dispatch]);

  return { data, loading, error };
};
```

## Feature Export Convention

```typescript
// src/features/admin/ServiceCenters/index.ts
export { ServiceCenters } from './ServiceCenters';
export { ServiceCentersTable } from './ServiceCentersTable/ServiceCentersTable';
export { CreateServiceCenterForm } from './CreateServiceCenterForm/CreateServiceCenterForm';
export { CreateServiceCenterModal } from './CreateServiceCenterModal/CreateServiceCenterModal';
export type {
  IServiceCenterTableProps,
  ICreateServiceCenterFormData,
  IServiceCenterFilter,
} from './types';
```

## Feature Best Practices

1. **Self-Contained** - Features contain all necessary components and logic
2. **Type Safe** - Feature-specific types in feature types.ts
3. **Index Exports** - Always use index.ts for clean imports
4. **No Global Imports** - Features don't export from src/components
5. **Reusable Sub-Components** - Extract reusable parts within feature
6. **Custom Hooks** - Feature-specific hooks colocated with components
7. **No Cross-Feature** - Don't import from other features
8. **Redux Connected** - Features connect to Redux for state
9. **Prop Drilling** - Minimize prop drilling with hooks
10. **Single Responsibility** - Each feature handles one business domain

## Key Conventions

- Feature directories are feature-named (ServiceCenters, Pricing, etc.)
- Sub-feature directories organized by concern (Table, Modal, Form)
- All types in feature types.ts with I prefix
- Components use React.FC<Props> pattern
- Custom hooks for data fetching and state
- Redux integration for complex state
- Styling with useStyles hooks
- Modal/Dialog patterns use Redux state for open/close
- Form validation with custom hooks
- Action buttons/modals in separate sub-components

## Example: Complete Feature

```typescript
// src/features/admin/Pricing/
// ├── PricingSettings.tsx        (main component)
// ├── PricingTable/
// ├── EditPricingModal/
// ├── PricingRulesForm/
// ├── types.ts
// └── index.ts

export const Pricing: React.FC = () => {
  const [selectedRuleId, setSelectedRuleId] = useState<number | null>(null);

  return (
    <Box>
      <PricingTable onEdit={setSelectedRuleId} />
      <EditPricingModal
        ruleId={selectedRuleId}
        onClose={() => setSelectedRuleId(null)}
      />
    </Box>
  );
};
```
