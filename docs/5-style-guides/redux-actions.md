# Redux Actions Style Guide

## Overview

Redux actions in EvenFlow-FE are organized in the `actions.ts` file for each feature reducer. This guide documents the unique conventions for creating actions, action creators, and async thunks using Redux Toolkit.

## Action Categories

### 1. Synchronous Actions

Simple state mutations created with `createAction`:

```typescript
// src/store/reducers/appointment/actions.ts
import { createAction } from '@reduxjs/toolkit';

// Single value actions
export const setSessionId = createAction<string>('appointment/setSessionId');
export const setSlotsLoading = createAction<boolean>('appointment/setSlotsLoading');
export const setLoadedReducer = createAction<boolean>('appointment/setLoadedReducer');

// Object payload actions
export const changePersonalInformation = createAction<IPersonalInformation>(
  'appointment/changePersonalInformation'
);

export const setAppointmentFilters = createAction<IAppointmentFilters>(
  'appointment/setAppointmentFilters'
);
```

### 2. Async Thunk Actions

Actions that perform asynchronous operations using Redux Thunk:

```typescript
import { AppThunk } from '../../../types/types';

export const getServiceCenterProfile =
  (serviceCenterId: number): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setProfileLoading(true));
      const response = await API.appointment.getServiceCenterProfile(serviceCenterId);
      dispatch(setServiceCenterProfile(response.data));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      dispatch(setProfileLoading(false));
    }
  };
```

## AppThunk Type Pattern

The project defines a custom `AppThunk` type for type-safe async actions:

```typescript
// src/types/types.ts
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store/rootReducer';
import { Action } from 'redux';

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
```

Usage:

```typescript
// Thunk returning void
export const fetchData = (): AppThunk => async dispatch => {
  // ...
};

// Thunk returning a value
export const fetchAndReturn = (): AppThunk<Promise<IData>> => async dispatch => {
  const data = await fetchData();
  return data;
};
```

## Thunk Action Patterns

### Basic Async Thunk

```typescript
export const getAppointmentSlots =
  (request: IAppointmentSlotsRequest): AppThunk =>
  async dispatch => {
    try {
      dispatch(setSlotsLoading(true));
      const response = await API.appointment.getSlots(request);
      dispatch(setAppointmentSlots(response.data));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      dispatch(setSlotsLoading(false));
    }
  };
```

### Thunk with Return Value

```typescript
export const createAppointment =
  (data: ICreateAppointmentRequest): AppThunk<Promise<IAppointment>> =>
  async dispatch => {
    try {
      dispatch(setLoading(true));
      const response = await API.appointment.create(data);
      const appointment = response.data;
      dispatch(addAppointment(appointment));
      return appointment;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create appointment';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };
```

### Thunk with State Access

```typescript
export const selectOrCreateAppointment =
  (centerId: number): AppThunk =>
  async (dispatch, getState) => {
    const state = getState();
    const appointments = selectAppointmentsByCenter(state, centerId);

    if (appointments.length > 0) {
      dispatch(selectAppointment(appointments[0]));
    } else {
      const newAppointment = await dispatch(createAppointment({ serviceCenterId: centerId }));
      dispatch(selectAppointment(newAppointment));
    }
  };
```

### Thunk with Conditional Logic

```typescript
export const handleSearch =
  (query: string): AppThunk =>
  async (dispatch, getState) => {
    const state = getState();
    const existingResults = selectCachedResults(state, query);

    if (existingResults) {
      dispatch(setSearchResults(existingResults));
      return;
    }

    try {
      dispatch(setSlotsLoading(true));
      const response = await API.appointment.search(query);
      dispatch(setSearchResults(response.data));
      dispatch(cacheSearchResults({ query, results: response.data }));
    } catch (error) {
      dispatch(setError('Search failed'));
    } finally {
      dispatch(setSlotsLoading(false));
    }
  };
```

## Action Organization

### ESLint Disable Comments

Complex action files use ESLint disable comments:

```typescript
/* eslint-disable max-lines */
/* eslint-disable complexity */

// Multiple actions and thunks in this file
```

This is common for feature reducers with 40+ actions.

### Action Ordering

Actions are typically ordered by:

1. Simple setter actions first
2. Complex state mutations
3. Async thunks
4. Related thunks grouped together

```typescript
// Simple actions
export const setSessionId = createAction<string>('appointment/setSessionId');
export const setSlotsLoading = createAction<boolean>('appointment/setSlotsLoading');

// Complex mutations
export const changePersonalInformation = createAction<IPersonalInformation>(
  'appointment/changePersonalInformation'
);

// Async thunks - data fetching
export const getServiceCenterProfile =
  (serviceCenterId: number): AppThunk =>
  async dispatch => {
    // ...
  };

export const getAppointmentSlots =
  (request: IAppointmentSlotsRequest): AppThunk =>
  async dispatch => {
    // ...
  };

// Async thunks - data mutation
export const createAppointment =
  (data: ICreateAppointmentRequest): AppThunk<Promise<IAppointment>> =>
  async dispatch => {
    // ...
  };
```

## Import Patterns

