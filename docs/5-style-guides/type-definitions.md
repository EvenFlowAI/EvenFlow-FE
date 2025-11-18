# Type Definitions Style Guide

## Overview

Global type definitions in EvenFlow-FE are centralized in `src/types/` directory. This guide documents the unique conventions for project-wide TypeScript types, interfaces, and utility types.

## Types Directory Structure

```
src/types/
├── auth.ts           # Authentication-related types
├── screens.ts        # Screen/page type definitions
├── states.ts         # Enum definitions for states
├── types.ts          # Main global types and utilities
└── (others...)
```

## Global Types File

### Imports and Dependencies

```typescript
// src/types/types.ts
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store/rootReducer';
import { Action } from 'redux';
import { TRole } from '../store/reducers/users/types';
import React, { Dispatch, ReactElement, SetStateAction } from 'react';
import { AutocompleteChangeDetails, AutocompleteChangeReason } from '@mui/material/useAutocomplete';
import { TextInputProps } from '../components/formControls/types';
import { Dayjs } from 'dayjs';
```

### Redux Thunk Type

The project defines a custom `AppThunk` type for all async Redux actions:

```typescript
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
```

**Usage:**

```typescript
// In reducer actions.ts
export const fetchData = (): AppThunk => async dispatch => {
  // ...
};

// With return type
export const fetchAndReturn = (): AppThunk<Promise<IData>> => async dispatch => {
  const data = await fetchData();
  return data;
};
```

## Routing Types

### Link Navigation Types

```typescript
export type LinkType = {
  to: string;
  name: string;
  roles: TRole[] | boolean; // Role-based access control
  exact?: boolean;
  sub?: boolean;
};

export type LinkTypeWithSub = {
  to: string;
  name: string;
  roles: TRole[] | boolean;
  exact?: boolean;
  subLinks?: LinkType[];
  sub?: boolean;
};
```

## Date/Time Types

### Parsable Date Type

A union type for flexible date handling across the application:

```typescript
export type ParsableDate = string | Date | dayjs.Dayjs;
export type TParsableDate = ParsableDate | null | undefined;
```

**Usage:**

```typescript
// In component props
interface AppointmentProps {
  date: ParsableDate;
  optionalDate?: TParsableDate;
}

// In API calls
const formatDate = (date: ParsableDate): string => {
  return dayjs(date).format('YYYY-MM-DD');
};
```

## Callback Types

### Generic Callbacks

```typescript
export type TCallback<T = void> = () => T;
export type TArgCallback<T, R = void> = (arg: T) => R;
export type TSetState<T> = Dispatch<SetStateAction<T>>;
```

**Usage:**

```typescript
interface ModalProps {
  onClose: TCallback;
  onConfirm: TArgCallback<IData>;
  setState: TSetState<boolean>;
}
```

## API Response Types

### Generic Response Wrapper

```typescript
export type TApiResponse<T> = Promise<{
  data: T;
  status: number;
  message?: string;
  success: boolean;
}>;

export interface PaginatedAPIResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
```

## Component Prop Types

### Common UI Props

```typescript
export interface IBaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  data?: Record<string, any>;
}

export interface ILoadableProps {
  loading: boolean;
  error?: string | null;
  onRetry?: TCallback;
}

export interface IPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: TArgCallback<number>;
  onPageSizeChange: TArgCallback<number>;
}
```

## Autocomplete Types

### Form Control Autocomplete

```typescript
export type TAutocompleteChangeReason = AutocompleteChangeReason;
export type TAutocompleteChangeDetails<T> = AutocompleteChangeDetails<T>;

export interface IAutocompleteOption {
  id: string | number;
  label: string;
  value?: any;
  disabled?: boolean;
}
```

## Table and Grid Types

### Table Column Definition

```typescript
export interface ITableColumn<T = any> {
  id: string;
  key: keyof T;
  header: string;
  width?: number | string;
  sortable?: boolean;
  searchable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  hidden?: boolean;
}

export interface ITableState {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  searchText?: string;
  page: number;
  pageSize: number;
}
```

