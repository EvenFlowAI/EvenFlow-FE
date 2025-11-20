# Utility Functions Style Guide

## Overview

The EvenFlow-FE project contains 20+ utility functions in `src/utils/` organized by purpose. Utility functions are pure functions that provide common functionality without side effects. This guide documents the unique conventions and patterns.

## Utilities Directory Structure

```
src/utils/
├── constants.ts                                # Global constants
├── types.ts                                    # Utility-specific types
├── autocompleteRenders.tsx                    # Autocomplete field renderers
├── collectServiceRequestIds.ts                # Service request collection
├── collectServiceRequestsForConsents.ts       # Consent-related collection
├── getDate.ts                                 # Date utility functions
├── getMaintenanceDescription.ts               # Maintenance description formatting
├── getTrackerById.ts                          # Tracker lookup
├── getTrackersForParentSite.ts               # Parent site tracker collection
├── svAppointments.ts                          # Service valet appointment utilities
└── ... (10+ utility modules)
```

## Constants Organization

### Global Constants

```typescript
// src/utils/constants.ts
import { TRole } from '../store/reducers/users/types';
import { EStates } from '../types/states';
import { Routes } from '../routes/constants';

export const states = Object.values(EStates);

export const WeekDayNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const availableUserRoles: TRole[] = [
  'EvenFlowAdmin',
  'EvenFlowAccountManager',
  'EvenFlowSupport',
  'EvenFlowAIAgent',
  'DealerOwner',
  'ServiceDirector',
  'ServiceManager',
  'BDCManager',
  'BDCAgent',
  'Advisor',
  'Staff',
];

export const DealershipsIds = {
  Default: 1,
  Development: 0,
} as const;

// Feature-specific constants
export const appointmentStatusConstants = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

// UI-related constants
export const PAGINATION_DEFAULTS = {
  pageSize: 10,
  defaultPage: 1,
};

export const DIALOG_DEFAULTS = {
  maxWidth: 'sm' as const,
  fullWidth: true,
};
```

## Pure Utility Functions

### Date Utilities

```typescript
// src/utils/getDate.ts
import dayjs, { Dayjs } from 'dayjs';
import { ParsableDate, TParsableDate } from '../types/types';

/**
 * Safely parse any date format into a Dayjs object
 */
export const parseDate = (date: TParsableDate): Dayjs | null => {
  if (!date) return null;
  const parsed = dayjs(date);
  return parsed.isValid() ? parsed : null;
};

/**
 * Format date for API requests (YYYY-MM-DD)
 */
export const formatDateForAPI = (date: ParsableDate): string => {
  return dayjs(date).format('YYYY-MM-DD');
};

/**
 * Format date for display (MM/DD/YYYY)
 */
export const formatDateForDisplay = (date: ParsableDate): string => {
  return dayjs(date).format('MM/DD/YYYY');
};

/**
 * Format time (HH:mm A)
 */
export const formatTime = (date: ParsableDate): string => {
  return dayjs(date).format('hh:mm A');
};

/**
 * Get date range (today, tomorrow, etc.)
 */
export const getDateRangeLabel = (start: ParsableDate, end: ParsableDate): string => {
  const startDay = dayjs(start);
  const endDay = dayjs(end);
  const diff = endDay.diff(startDay, 'day');

  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff < 7) return `${diff} days`;
  return `${diff} days (${formatDateForDisplay(start)} - ${formatDateForDisplay(end)})`;
};

/**
 * Check if date is in the past
 */
export const isPastDate = (date: ParsableDate): boolean => {
  return dayjs(date).isBefore(dayjs(), 'day');
};

/**
 * Check if date is today
 */
export const isToday = (date: ParsableDate): boolean => {
  return dayjs(date).isSame(dayjs(), 'day');
};
```

### String and Text Utilities

```typescript
// src/utils/stringUtils.ts
/**
 * Capitalize first letter
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Format phone number (123) 456-7890
 */
export const formatPhoneNumber = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10) return phone;

  const areaCode = digits.slice(0, 3);
  const exchange = digits.slice(3, 6);
  const number = digits.slice(6, 10);

  return `(${areaCode}) ${exchange}-${number}`;
};

/**
 * Truncate string with ellipsis
 */
export const truncate = (str: string, maxLength: number): string => {
  return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
};

/**
 * Format currency
 */
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};
```

### Array Utilities

```typescript
// src/utils/arrayUtils.ts
/**
 * Remove duplicate items from array
 */
export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

/**
 * Group array items by key
 */
export const groupBy = <T, K extends string | number>(
  array: T[],
  keyExtractor: (item: T) => K
): Record<K, T[]> => {
  return array.reduce(
    (acc, item) => {
      const key = keyExtractor(item);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    },
    {} as Record<K, T[]>
  );
};

/**
 * Find differences between two arrays
 */
export const difference = <T>(arr1: T[], arr2: T[]): T[] => {
  return arr1.filter(item => !arr2.includes(item));
};

/**
 * Flatten nested array
 */
export const flatten = <T>(array: (T | T[])[]): T[] => {
  return array.reduce<T[]>((acc, item) => {
    return Array.isArray(item) ? [...acc, ...item] : [...acc, item];
  }, []);
};

/**
 * Paginate array
 */
export const paginate = <T>(array: T[], page: number, pageSize: number): T[] => {
  const start = (page - 1) * pageSize;
  return array.slice(start, start + pageSize);
};
```

### Object Utilities

