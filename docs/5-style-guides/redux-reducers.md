# Redux Reducers Style Guide

## Overview

The EvenFlow-FE project uses **Redux Toolkit 1.4.0** with **Redux Thunk** middleware for state management. Reducers follow a 3-file pattern organized by feature. This guide documents the unique conventions and patterns for reducer implementation.

## Directory Structure

Reducers are organized in `src/store/reducers/` with one directory per feature:

```
src/store/reducers/
├── appointment/           # Feature: Appointment management
│   ├── types.ts          # TypeScript interfaces and types
│   ├── actions.ts        # Action creators and async thunks
│   └── reducer.ts        # Reducer implementation
├── pricingSettings/      # Feature: Pricing configuration
├── serviceCenters/       # Feature: Service center management
├── employees/            # Feature: Employee management
├── capacity/             # Feature: Capacity planning
└── ... (40+ feature reducers)
```

## Naming Conventions

### Feature Naming

- Directory names are camelCase and descriptive: `appointment`, `pricingSettings`, `serviceCenters`
- Complex features use multiple words: `demandManagement`, `employeeCapacity`, `appointmentFrameReducer`
- Related features group together: `offers`, `packages`, `pricing*`

### Type Naming

- Interface names use `I` prefix: `IAppointment`, `IServiceCenter`
- Enum names use `E` prefix: `EAppointmentStatus`, `EServiceType`
- State interface: `T{Feature}State` or `I{Feature}State`

## Reducer Types Pattern

### State Interface

```typescript
// src/store/reducers/appointment/types.ts

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
  // ... more properties
}

export interface ISR {
  id: number;
  code?: string;
  description?: string;
  price?: number;
  comment?: string;
}

export type TAppointmentState = {
  serviceCenterProfiles: Record<number, IServiceCenterProfile>;
  serviceRequests: ISR[];
  appointments: IAppointment[];
  loading: boolean;
  error: string | null;
  // ... more state properties
};

export const APPOINTMENT_STATE_KEY = 'appointment' as const;
```

### Constants

State keys are defined as string constants for type safety:

```typescript
export const APPOINTMENT_STATE_KEY = 'appointment' as const;
export const APPOINTMENT_STATE_SAVED_KEY = 'appointmentSaved' as const;

export enum EAppointmentTimingType {
  SAME_DAY = 'SAME_DAY',
  FUTURE_DATE = 'FUTURE_DATE',
}
```

## Action Creators Pattern

Actions are created in `actions.ts` file using Redux Toolkit's `createAction`:

### Simple Actions

```typescript
// src/store/reducers/appointment/actions.ts
import { createAction } from '@reduxjs/toolkit';

export const setSessionId = createAction<string>('appointment/setSessionId');
export const setSlotsLoading = createAction<boolean>('appointment/setSlotsLoading');
export const setLoadedReducer = createAction<boolean>('appointment/setLoadedReducer');
```

### Actions with Payload

```typescript
export const changePersonalInformation = createAction<IPersonalInformation>(
  'appointment/changePersonalInformation'
);

export const setAppointmentFilters = createAction<IAppointmentFilters>(
  'appointment/setAppointmentFilters'
);
```

### Async Thunks

Async operations use Redux Thunk with `AppThunk` type:

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

## Reducer Implementation Pattern

### createReducer with Handlers

```typescript
// src/store/reducers/appointment/reducer.ts
import { createReducer } from '@reduxjs/toolkit';

const initialState: TAppointmentState = {
  serviceCenterProfiles: {},
  serviceRequests: [],
  appointments: [],
  loading: false,
  error: null,
  // ... more state properties
};

export const appointmentReducer = createReducer(initialState, builder => {
  builder
    // Set state actions
    .addCase(setSessionId, (state, action) => {
      state.sessionId = action.payload;
    })
    .addCase(changePersonalInformation, (state, action) => {
      state.personalInformation = action.payload;
    })
    // Thunk fulfilled actions
    .addCase(getServiceCenterProfile.fulfilled, (state, action) => {
      state.serviceCenterProfiles[action.payload.id] = action.payload;
      state.loading = false;
    })
    .addCase(getServiceCenterProfile.rejected, (state, action) => {
      state.error = action.payload || 'Failed to fetch profile';
      state.loading = false;
    })
    .addCase(getAppointmentSlots.fulfilled, (state, action) => {
      state.slots = action.payload;
      state.slotsLoading = false;
    })
    .addCase(getAppointmentSlots.rejected, (state, action) => {
      state.error = action.payload;
      state.slotsLoading = false;
    });
});
```

### Handling Nested State