```typescript
import { createAction } from '@reduxjs/toolkit';
import {
  APPOINTMENT_STATE_KEY,
  APPOINTMENT_STATE_SAVED_KEY,
  EAppointmentTimingType,
  IAppointmentFilters,
  IAppointmentResponse,
  IAppointmentSlot,
  // ... many type imports
} from './types';
import { AppThunk, PaginatedAPIResponse, TParsableDate } from '../../../types/types';
import { ICreateAppointmentResp, ICustomerLoadedData } from '../../../api/types';
import { Api } from '../../../api/ApiEndpoints/ApiEndpoints';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
```

## Error Handling in Thunks

### Standard Error Pattern

```typescript
export const fetchData =
  (id: number): AppThunk =>
  async dispatch => {
    try {
      dispatch(setLoading(true));
      const response = await API.getData(id);
      dispatch(setData(response.data));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      dispatch(setError(errorMessage));
      // Optional: re-throw for component handling
      // throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };
```

### With Toast/Notification

```typescript
export const submitForm =
  (data: IFormData): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setLoading(true));
      const response = await API.submitForm(data);
      dispatch(setFormData(response.data));
      // Note: Dispatch to a notification reducer
      dispatch(showSuccessNotification('Form submitted successfully'));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Form submission failed';
      dispatch(showErrorNotification(message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };
```

## Handling Side Effects

### Cascading Actions

```typescript
export const updateAppointmentAndRefresh =
  (appointmentId: number, updates: Partial<IAppointment>): AppThunk =>
  async dispatch => {
    try {
      // First update the appointment
      await dispatch(updateAppointment(appointmentId, updates));
      // Then refresh related data
      await dispatch(getServiceCenterProfile(updates.serviceCenterId));
      // Then refresh appointments list
      await dispatch(fetchAppointments());
    } catch (error) {
      dispatch(setError('Update failed'));
    }
  };
```

### Parallel Actions

```typescript
export const initializeBookingFlow =
  (serviceCenterId: number): AppThunk =>
  async dispatch => {
    try {
      // Fetch all required data in parallel
      const [profile, slots, vehicles] = await Promise.all([
        dispatch(getServiceCenterProfile(serviceCenterId)) as any,
        dispatch(getAppointmentSlots({ serviceCenterId })) as any,
        dispatch(getCustomerVehicles()) as any,
      ]);

      dispatch(setInitialized(true));
    } catch (error) {
      dispatch(setError('Failed to initialize'));
    }
  };
```

## Payload Type Naming

Large payload objects follow naming conventions:

```typescript
// Request types (data sent to API)
export const submitAppointmentRequest = createAction<ICreateAppointmentRequest>(
  'appointment/submitRequest'
);

// Response types (data returned from API)
export const setAppointmentResponse = createAction<IAppointmentResponse>('appointment/setResponse');

// Combined types for complex payloads
export const setAppointmentData = createAction<{
  appointment: IAppointment;
  slots: IAppointmentSlot[];
  profile: IServiceCenterProfile;
}>('appointment/setData');
```

## Key Conventions

1. **Action Type Strings** - Use feature name as prefix: `'appointment/setSessionId'`
2. **Thunk Pattern** - Always use `(dispatch, getState)` tuple pattern
3. **Error Messages** - Always include meaningful error context
4. **Loading States** - Always set loading true before, false after
5. **Try-Finally** - Use finally block to ensure cleanup
6. **Type Safety** - Always type action payloads explicitly
7. **Return Values** - Thunks can return promises or void
8. **State Access** - Use selectors for getState access when possible
9. **Re-throwing** - Only re-throw if component needs to handle
10. **Caching** - Check cache before fetching in thunks

## Example: Complete Feature Actions

```typescript
/* eslint-disable max-lines */

import { createAction } from '@reduxjs/toolkit';
import { AppThunk } from '../../../types/types';
import { Api } from '../../../api/ApiEndpoints/ApiEndpoints';

// Types
import {
  IAppointment,
  IAppointmentFilters,
  IServiceCenterProfile,
  TAppointmentState,
} from './types';

// Simple Actions
export const setSessionId = createAction<string>('appointment/setSessionId');
export const setLoading = createAction<boolean>('appointment/setLoading');
export const setError = createAction<string | null>('appointment/setError');
export const setAppointmentFilters = createAction<IAppointmentFilters>('appointment/setFilters');

// Complex Actions
export const setAppointmentData = createAction<{
  appointments: IAppointment[];
  profile: IServiceCenterProfile;
}>('appointment/setData');

// Async Thunks
export const fetchAppointments =
  (filterId: number): AppThunk =>
  async dispatch => {
    try {
      dispatch(setLoading(true));
      const response = await Api.appointment.list({ id: filterId });
      dispatch(
        setAppointmentData({
          appointments: response.data.items,
          profile: response.data.profile,
        })
      );
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to fetch'));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const createAppointment =
  (data: IAppointment): AppThunk<Promise<IAppointment>> =>
  async dispatch => {
    try {
      dispatch(setLoading(true));
      const response = await Api.appointment.create(data);
      dispatch(
        setAppointmentData({
          appointments: [response.data],
          profile: response.data.profile,
        })
      );
      return response.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create';
      dispatch(setError(message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };
```