## Form Types

### Form Value and Error Types

```typescript
export type TFormValues<T> = T;
export type TFormErrors<T> = Partial<Record<keyof T, string>>;
export type TFormTouched<T> = Partial<Record<keyof T, boolean>>;

export interface IFormState<T> {
  values: TFormValues<T>;
  errors: TFormErrors<T>;
  touched: TFormTouched<T>;
  isSubmitting: boolean;
  isDirty: boolean;
}
```

## Select/Option Types

### Select Options

```typescript
export interface ISelectOption<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
  group?: string;
}

export type TSelectValue<T> = T | T[] | null;
```

## Analytics Types

### Event and Property Types

```typescript
export interface IGAEvent {
  eventName: string;
  eventParams: Record<string, any>;
  timestamp: number;
}

export type TGAOptions = Record<string, string | number | boolean | string[]>;
```

## Roles and Permissions

### Role Type

```typescript
export type TRole =
  | 'EvenFlowAdmin'
  | 'EvenFlowAccountManager'
  | 'EvenFlowSupport'
  | 'EvenFlowAIAgent'
  | 'DealerOwner'
  | 'ServiceDirector'
  | 'ServiceManager'
  | 'BDCManager'
  | 'BDCAgent'
  | 'Advisor'
  | 'Staff'
  | 'ServiceAdvisor';

export const Roles: Record<string, TRole> = {
  EvenFlowAdmin: 'EvenFlowAdmin',
  DealerOwner: 'DealerOwner',
  // ... all role values
};

export type TTitle = 'Mr' | 'Mrs' | 'Ms' | 'Dr' | 'Prof';
```

## React Element Types

### Flexible React Node Types

```typescript
export type TReactNode = React.ReactNode;
export type TReactElement = React.ReactElement;
export type TReactFCWithChildren<P = {}> = React.FC<React.PropsWithChildren<P>>;
```

## Import Organization

Global types are imported consistently:

```typescript
import type { ReactNode, ReactElement, FC } from 'react';
import type { Dayjs } from 'dayjs';
import type { Action } from 'redux';
import type { ThunkAction } from 'redux-thunk';
import type { RootState } from '../store/rootReducer';
```

## Type Guards

Some global types include utility functions:

```typescript
export const isParsableDate = (value: unknown): value is ParsableDate => {
  return (
    typeof value === 'string' ||
    value instanceof Date ||
    (value && typeof value === 'object' && 'format' in value)
  );
};

export const isRole = (value: unknown): value is TRole => {
  return Object.values(Roles).includes(value as TRole);
};
```

## Conditional Types

### Advanced TypeScript Patterns

```typescript
export type Flatten<T> = T extends Array<infer U> ? U : T;

export type AsyncFunction<T> = () => Promise<T>;

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;
```

## Key Conventions

1. **Type Naming** - Use `T` prefix for union types, `I` for interfaces
2. **Global Scope** - Place frequently-used types in main types.ts
3. **Export Organization** - Export types at end of file
4. **Documentation** - Complex types include JSDoc comments
5. **No Runtime** - Types are compile-time only (no const declarations for types)
6. **Readonly** - Mark immutable types with `readonly`
7. **Strict Mode** - All types are compatible with TypeScript strict mode
8. **Re-exports** - Import and re-export from other modules for convenience

## Example: Complete Types File Section

```typescript
// Redux
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// Date/Time
export type ParsableDate = string | Date | dayjs.Dayjs;
export type TParsableDate = ParsableDate | null | undefined;

// Callbacks
export type TCallback<T = void> = () => T;
export type TArgCallback<T, R = void> = (arg: T) => R;

// Forms
export type TFormValues<T> = T;
export type TFormErrors<T> = Partial<Record<keyof T, string>>;

// Roles
export type TRole = 'Admin' | 'User' | 'Guest';

// API
export interface PaginatedAPIResponse<T> {
  items: T[];
  total: number;
  page: number;
  hasMore: boolean;
}
```
