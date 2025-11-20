# Redux Types Style Guide

## Overview

Redux type definitions in EvenFlow-FE follow a strict pattern in the `types.ts` file for each feature reducer. This guide documents the unique conventions for TypeScript interfaces, enums, and type definitions specific to this project.

## Types File Structure

Each feature reducer's `types.ts` exports:

```typescript
// src/store/reducers/appointment/types.ts

// 1. State key constants
export const APPOINTMENT_STATE_KEY = 'appointment' as const;

// 2. Enums for typed values
export enum EAppointmentTimingType { ... }

// 3. Interfaces for data structures
export interface IServiceCenterProfile { ... }
export interface ISR { ... }

// 4. State interface
export type TAppointmentState = {
  serviceCenterProfiles: Record<number, IServiceCenterProfile>;
  serviceRequests: ISR[];
  // ...
};
```

## State Key Constants

All state keys are defined as string constants at the top of the types file:

```typescript
export const APPOINTMENT_STATE_KEY = 'appointment' as const;
export const APPOINTMENT_STATE_SAVED_KEY = 'appointmentSaved' as const;
export const APPOINTMENT_EDIT_STATE_KEY = 'appointmentEdit' as const;
```

**Pattern:** `{FEATURE}_STATE_KEY` with `as const` for type narrowing

## Enum Definitions

Enums use the `E` prefix and define categorical values:

### String Enums

```typescript
export enum EAppointmentTimingType {
  SAME_DAY = 'SAME_DAY',
  FUTURE_DATE = 'FUTURE_DATE',
  CUSTOM = 'CUSTOM',
}

export enum EServiceType {
  OIL_CHANGE = 'OIL_CHANGE',
  INSPECTION = 'INSPECTION',
  MAINTENANCE = 'MAINTENANCE',
  REPAIR = 'REPAIR',
}

export enum EPricingDisplayType {
  SHOW_PRICE = 'SHOW_PRICE',
  HIDE_PRICE = 'HIDE_PRICE',
  SHOW_RANGE = 'SHOW_RANGE',
}
```

### Numeric Enums

```typescript
export enum EMaintenanceOptionType {
  FULL_SERVICE = 0,
  PARTIAL_SERVICE = 1,
  DIAGNOSTIC = 2,
}
```

### Boolean Enums (used as constants)

```typescript
export enum EServiceStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}
```

## Interface Naming and Structure

### Data Interfaces (I prefix)

Interfaces represent data structures from API responses or domain models:

```typescript
export interface IServiceCenterProfile {
  id: number;
  name: string;
  serviceCenterEmail: string;
  contactPersonalEmail: string;
  phoneNumber: string;
  avatarPath: string;
  address: IAddress;
  dealershipId: number;
  dealershipName: string;
  serviceCenterFlag: number;
  isRoundPrice: boolean;
  isAuthRequired: boolean;
  isSendReminders?: boolean;
  maintenancePackageDisclaimer?: string;
  isShowPriceDetails?: boolean;
  defaultVehicleMakeId?: number | null;
  isCommentRequired: boolean;
  engineTypeFieldName?: string;
  dmsId?: string;
  maintenancePackageOptionTypes: EMaintenanceOptionType[];
  packageSource: PackageSourceType;
  emailRequirement?: TEmailRequirement;
}

export interface ISR {
  id: number;
  code?: string;
  description?: string;
  price?: number;
  comment?: string;
  isCommentRequired?: boolean;
}

export interface IAppointment {
  id: number;
  serviceCenterId: number;
  customerId: number;
  status: EAppointmentStatus;
  scheduledDate: ParsableDate;
  duration: number;
  notes?: string;
}
```

### Nested Interfaces

Related interfaces are grouped and nested:

```typescript
export interface IPersonalInformation {
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface IPrivacy {
  marketingConsent: boolean;
  privacyConsent: boolean;
  dataSharing: boolean;
}

export interface IReminders {
  email: boolean;
  sms: boolean;
  push: boolean;
}

export interface IAppointmentDetails {
  personal: IPersonalInformation;
  privacy: IPrivacy;
  reminders: IReminders;
}
```

## Request/Response Types

### Request Types (API Input)

Request interfaces are often more minimal:

```typescript
export interface ICreateAppointmentRequest {
  serviceCenterId: number;
  serviceIds: number[];
  scheduledDate: string;
  customerEmail: string;
  customerPhone: string;
}

export interface IUpdateAppointmentRequest {
  id: number;
  scheduledDate?: string;
  status?: EAppointmentStatus;
  notes?: string;
}

export interface IListAppointmentRequest {
  serviceCenterId: number;
  filters?: IAppointmentFilters;
  page?: number;
  pageSize?: number;
}
```

### Response Types

Response interfaces often extend or wrap request types:

```typescript
export interface IAppointmentResponse extends ICreateAppointmentRequest {
  id: number;
  createdAt: string;
  updatedAt: string;
  status: EAppointmentStatus;
}

export interface ICreateAppointmentResp {
  appointment: IAppointment;
  confirmationNumber: string;
  totalPrice: number;
}
```

## State Interface Pattern

The main state interface for each reducer uses `T{Feature}State` pattern:

