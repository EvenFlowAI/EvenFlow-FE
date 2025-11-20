# Custom Hooks Style Guide

## Overview

The EvenFlow-FE project contains 22+ custom hooks organized by purpose: business logic, UI state management, form handling, data fetching, utilities, routing, analytics, and styling. This guide documents the unique conventions and patterns for custom hooks in this project.

## Hook Directory Structure

Each custom hook is organized in its own directory:

```
src/hooks/{hookName}/
├── {hookName}.ts       # Main hook implementation
├── index.ts            # Export file
└── types.ts            # Hook-specific types (optional)
```

Example structure:

```
src/hooks/useCurrentUser/
├── useCurrentUser.ts
├── index.ts
└── (no types file needed for simple hooks)
```

## Hook Naming Convention

- All hooks follow the `use{PurposeName}` convention
- Names are descriptive of the returned value or action: `useCurrentUser`, `useValidation`, `useModal`
- Hooks that fetch data include the data type: `useGetConsultantsData`, `useGetTransportationsData`
- Hooks that manage state include the state type: `useMessage`, `useConfirm`, `useException`

## Business Logic Hooks

### Pattern: Redux Selector Hooks

Simple hooks that expose Redux state without manipulation:

```typescript
// src/hooks/useCurrentUser/useCurrentUser.ts
import { ICurrentUser } from '../../store/reducers/users/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';

export const useCurrentUser = (): ICurrentUser | undefined => {
  return useSelector((state: RootState) => state.users.currentUser);
};
```

**Key convention:** Simple one-liner Redux selectors don't need custom hook abstraction, but when they're frequently used across components, they are wrapped in custom hooks for consistency.

### Pattern: Complex Business Logic Hooks

Hooks that combine multiple Redux selectors and perform business logic:

```typescript
// src/hooks/useDealershipProfile/useDealershipProfile.ts
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { IServiceCenterProfile } from '../../store/reducers/appointment/types';

export const useDealershipProfile = (dealershipId: number): IServiceCenterProfile | undefined => {
  return useSelector((state: RootState) => {
    const profile = state.appointment.serviceCenterProfiles[dealershipId];
    // Additional business logic if needed
    return profile;
  });
};
```

### Pattern: Hooks with Memoized Selectors

For expensive computations, use Redux `createSelector`:

```typescript
import { createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';

const selectConsultantsData = createSelector([(state: RootState) => state.consultants.data], data =>
  data.filter(c => c.isActive)
);

export const useGetConsultantsData = () => {
  return useSelector(selectConsultantsData);
};
```

## UI State Management Hooks

### Pattern: Modal Control Hooks

Hooks that manage modal visibility and data:

```typescript
// src/hooks/useModal/useModal.ts
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { openModal, closeModal, setModalData } from '../../store/reducers/modals/actions';

export const useModal = (modalName: string) => {
  const dispatch = useDispatch();
  const { isOpen, data } = useSelector((state: RootState) => state.modals[modalName]);

  const open = useCallback(
    (data?: any) => {
      dispatch(openModal({ name: modalName, data }));
    },
    [dispatch, modalName]
  );

  const close = useCallback(() => {
    dispatch(closeModal(modalName));
  }, [dispatch, modalName]);

  return { isOpen, data, open, close };
};
```

### Pattern: Message/Notification Hooks

Hooks that integrate with Notistack for notifications:

```typescript
// src/hooks/useMessage/useMessage.ts
import { useCallback } from 'react';
import { useSnackbar } from 'notistack';

export const useMessage = () => {
  const { enqueueSnackbar } = useSnackbar();

  const success = useCallback(
    (message: string) => {
      enqueueSnackbar(message, { variant: 'success' });
    },
    [enqueueSnackbar]
  );

  const error = useCallback(
    (message: string) => {
      enqueueSnackbar(message, { variant: 'error' });
    },
    [enqueueSnackbar]
  );

  return { success, error };
};
```

### Pattern: Confirmation Dialog Hooks

```typescript
// src/hooks/useConfirm/useConfirm.ts
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useConfirm = () => {
  const dispatch = useDispatch();
  const { isOpen, message, onConfirm, onCancel } = useSelector(
    (state: RootState) => state.ui.confirm
  );

  const confirm = useCallback(
    (message: string, onConfirm: () => void, onCancel?: () => void) => {
      dispatch(openConfirmDialog({ message, onConfirm, onCancel }));
    },
    [dispatch]
  );

  return { isOpen, message, onConfirm, onCancel, confirm };
};
```

## Form Validation Hooks

### Pattern: Validation Hook

Custom validation logic with rule-based validation:

```typescript
// src/hooks/useValidation/useValidation.ts
import { useState, useCallback } from 'react';

interface ValidationRule {
  validate: (value: any) => boolean;
  message: string;
}

interface ValidationRules {
  [field: string]: ValidationRule[];
}

export const useValidation = (rules: ValidationRules) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback(
    (data: Record<string, any>) => {
      const newErrors: Record<string, string> = {};

      Object.entries(rules).forEach(([field, fieldRules]) => {
        const value = data[field];
        const failedRule = fieldRules.find(rule => !rule.validate(value));
        if (failedRule) {
          newErrors[field] = failedRule.message;
        }
      });

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [rules]
  );

  return { errors, validate };
};
```