```typescript
builder.addCase(selectAppointment, (state, action) => {
  state.selectedAppointment = action.payload;
});

builder.addCase(updateAppointment, (state, action) => {
  const index = state.appointments.findIndex(a => a.id === action.payload.id);
  if (index !== -1) {
    state.appointments[index] = action.payload;
  }
});
```

### Handling Arrays

```typescript
builder.addCase(addServiceRequest, (state, action) => {
  state.serviceRequests.push(action.payload);
});

builder.addCase(removeServiceRequest, (state, action) => {
  state.serviceRequests = state.serviceRequests.filter(sr => sr.id !== action.payload);
});

builder.addCase(updateServiceRequests, (state, action) => {
  state.serviceRequests = action.payload;
});
```

## Store Setup Pattern

### Root Reducer

```typescript
// src/store/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import { appointmentReducer } from './reducers/appointment/reducer';
import { pricingSettingsReducer } from './reducers/pricingSettings/reducer';
import { serviceCentersReducer } from './reducers/serviceCenters/reducer';
// ... 40+ reducer imports

export const rootReducer = combineReducers({
  appointment: appointmentReducer,
  pricingSettings: pricingSettingsReducer,
  serviceCenters: serviceCentersReducer,
  // ... 40+ reducer registrations
});

export type RootState = ReturnType<typeof rootReducer>;
```

### Store Configuration

```typescript
// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';
import persistReducer from 'redux-persist/lib/persistReducer';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['appointment', 'users', 'bookingFlowConfig'], // Persist selected slices
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type AppDispatch = typeof store.dispatch;
```

## Selectors Pattern

### Basic Selectors

```typescript
export const selectAppointments = (state: RootState) => state.appointment.appointments;
export const selectLoading = (state: RootState) => state.appointment.loading;
export const selectError = (state: RootState) => state.appointment.error;
```

### Memoized Selectors

For expensive computations, use `createSelector`:

```typescript
import { createSelector } from '@reduxjs/toolkit';

export const selectActiveAppointments = createSelector([selectAppointments], appointments =>
  appointments.filter(a => a.status === 'ACTIVE')
);

export const selectAppointmentsByCenter = createSelector(
  [
    (state: RootState, centerId: number) => state.appointment.appointments,
    (_, centerId) => centerId,
  ],
  (appointments, centerId) => appointments.filter(a => a.serviceCenterId === centerId)
);
```

## Handling Side Effects

### Thunk Action with Error Handling

```typescript
export const createAppointment =
  (data: ICreateAppointmentRequest): AppThunk<Promise<IAppointment>> =>
  async (dispatch, getState) => {
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

### Conditional State Updates

```typescript
export const selectOrCreateAppointment =
  (centerId: number): AppThunk =>
  async (dispatch, getState) => {
    const state = getState();
    const existing = selectAppointmentsByCenter(state, centerId);

    if (existing.length > 0) {
      dispatch(selectAppointment(existing[0]));
    } else {
      const newAppointment = await dispatch(createAppointment({ serviceCenterId: centerId }));
      dispatch(selectAppointment(newAppointment));
    }
  };
```

## Key Conventions

1. **Three-File Pattern** - Always organize reducers into types.ts, actions.ts, reducer.ts
2. **createReducer** - Use Redux Toolkit's `createReducer` with builder pattern
3. **Immutable Updates** - Let Immer (built into Toolkit) handle immutability
4. **Action Types** - Use action string constants: `'appointment/setSessionId'`
5. **Error Handling** - Always include try-catch with meaningful error messages
6. **Loading States** - Always track loading state for async operations
7. **Type Safety** - Use TypeScript strict mode with typed actions and state
8. **Persistence** - Configure redux-persist for important state slices
9. **Naming** - Feature directories are camelCase, state keys are CONSTANT_CASE
10. **No Direct Mutations** - Never mutate Redux state outside createReducer

## Common Patterns

### Reset Reducer

```typescript
export const resetAppointment = createAction('appointment/reset');

builder.addCase(resetAppointment, () => initialState);
```

### Toggle Boolean

```typescript
builder.addCase(toggleService, (state, action) => {
  state.selectedServices = state.selectedServices.includes(action.payload)
    ? state.selectedServices.filter(id => id !== action.payload)
    : [...state.selectedServices, action.payload];
});
```

### Merge Arrays

```typescript
builder.addCase(mergeServiceRequests, (state, action) => {
  state.serviceRequests = [
    ...state.serviceRequests,
    ...action.payload.filter(sr => !state.serviceRequests.find(existing => existing.id === sr.id)),
  ];
});
```