```typescript
export type TAppointmentState = {
  // Data storage
  serviceCenterProfiles: Record<number, IServiceCenterProfile>;
  serviceRequests: ISR[];
  appointments: IAppointment[];
  selectedAppointment?: IAppointment;

  // Filters and search
  filters: IAppointmentFilters;
  searchResults: IAppointment[];

  // Personal information
  personalInformation: IPersonalInformation;
  privacy: IPrivacy;
  reminders: IReminders;

  // Timing and scheduling
  selectedDate: ParsableDate;
  timingType: EAppointmentTimingType;
  slots: IAppointmentSlot[];

  // UI States
  loading: boolean;
  slotsLoading: boolean;
  profileLoading: boolean;
  error: string | null;
  loadedReducer: boolean;

  // Session data
  sessionId: string;
  oldAppointmentId?: number;
  isCloneMode: boolean;
};
```

**Key conventions:**

- Data storage properties first
- Filters and search parameters grouped
- Related state grouped together
- UI state (loading, error) grouped at end
- Use `?` for optional properties
- Use `| null` for nullable values

## Utility Types

### Union Types

```typescript
export type TTimePeriod = 'MORNING' | 'AFTERNOON' | 'EVENING';

export type PackageSourceType = 'DMS' | 'SYSTEM' | 'MANUAL';

export type ParsableDate = string | Date | dayjs.Dayjs;
```

### Generic Utility Types

```typescript
// API Response wrapper
export type TApiResponse<T> = Promise<{
  data: T;
  status: number;
  message?: string;
}>;

// Paginated response
export interface IPaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
```

## Extracted Type Patterns

### Record Types for Lookups

```typescript
export type IServiceCenterProfileMap = Record<number, IServiceCenterProfile>;

export type IServiceRequestMap = Record<number, ISR>;

// Usage in state
export type TAppointmentState = {
  serviceCenterProfiles: IServiceCenterProfileMap;
  serviceRequests: IServiceRequestMap;
};
```

### Array Item Types

```typescript
export type IAppointmentSlot = {
  id: string;
  startTime: string;
  endTime: string;
  available: number;
  booked: number;
  isAvailable: boolean;
};

// Usage
export type TAppointmentState = {
  slots: IAppointmentSlot[];
};
```

## Filter Types

Filters for search/list operations have dedicated interfaces:

```typescript
export interface IAppointmentFilters {
  serviceCenterId?: number;
  status?: EAppointmentStatus;
  dateFrom?: ParsableDate;
  dateTo?: ParsableDate;
  customerId?: number;
  searchText?: string;
}

export interface IServiceRequestFilters {
  categoryId?: number;
  priceRange?: {
    min: number;
    max: number;
  };
  available?: boolean;
}
```

## Imported Types

Types often import from related features or global types:

```typescript
import { IAddress } from '../dealershipGroups/types';
import { EDemandCategory, EPricingDisplayType } from '../pricingSettings/types';
import { EOfferType, IOffer } from '../offers/types';
import { IServiceCategory, IServiceCategoryShort } from '../../../api/types';
import { ParsableDate, TParsableDate } from '../../../types/types';
```

## Type Guards and Constants

Some types files include helper type guards:

```typescript
export const isValidAppointmentStatus = (value: unknown): value is EAppointmentStatus => {
  return Object.values(EAppointmentStatus).includes(value as EAppointmentStatus);
};

export const getAppointmentStatusLabel = (status: EAppointmentStatus): string => {
  const labels: Record<EAppointmentStatus, string> = {
    [EAppointmentStatus.PENDING]: 'Pending',
    [EAppointmentStatus.CONFIRMED]: 'Confirmed',
    [EAppointmentStatus.CANCELLED]: 'Cancelled',
  };
  return labels[status];
};
```

## Key Conventions

1. **State Key Constants** - Always define state keys at the top as `const`
2. **Enum Names** - Use `E` prefix for all enums
3. **Interface Names** - Use `I` prefix for all interfaces/types
4. **State Name** - Use `T{Feature}State` for main state type
5. **Optional Fields** - Use `?` suffix for optional properties
6. **Nullable Fields** - Use `| null` instead of `?` when distinguishing undefined vs null
7. **Record Types** - Use `Record<Key, Value>` for lookup objects
8. **Union Types** - Use `|` for simple unions, `enum` for complex ones
9. **Imports First** - Import types from other features at top of file
10. **Exports Last** - Define types, then export all together

## Example: Complete Types File

```typescript
import { IAddress } from '../dealershipGroups/types';
import { ParsableDate } from '../../../types/types';

// State Keys
export const APPOINTMENT_STATE_KEY = 'appointment' as const;

// Enums
export enum EAppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum ETimingType {
  SAME_DAY = 'SAME_DAY',
  FUTURE = 'FUTURE',
}

// Interfaces
export interface IServiceCenterProfile {
  id: number;
  name: string;
  address: IAddress;
  email: string;
  phone: string;
  isActive: boolean;
}

export interface IAppointment {
  id: number;
  serviceCenterId: number;
  status: EAppointmentStatus;
  scheduledDate: ParsableDate;
  duration: number;
}

export interface IAppointmentFilters {
  status?: EAppointmentStatus;
  dateFrom?: ParsableDate;
  dateTo?: ParsableDate;
}

// State Type
export type TAppointmentState = {
  serviceCenterProfiles: Record<number, IServiceCenterProfile>;
  appointments: IAppointment[];
  selectedAppointment?: IAppointment;
  filters: IAppointmentFilters;
  loading: boolean;
  error: string | null;
};
```