**Usage:**

```typescript
const { errors, validate } = useValidation({
  email: [
    { validate: v => Boolean(v), message: 'Email is required' },
    { validate: v => /\S+@\S+\.\S+/.test(v), message: 'Invalid email' },
  ],
  password: [{ validate: v => v.length >= 8, message: 'Min 8 characters' }],
});
```

## Data Fetching Hooks

### Pattern: API Data Fetching

Hooks that fetch data from the API and manage loading/error states:

```typescript
// src/hooks/useGetConsultantsData/useGetConsultantsData.ts
import { useEffect, useState } from 'react';
import { API } from '../../api/api';
import { IConsultant } from '../../types/types';

export const useGetConsultantsData = (serviceCenterId: number) => {
  const [data, setData] = useState<IConsultant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await API.consultants.list(serviceCenterId);
        if (isMounted) {
          setData(response.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [serviceCenterId]);

  return { data, loading, error };
};
```

**Key conventions:**

- Always use `isMounted` flag to prevent memory leaks
- Catch errors and provide meaningful error messages
- Return `{ data, loading, error }` tuple for consistency
- Dependencies array must include all external dependencies

## Utility Hooks

### Pattern: Debounce Hook

```typescript
// src/hooks/useDebounce/useDebounce.ts
import { useEffect, useState } from 'react';

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(T);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
```

### Pattern: Click Outside Hook

```typescript
// src/hooks/useClickOutside/useClickOutside.ts
import { useEffect, useRef } from 'react';

export const useClickOutside = (callback: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [callback]);

  return ref;
};
```

### Pattern: On-Screen Visibility Hook

```typescript
// src/hooks/useOnScreen/useOnScreen.ts
import { useEffect, useRef, useState } from 'react';

export const useOnScreen = (options?: IntersectionObserverInit) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [options]);

  return { ref, isVisible };
};
```

### Pattern: Local Storage Hook

```typescript
// src/hooks/useStorage/useStorage.ts
import { useState, useEffect } from 'react';

export const useStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };

  return [storedValue, setValue] as const;
};
```

## Routing Hooks

### Pattern: Query Parameters Hook

```typescript
// src/hooks/useQueryParams/useQueryParams.ts
import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';

export const useQueryParams = <T extends Record<string, any>>(): T => {
  const { search } = useLocation();

  return useMemo(() => {
    const params = new URLSearchParams(search);
    const obj: any = {};
    params.forEach((value, key) => {
      obj[key] = value;
    });
    return obj as T;
  }, [search]);
};
```

### Pattern: PopState Hook

```typescript
// src/hooks/usePopState/usePopState.ts
import { useEffect, useRef } from 'react';

export const usePopState = (callback: () => void) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handlePopState = () => callbackRef.current();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
};
```

## Analytics Hooks

### Pattern: Analytics Event Hook

```typescript
// src/hooks/useAnalyticsBySCId/useAnalyticsBySCId.ts
import { useEffect } from 'react';
import { trackEvent } from '../../utils/analytics';

export const useAnalyticsBySCId = (
  serviceCenterId: string,
  eventName: string,
  eventData?: Record<string, any>
) => {
  useEffect(() => {
    trackEvent(eventName, {
      serviceCenterId,
      ...eventData,
    });
  }, [serviceCenterId, eventName, eventData]);
};
```

## Key Conventions

1. **Return Types** - Always explicitly type the return value
2. **Dependencies** - Always include complete dependencies array in useEffect
3. **Performance** - Use useCallback for functions passed as dependencies
4. **Memory Leaks** - Always cleanup subscriptions/timers in cleanup function
5. **Error Handling** - Wrap API calls in try-catch with meaningful error messages
6. **Organization** - Similar hooks grouped in same directory
7. **Documentation** - JSDoc comments for complex hooks with examples
8. **Testing** - All hooks are testable with react-hooks-testing-library

## Example: Complete Hook

```typescript
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { API } from '../../api/api';
import { RootState } from '../../store/rootReducer';
import { IConsultant } from '../../types/types';
import { fetchConsultantsSuccess, fetchConsultantsError } from '../../store/actions';

/**
 * Fetches consultants for a service center
 * @param serviceCenterId - The service center ID to fetch consultants for
 * @returns Object with data, loading, error, and refetch function
 */
export const useGetConsultantsData = (serviceCenterId: number) => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.consultants);

  const refetch = useCallback(async () => {
    try {
      const response = await API.consultants.list(serviceCenterId);
      dispatch(fetchConsultantsSuccess(response.data));
    } catch (err) {
      dispatch(fetchConsultantsError(err));
    }
  }, [serviceCenterId, dispatch]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
};
```
