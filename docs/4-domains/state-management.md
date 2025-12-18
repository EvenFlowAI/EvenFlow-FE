# State Management Domain Deep Dive

## Overview

Redux Toolkit-based global state management with Redux Thunk for async operations and Redux Persist for persistence across sessions.

## Architecture

### Store Setup (`src/store/store.ts`)

```typescript
import { configureStore } from '@reduxjs/toolkit';
import ThunkMiddleware from 'redux-thunk';
import { rootReducer } from './rootReducer';

const env = process.env.REACT_APP_ENV;

export const store = configureStore({
  reducer: rootReducer,
  devTools: env !== 'production',
  middleware: [ThunkMiddleware],
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
```

Key points:

- Redux DevTools enabled in development
- Redux Thunk middleware for async actions
- TypeScript AppDispatch for type-safe dispatch

### Root Reducer Structure (`src/store/rootReducer.ts`)

```typescript
export const rootReducer = combineReducers({
  // Appointment data
  appointment: appointmentReducer,
  appointmentFrame: appointmentFrameReducer,
  appointments: appointmentsReducer,

  // Resource management
  serviceCenters: serviceCenterReducer,
  employees: employeesReducer,
  pods: podsReducer,

  // Configuration
  bookingFlowConfig: bookingFlowConfigReducer,
  pricingSettings: pricingSettingsReducer,
  screenSettings: screenSettingsReducer,

  // Features
  categories: categoriesReducer,
  offers: offersReducer,
  packages: packagesReducer,

  // UI
  modals: modalsReducer,
  notifications: notificationsReducer,

  // ... 30+ more reducers
});
```

## Reducer Pattern

Each reducer follows a 3-file pattern:

### 1. `types.ts` - Type Definitions

```typescript
// store/reducers/appointment/types.ts
export interface IAppointment {
  id: number;
  customerId: number;
  serviceCenterId: number;
  appointmentTime: string;
  status: AppointmentStatus;
}

export enum AppointmentStatus {
  Scheduled = 'Scheduled',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

export interface TState {
  appointments: IAppointment[];
  isLoading: boolean;
  error: string | null;
}
```

### 2. `actions.ts` - Action Creators & Thunks

```typescript
// store/reducers/appointment/actions.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '../../../api/api';

// Async thunk for API calls
export const loadAppointments = createAsyncThunk(
  'appointment/loadAppointments',
  async (query: IListAppointmentRequest) => {
    const response = await API.appointment.list(query);
    return response.data;
  }
);

// Synchronous action
export const setAppointment = createAction<IAppointment>('appointment/set');
export const clearAppointment = createAction('appointment/clear');
```

### 3. `reducer.ts` - Reducer Logic

```typescript
// store/reducers/appointment/reducer.ts
import { createSlice } from '@reduxjs/toolkit';
import { loadAppointments } from './actions';

const initialState: TState = {
  appointments: [],
  isLoading: false,
  error: null,
};

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    setAppointment: (state, action) => {
      state.appointments.push(action.payload);
    },
    clearAppointment: state => {
      state.appointments = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAppointments.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadAppointments.fulfilled, (state, action) => {
        state.appointments = action.payload;
        state.isLoading = false;
      })
      .addCase(loadAppointments.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to load';
        state.isLoading = false;
      });
  },
});

export const appointmentReducer = appointmentSlice.reducer;
export const { setAppointment, clearAppointment } = appointmentSlice.actions;
```

## Usage in Components

### With Hooks

```typescript
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/rootReducer';
import { loadAppointments } from '../store/reducers/appointment/actions';

function AppointmentList() {
  const dispatch = useDispatch();
  const { appointments, isLoading } = useSelector(
    (state: RootState) => state.appointment
  );

  useEffect(() => {
    dispatch(loadAppointments({ pageIndex: 0, pageSize: 10 }));
  }, [dispatch]);

  if (isLoading) return <div>Loading...</div>;
  return appointments.map(apt => <div key={apt.id}>{apt.customerId}</div>);
}
```

### With Custom Hooks

```typescript
// Custom hook encapsulates Redux logic
export const useCurrentUser = (): ICurrentUser | undefined => {
  return useSelector((state: RootState) => state.users.currentUser);
};

// Usage
const currentUser = useCurrentUser();
```