```typescript
// src/utils/objectUtils.ts
/**
 * Pick specific keys from object
 */
export const pick = <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    result[key] = obj[key];
  });
  return result;
};

/**
 * Omit specific keys from object
 */
export const omit = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result;
};

/**
 * Merge objects deeply
 */
export const deepMerge = <T extends Record<string, any>>(target: T, source: Partial<T>): T => {
  const result = { ...target };

  Object.entries(source).forEach(([key, value]) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[key as keyof T] = deepMerge(target[key as keyof T] || {}, value as any);
    } else {
      result[key as keyof T] = value as any;
    }
  });

  return result;
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj: Record<string, any>): boolean => {
  return Object.keys(obj).length === 0;
};
```

### Validation Utilities

```typescript
// src/utils/validation.ts
/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?1?\d{9,15}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

/**
 * Validate zip code
 */
export const isValidZipCode = (zip: string): boolean => {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zip);
};

/**
 * Validate URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
```

## Collection Utilities

### Service Request Collection

```typescript
// src/utils/collectServiceRequestIds.ts
import { ISR } from '../store/reducers/appointment/types';

/**
 * Collect all service request IDs from list
 */
export const collectServiceRequestIds = (serviceRequests: ISR[]): number[] => {
  return serviceRequests.map(sr => sr.id);
};

/**
 * Filter service requests by category
 */
export const filterServiceRequestsByCategory = (
  serviceRequests: ISR[],
  category: string
): ISR[] => {
  return serviceRequests.filter(sr => sr.category === category);
};

/**
 * Sort service requests by price
 */
export const sortServiceRequestsByPrice = (
  serviceRequests: ISR[],
  order: 'asc' | 'desc' = 'asc'
): ISR[] => {
  return [...serviceRequests].sort((a, b) => {
    const priceA = a.price || 0;
    const priceB = b.price || 0;
    return order === 'asc' ? priceA - priceB : priceB - priceA;
  });
};
```

### Tracker Utilities

```typescript
// src/utils/getTrackerById.ts
import { ITracker } from '../types/types';

/**
 * Find tracker by ID in list
 */
export const getTrackerById = (trackerId: string, trackers: ITracker[]): ITracker | undefined => {
  return trackers.find(tracker => tracker.id === trackerId);
};

/**
 * Get all parent site trackers
 */
export const getTrackersForParentSite = (
  parentSiteId: number,
  trackers: ITracker[]
): ITracker[] => {
  return trackers.filter(tracker => tracker.parentSiteId === parentSiteId);
};

/**
 * Check if tracker is active
 */
export const isTrackerActive = (tracker: ITracker): boolean => {
  return tracker.status === 'ACTIVE' && !tracker.isDeleted;
};
```

## Display/Formatting Utilities

### Description Formatters

```typescript
// src/utils/getMaintenanceDescription.ts
import { EServiceType } from '../store/reducers/appointmentFrameReducer/types';

/**
 * Get human-readable maintenance description
 */
export const getMaintenanceDescription = (
  serviceType: EServiceType,
  options?: Record<string, any>
): string => {
  const descriptions: Record<EServiceType, string> = {
    [EServiceType.OIL_CHANGE]: 'Oil Change Service',
    [EServiceType.INSPECTION]: 'Vehicle Inspection',
    [EServiceType.MAINTENANCE]: 'General Maintenance',
    [EServiceType.REPAIR]: 'Repair Service',
  };

  let description = descriptions[serviceType] || 'Unknown Service';

  if (options?.isUrgent) {
    description += ' (Urgent)';
  }

  if (options?.estimatedTime) {
    description += ` - Est. ${options.estimatedTime} min`;
  }

  return description;
};
```

### Render Utilities

```typescript
// src/utils/autocompleteRenders.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * Render option with label and description
 */
export const renderOptionWithDescription = (
  label: string,
  description?: string
) => {
  return (
    <Box>
      <Typography variant="body2">{label}</Typography>
      {description && (
        <Typography variant="caption" color="textSecondary">
          {description}
        </Typography>
      )}
    </Box>
  );
};

/**
 * Render option with icon
 */
export const renderOptionWithIcon = (
  label: string,
  icon: React.ReactNode
) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {icon}
      <Typography variant="body2">{label}</Typography>
    </Box>
  );
};
```

## Key Conventions

1. **Pure Functions** - All utility functions are pure (no side effects)
2. **No Dependencies** - Utilities don't import from Redux or API layer
3. **Type Safe** - All utilities are fully typed with TypeScript
4. **Well Documented** - Utility functions include JSDoc comments
5. **Single Responsibility** - Each utility does one thing well
6. **Testable** - Utilities are unit tested independently
7. **Exported from Index** - Each utility module exports its functions
8. **Naming Convention** - Utility names are descriptive verbs: `formatDate`, `groupBy`, `isValid`
9. **No Defaults** - Optional parameters explicitly typed with `?`
10. **Reusable** - Utilities designed for reuse across the application

## Example: Complete Utility Module

```typescript
// src/utils/dateUtils.ts
import dayjs from 'dayjs';
import { ParsableDate } from '../types/types';

export const formatDateForAPI = (date: ParsableDate): string => {
  return dayjs(date).format('YYYY-MM-DD');
};

export const formatDateForDisplay = (date: ParsableDate): string => {
  return dayjs(date).format('MM/DD/YYYY');
};

export const isToday = (date: ParsableDate): boolean => {
  return dayjs(date).isSame(dayjs(), 'day');
};

export const getDayName = (date: ParsableDate): string => {
  return dayjs(date).format('dddd');
};

export const addDays = (date: ParsableDate, days: number): string => {
  return dayjs(date).add(days, 'day').toISOString();
};

export const getDaysBetween = (startDate: ParsableDate, endDate: ParsableDate): number => {
  return dayjs(endDate).diff(dayjs(startDate), 'day');
};
```