## Redux Persist Integration

Redux Persist automatically saves store state to localStorage:

```typescript
// Configured in root reducer or store setup
import { persistStore } from 'redux-persist';
const persistor = persistStore(store);
```

Uses:

- **Auth state** - Persisted for session continuity
- **User preferences** - Screen settings, layout preferences
- **Last selections** - Service center, pod, filters

## Async Thunk Patterns

### Pattern 1: Simple Data Fetch

```typescript
export const loadServiceCenters = createAsyncThunk('serviceCenters/load', async () => {
  const response = await API.serviceCenters.list();
  return response.data;
});
```

### Pattern 2: With Parameters

```typescript
export const loadServiceRequests = createAsyncThunk(
  'serviceRequests/load',
  async (filters: TServiceRequestsFilters) => {
    const response = await API.serviceRequests.list(filters);
    return response.data;
  }
);
```

### Pattern 3: Error Handling in Thunk

```typescript
export const updatePricingSettings = createAsyncThunk(
  'pricingSettings/update',
  async (data: TPricingUpdate, { rejectWithValue }) => {
    try {
      const response = await API.pricingSettings.update(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);
```

## State Selectors

### Direct Selectors

```typescript
const appointments = useSelector((state: RootState) => state.appointments);
const { selectedSC } = useSelector((state: RootState) => state.appointment);
```

### Memoized Selectors (pricingSettings example)

```typescript
// store/reducers/pricingSettings/selectors.ts
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../rootReducer';

export const selectPricingSettings = (state: RootState) => state.pricingSettings;

export const selectActivePricingLevels = createSelector([selectPricingSettings], pricingSettings =>
  pricingSettings.levels.filter(l => l.active)
);
```

## Feature-Based Reducers (40+ in project)

Major feature reducers:

1. **Appointment Management**
   - `appointment` - Single appointment booking state
   - `appointmentFrame` - Current booking flow state
   - `appointments` - List of appointments
   - `appointmentFrameReducer` - Frame selection and state

2. **Resource Management**
   - `serviceCenters` - Dealership locations
   - `employees` - Staff members
   - `pods` - Service areas
   - `schedules` - Employee schedules
   - `holidays` - Holiday dates

3. **Business Logic**
   - `categories` - Service categories
   - `serviceRequests` - Customer service requests
   - `offers` - Service offers
   - `packages` - Service packages
   - `pricingSettings` - Pricing configuration
   - `slotScoring` - Appointment slot scoring

4. **UI State**
   - `modals` - Modal open/close state
   - `notifications` - Message queue
   - `screenSettings` - Page-level settings
   - `adminPanel` - Admin UI tabs

5. **Configuration**
   - `bookingFlowConfig` - Booking flow settings
   - `generalSettings` - System settings
   - `categories` - Service categories
   - `screenSettings` - Screen-specific configs

## Dispatch Patterns

### Immediate Actions

```typescript
dispatch(setAppointment(appointmentData));
dispatch(setCategoriesPage(pageIndex));
dispatch(setValueService(null));
```

### Async Thunk Dispatch

```typescript
await dispatch(loadServiceCenters());
await dispatch(updatePricingSettings(formData));
```

### Side Effects in Thunks

```typescript
export const loadAppointmentAndNotify = createAsyncThunk(
  'appointment/loadAndNotify',
  async (id: number, { dispatch }) => {
    const apt = await API.appointment.get(id);
    dispatch(setAppointment(apt));
    dispatch(showNotification({ type: 'success', message: 'Loaded!' }));
    return apt;
  }
);
```

## Performance Optimizations

1. **Selector Memoization** - Prevent unnecessary re-renders
2. **Normalized State** - Flat structure for easy updates
3. **Lazy Loading** - Load features on demand
4. **Reselect** - Create memoized selectors

## Key Points

- ✅ All state changes go through Redux
- ✅ Redux Thunk for async operations
- ✅ Redux Persist for session continuity
- ✅ TypeScript enforcement throughout
- ✅ DevTools in development
- ✅ 40+ feature-based reducers
- ✅ Immutable updates via Immer (Redux Toolkit default)
