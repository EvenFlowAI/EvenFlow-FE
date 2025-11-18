# EvenFlow-FE Copilot Instructions

**Last Updated:** 2024  
**AI Assistant Target:** GitHub Copilot, Claude, and other AI coding assistants  
**Purpose:** Enable AI tools to efficiently understand, contribute to, and maintain the EvenFlow-FE codebase

## Table of Contents

1. [Overview & Purpose](#overview--purpose)
2. [Technology Stack Summary](#technology-stack-summary)
3. [Architecture & Domains](#architecture--domains)
4. [File Categories & Conventions](#file-categories--conventions)
5. [Architectural Rules & Constraints](#architectural-rules--constraints)
6. [Feature Scaffolding Guide](#feature-scaffolding-guide)
7. [Common Development Tasks](#common-development-tasks)
8. [Integration Points](#integration-points)

---

## Overview & Purpose

EvenFlow-FE is a **React 18.2.0 + TypeScript 4.9.5** single-page application (SPA) for managing automotive dealership appointments, capacity, and pricing. The codebase is organized into **13 distinct file categories** across **15 architectural domains** with well-defined patterns for each.

This document serves as a comprehensive guide for AI assistants to:

- Understand the project structure and conventions
- Implement features following established patterns
- Maintain consistency across the codebase
- Generate code that integrates seamlessly with existing architecture

---

## Technology Stack Summary

### Core Technologies

- **React 18.2.0** - UI framework
- **TypeScript 4.9.5** - Type-safe language
- **Redux Toolkit 1.4.0** - State management
- **Material-UI 5.15.4** - Component library
- **React Router v5.2.0** - Routing
- **Axios 0.19.2** - HTTP client
- **TSS-React 4.9.3** - TypeScript-first styling
- **i18next 21.9.1** - Internationalization
- **Dayjs 1.11.10** - Date handling

### Key Libraries by Domain

**UI & Styling:**

- Emotion (@emotion/react, @emotion/styled) - CSS-in-JS
- Notistack 3.0.1 - Notifications

**Data & APIs:**

- Axios 0.19.2 - HTTP requests
- Redux Persist 6.0.0 - State persistence

**Utilities:**

- UUID 8.3.0 - ID generation
- React-Window 1.8.6 - Virtual scrolling
- Draft-JS / Slate - Rich text editing
- React DnD - Drag and drop

**Analytics & Monitoring:**

- Sentry 8.26.0 - Error tracking
- Google Analytics 3.3.0
- AWS RUM - Real user monitoring

### Build & Development

- React Scripts 5.0.1 (Create React App)
- ESLint - Code linting
- Prettier - Code formatting

---

## Architecture & Domains

The EvenFlow-FE codebase is organized into **15 architectural domains**, each with specific patterns, technologies, and constraints:

### 1. **UI Components** (`src/components/`)

**Purpose:** Reusable UI components and form controls  
**Technologies:** React.FC, Material-UI, TSS-React, Emotion  
**Key Pattern:** Functional components with TypeScript props interfaces  
**Example Components:**

- Form controls: `TextInput`, `SelectInput`, `DateInput`, `PhoneInput`
- Buttons: `EditButton`, `SaveButton`, `ToggleButtons`
- Modals: `ConfirmModal`, `BaseModal`
- Tables: `DataTable`
- Layout: `TitleContainer`, `ContentContainer`

**Styling Convention:** All styling hooks use TSS-React's `makeStyles()` with MUI theme integration.

### 2. **Custom Hooks** (`src/hooks/`)

**Purpose:** Encapsulate business logic, state management, and data fetching  
**Categories:**

- Business logic: `useCurrentUser`, `useDealershipProfile`, `useSCs`
- UI state: `useModal`, `useMessage`, `useConfirm`
- Forms: `useValidation`
- Data fetching: `useGetConsultantsData`, `useGetTransportationsData`
- Utilities: `useDebounce`, `useClickOutside`, `useStorage`
- Styling: 18+ styling hooks (all follow TSS-React pattern)

**Key Pattern:** Hooks return data/functions without side effects; state mutations handled by Redux.

### 3. **State Management** (`src/store/`)

**Purpose:** Centralized Redux state management  
**Structure:** 40+ feature-based reducers organized by domain
**Key Pattern:** 3-file structure per feature (types.ts, actions.ts, reducer.ts)

**Reducer Examples:**

- `appointment/` - Appointment data and status
- `pricingSettings/` - Pricing configuration
- `serviceCenters/` - Service center management
- `employees/` - Employee management
- `capacity/` - Capacity planning
- And 35+ more feature reducers

**Key Constraints:**

- Redux Thunk for async operations
- Redux Persist for session continuity
- Immutable updates via Immer (built into Redux Toolkit)
- Type-safe selectors with createSelector()

### 4. **Routing & Navigation** (`src/routes/`)

**Purpose:** Client-side routing with role-based access control  
**Technologies:** React Router v5.2.0  
**Key Components:**

- `PrivateRoute` - Enforces authentication and permissions
- Route constants in `routes/constants.ts`
- Permission matrix in `src/permissions.ts`

**Supported Roles:**

- `EvenFlowAdmin`, `EvenFlowAccountManager`, `EvenFlowSupport`, `EvenFlowAIAgent`
- `DealerOwner`, `ServiceDirector`, `ServiceManager`
- `BDCManager`, `BDCAgent`, `Advisor`, `Staff`, `ServiceAdvisor`

### 5. **Data Layer & API** (`src/api/`)

**Purpose:** Centralized HTTP client and API endpoints  
**Technologies:** Axios 0.19.2 with interceptors  
**Key Features:**

- Automatic token refresh on 401
- SessionId header management (both localStorage and sessionStorage)
- Two auth flows: Admin (localStorage) and self-booking (sessionStorage)

**API Organization:** Endpoints organized in `api.ts` by resource (appointments, serviceCenters, etc.)

### 6. **Authentication & Authorization**

**Pattern:** JWT tokens + role-based permission matrix  
**Token Management:**

- Admin: localStorage tokens
- Self-booking: sessionStorage tokens
- Automatic refresh with interceptors

**Access Control:**

- `PrivateRoute` component wraps protected routes
- Permission matrix defines route-role mappings
- `hasPermission()` utility checks access

### 7. **Forms & Validation** (`src/components/formControls/`)

**Purpose:** Form controls and validation logic  
**Key Controls:**

- `TextInput` - Text field wrapper
- `SelectInput` - Dropdown wrapper
- `DateInput` - Date picker wrapper
- `PhoneInput` - International phone number
- `AutocompleteInput` - Searchable select

**Validation Pattern:** `useValidation()` hook with rule-based validation

### 8. **Modals & Dialogs**

**Pattern:** Redux-controlled visibility state  
**Key Modals:**

- `BaseModal` - Base component
- `ConfirmModal` - Confirmation dialog
- Feature-specific modals (CreateServiceCenterModal, etc.)

### 9. **Notifications & Messages** (`Notistack`)

**Pattern:** `useMessage()` hook for snackbar notifications  
**Types:** success, error, warning, info

### 10. **Date & Time Handling** (`Dayjs`)

**Usage:** `Dayjs` for date parsing and formatting  
**MUI Integration:** `@mui/x-date-pickers` components

### 11. **Drag & Drop**

**Library:** React DnD + @hello-pangea/dnd  
**Usage:** Drag-and-drop interfaces for reordering and moving items

### 12. **Internationalization (i18n)**

**Framework:** i18next + react-i18next  
**Storage:** Translation keys in `src/translations/translations.json`  
**Pattern:** Use translation keys throughout components: `i18n.t('key')`

### 13. **Analytics & Monitoring**

**Google Analytics:** GA + GA4 integration  
**Google Tag Manager:** Custom event tracking  
**Sentry:** Error and exception tracking  
**AWS RUM:** Real user monitoring

### 14. **Error Handling & Boundaries**

**Pattern:** Error boundaries for component errors; Redux for API errors  
**Exception Hook:** `useException()` for error handling

### 15. **Performance & Virtualization**

**React Window:** Virtual scrolling for large lists  
**React Virtualized Auto-Sizer:** Auto-sizing containers  
**Debouncing:** `useDebounce()` hook for input throttling

---

## File Categories & Conventions

The EvenFlow-FE codebase contains **550+ source files** organized into **13 distinct categories**:

### 1. **React Components** (100+ files)

**Location:** `src/components/` and `src/pages/` and `src/features/`  
**Naming:** PascalCase (e.g., `EditButton.tsx`)  
**Pattern:** React.FC<Props> with TypeScript interfaces  
**Key Directories:**

- `components/formControls/` - Input components
- `components/buttons/` - Button variants
- `components/modals/` - Modal components
- `components/tables/` - Table components
- `components/pickers/` - Date/time pickers
- `components/styled/` - Styled wrapper components

**Key Convention:** Each component in its own directory with index.ts export

### 2. **Custom Hooks** (22 files)

**Location:** `src/hooks/`  
**Pattern:** Named with `use` prefix; exports functions and/or data  
**Subcategories:**

- `hooks/styling/` - 18+ TSS-React styling hooks
- Business logic hooks (useCurrentUser, useDealershipProfile, etc.)
- UI state hooks (useModal, useMessage, useConfirm)
- Utility hooks (useDebounce, useClickOutside, useStorage)

### 3. **Styling Hooks** (18 files)

**Location:** `src/hooks/styling/`  
**Pattern:** TSS-React's `makeStyles()` returning `{ classes }`  
**Examples:** `useActionButtonsStyles`, `useCardStyles`, `useDialogStyles`

### 4. **Redux Reducers** (40+ files)

**Location:** `src/store/reducers/{feature}/`  
**Pattern:** 3-file structure: types.ts, actions.ts, reducer.ts  
**Examples:** appointment, pricingSettings, serviceCenters, employees, capacity

### 5. **Redux Actions** (40+ files)

**Location:** `src/store/reducers/{feature}/actions.ts`  
**Pattern:** `createAction()` for simple actions; async thunks for API calls  
**Convention:** Action types use format `'{feature}/{actionName}'`

### 6. **Redux Types** (40+ files)

**Location:** `src/store/reducers/{feature}/types.ts`  
**Pattern:** Enums (E prefix), interfaces (I prefix), state types (T prefix)  
**Exports:** State key constants, interfaces, enums, state type

### 7. **Type Definitions** (10 files)

**Location:** `src/types/`  
**Key Files:**

- `types.ts` - Global types (AppThunk, callbacks, etc.)
- `auth.ts` - Authentication types
- `screens.ts` - Screen/page enums
- `states.ts` - State enumerations

### 8. **API Layer** (5+ files)

**Location:** `src/api/`  
**Files:**

- `api.ts` - Main API object with all endpoints
- `request.ts` - Axios instance with interceptors
- `types.ts` - Request/response types
- `helper.ts` - API utilities
- `AuthService/` - Authentication service

**Pattern:** Endpoints organized as nested objects (appointment, serviceCenters, etc.)

### 9. **Routing** (14 files)

**Location:** `src/routes/`  
**Files:**

- `constants.ts` - Route path constants
- `types.ts` - Route type definitions
- `PrivateRoute/` - Protected route component
- Route modules for each feature (AdminRoutes, BookingFlowRoutes, etc.)

### 10. **Styling Utilities** (15+ files)

**Location:** `src/theme/`  
**Files:**

- `colors.ts` - MUI color palette
- `fonts.ts` - Typography configuration
- `theme.ts` - Complete MUI theme

### 11. **Utility Functions** (20+ files)

**Location:** `src/utils/`  
**Examples:**

- `constants.ts` - Global constants
- `getDate.ts` - Date utilities
- `autocompleteRenders.tsx` - Autocomplete renderers
- `collectServiceRequestIds.ts` - Collection utilities

### 12. **Feature Modules** (20+ directories)

**Location:** `src/features/admin/` and `src/features/booking/`  
**Pattern:** Feature-specific components organized by concern  
**Examples:** ServiceCenters, Pricing, Reporting, Reporting, etc.

### 13. **Pages** (15+ files)

**Location:** `src/pages/`  
**Pattern:** Route-level components representing complete screens  
**Examples:** AdminPanel, Login, Profile, AppointmentFlow, BookingFlow

---

## Architectural Rules & Constraints

### Global Constraints

1. **Type Safety:** All code must use TypeScript strict mode
2. **No PropTypes:** Use TypeScript interfaces only
3. **Functional Components:** Only React.FC components; no class components
4. **Redux for State:** All global state goes through Redux; no Context API for state management
5. **Pure Functions:** Utility functions must be pure (no side effects)
6. **Error Handling:** All async operations must handle errors with try-catch
7. **TypeScript Imports:** Use `import type` for type-only imports

### Redux Rules

1. **Thunks for Async:** All async operations go through Redux Thunk actions
2. **Immutability:** Use Redux Toolkit's createReducer (Immer handles immutability)
3. **Selector Patterns:** Use memoized selectors with createSelector() for expensive computations
4. **Action Naming:** Actions follow `'{feature}/{actionName}'` format
5. **Error State:** All reducers include loading and error states

### Component Rules

1. **Props Typing:** All component props must be explicitly typed
2. **React.FC Pattern:** All components use `React.FC<Props>` signature
3. **No Inline Styles:** Use TSS-React makeStyles() or MUI sx prop; never inline style objects
4. **Prop Drilling:** Use custom hooks to avoid excessive prop drilling
5. **Accessibility:** All interactive components must be keyboard accessible

### API Layer Rules

1. **Centralized Endpoints:** All API calls go through `API` object in `src/api/api.ts`
2. **Type Every Response:** Request/response types defined in `src/api/types.ts`
3. **Error Handling:** All API errors caught and formatted with meaningful messages
4. **Interceptors:** Authentication and SessionId headers added via request interceptor
5. **No Direct Axios:** Never call axios directly; always use API object

### Styling Rules

1. **TSS-React Preferred:** Use TSS-React's makeStyles() over Emotion styled components
2. **Theme Values:** Use theme colors, spacing, shadows; never hardcode values
3. **Responsive First:** Use theme.breakpoints for mobile-first responsive design
4. **MUI sx Prop:** Secondary option for one-off inline styles
5. **No CSS Modules:** All CSS-in-JS; CSS files only for global styles

### Routing Rules

1. **PrivateRoute Required:** All admin routes must use PrivateRoute wrapper
2. **Permission Check:** Route access validated in PrivateRoute against permission matrix
3. **Route Constants:** All routes defined in routes/constants.ts; never hardcoded
4. **useParams Hook:** Access route parameters via useParams hook
5. **Query Parameters:** Use useQueryParams custom hook; never manipulate window.location

### Data Fetching Rules

1. **Redux Thunks Only:** Data fetching only in Redux Thunk actions
2. **Loading States:** Always track loading and error states during fetch
3. **Cleanup:** Always cleanup subscriptions in useEffect cleanup functions
4. **isMounted Flag:** Use isMounted flag to prevent memory leaks
5. **Error Messages:** Always provide meaningful error messages to UI

---

## Feature Scaffolding Guide

### Adding a New Page/Feature

**Step 1: Create Route Constant**

```typescript
// src/routes/constants.ts
export const Routes = {
  // ... existing routes
  MyNewFeature: '/admin/my-new-feature',
};
```

**Step 2: Create Redux Slice**

```typescript
// src/store/reducers/myNewFeature/types.ts
export const MY_NEW_FEATURE_STATE_KEY = 'myNewFeature' as const;
export interface IMyNewFeatureState {
  data: IMyItem[];
  loading: boolean;
  error: string | null;
}
export type TMyNewFeatureState = IMyNewFeatureState;

// src/store/reducers/myNewFeature/actions.ts
export const fetchMyItems = (): AppThunk => async dispatch => {
  try {
    dispatch(setLoading(true));
    const response = await API.myFeature.list();
    dispatch(setItems(response.data));
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : 'Error'));
  } finally {
    dispatch(setLoading(false));
  }
};

// src/store/reducers/myNewFeature/reducer.ts
export const myNewFeatureReducer = createReducer(initialState, builder => {
  builder.addCase(fetchMyItems.fulfilled, (state, action) => {
    state.data = action.payload;
  });
});
```

**Step 3: Create API Endpoint**

```typescript
// src/api/api.ts
const myFeature = {
  list: (): TApiResponse<IMyItem[]> => request.get('/my-feature'),
  create: (data: ICreateMyItem): TApiResponse<IMyItem> => request.post('/my-feature', data),
  update: (id: number, data: Partial<IMyItem>): TApiResponse<IMyItem> =>
    request.put(`/my-feature/${id}`, data),
};

export const API = {
  // ... existing
  myFeature,
};
```

**Step 4: Create Page Component**

```typescript
// src/pages/admin/MyNewFeature/MyNewFeaturePage.tsx
export const MyNewFeaturePage: React.FC = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector(state => state.myNewFeature);

  useEffect(() => {
    dispatch(fetchMyItems());
  }, [dispatch]);

  return (
    <Container>
      {/* Page content */}
    </Container>
  );
};
```

**Step 5: Create Route**

```typescript
// src/routes/AppRoutes/AppRoutes.tsx
<PrivateRoute
  path={Routes.MyNewFeature}
  component={MyNewFeaturePage}
  requiredRoles={['EvenFlowAdmin']}
/>
```

### Adding a New Component

**File Structure:**

```
src/components/myComponent/
├── MyComponent.tsx
├── useMyComponentStyles.ts
├── types.ts (if complex)
└── index.ts
```

**Implementation:**

```typescript
// src/components/myComponent/types.ts
export interface IMyComponentProps {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
}

// src/components/myComponent/useMyComponentStyles.ts
export const useMyComponentStyles = makeStyles()((theme) => ({
  root: { /* styles */ },
}));

// src/components/myComponent/MyComponent.tsx
import React from 'react';
import { useMyComponentStyles } from './useMyComponentStyles';
import { IMyComponentProps } from './types';

export const MyComponent: React.FC<IMyComponentProps> = ({
  label,
  value,
  onChange,
}) => {
  const { classes } = useMyComponentStyles();
  return (
    <div className={classes.root}>
      {/* Component implementation */}
    </div>
  );
};

// src/components/myComponent/index.ts
export { MyComponent } from './MyComponent';
export type { IMyComponentProps } from './types';
```

### Adding a Custom Hook

**Pattern:**

```typescript
// src/hooks/useMyHook/useMyHook.ts
import { useState, useEffect, useCallback } from 'react';

export const useMyHook = (dependency: string) => {
  const [state, setState] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch logic
      setState('data');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  }, [dependency]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { state, loading, error, refetch: fetch };
};

// src/hooks/useMyHook/index.ts
export { useMyHook } from './useMyHook';
```

---

## Common Development Tasks

### Task: Implement New Feature End-to-End

1. Create Redux slice (types, actions, reducer)
2. Add API endpoints
3. Create page component
4. Add route with permissions
5. Create sub-components as needed
6. Add hooks for business logic
7. Test Redux flow, API integration, UI rendering

**Example Prompt for AI:**

> "Create a new service-categories management feature with: a table showing all categories, an edit modal, and a delete confirmation. The data comes from the API, and the UI uses Redux for state management. Include form validation and error handling."

### Task: Create a Form Component

1. Define form types and validation rules
2. Create form control components
3. Implement validation hook
4. Create form submission handler
5. Integrate with Redux or parent component

**Example Prompt for AI:**

> "Create a form component for creating a new service request with fields: title, description, category (select), price (number), priority (select). Include validation for required fields and show errors. On submit, dispatch a Redux action."

### Task: Add New API Endpoint

1. Define request/response types
2. Add endpoint to API object
3. Create Redux Thunk action
4. Add to reducer
5. Use in component via Redux

**Example Prompt for AI:**

> "Add a new API endpoint for fetching service center analytics with date range filters. Include types for the request and response, create a Redux Thunk action, and add to the serviceCenters reducer."

### Task: Fix a Bug in State Management

1. Identify which reducer is affected
2. Check the action creator
3. Review the reducer logic
4. Trace through Redux flow
5. Add debug logging if needed

**Example Prompt for AI:**

> "Debug: When I click edit on a service center, the form is showing stale data from the previous item. The issue is likely in the Redux state or selector. Help me trace the data flow and fix it."

---

## Integration Points

### Key Integration Patterns

**Component → Redux → API:**

```
User Action (onClick)
  → Dispatch Redux Thunk
  → API Call
  → Dispatch Success/Error
  → Reducer Updates State
  → Component Re-renders
```

**API Error Handling:**

```
Axios Request
  → Interceptor (add SessionId/auth)
  → Success: dispatch(setData(response))
  → Error: dispatch(setError(message))
  → 401: Refresh token → Retry request
```

**Component State Flow:**

```
useSelector gets Redux state
  → useEffect triggers on change
  → Dispatch action to fetch data
  → Action calls API
  → Reducer updates state
  → Component re-renders
```

### Common Integration Scenarios

**Scenario 1: Display List with Edit/Delete**

1. Create Redux slice with list state
2. Create page component with table
3. Create modal for editing
4. Dispatch actions on user interaction
5. API calls wrapped in Redux Thunks

**Scenario 2: Multi-Step Form Flow**

1. Store form data in Redux state
2. Each step validates and advances
3. On final submit, dispatch API action
4. Show loading and error states
5. Redirect on success

**Scenario 3: Real-Time Data Updates**

1. Initial data fetch on component mount
2. Set up polling or WebSocket (future)
3. Dispatch thunk periodically
4. Merge new data with existing state
5. Show refresh indicator

---

## Quick Reference: File Organization

```
src/
├── api/                       # API client and endpoints
│   ├── api.ts                # Main API object
│   ├── request.ts            # Axios instance with interceptors
│   ├── types.ts              # Request/response types
│   ├── helper.ts             # API utilities
│   └── AuthService/          # Authentication service
├── components/               # Reusable UI components
│   ├── buttons/              # Button variants
│   ├── formControls/         # Form input components
│   ├── modals/               # Modal dialogs
│   ├── tables/               # Table components
│   └── styled/               # Styled wrapper components
├── config/                   # Application configuration
├── features/                 # Feature-specific components
│   ├── admin/                # Admin features
│   └── booking/              # Booking features
├── hooks/                    # Custom React hooks
│   ├── styling/              # TSS-React styling hooks
│   └── use*.ts               # Business logic hooks
├── pages/                    # Page/route components
│   ├── admin/                # Admin pages
│   └── booking/              # Booking pages
├── routes/                   # Routing configuration
│   ├── constants.ts          # Route paths
│   ├── PrivateRoute/         # Protected route component
│   └── *Routes/              # Feature-specific routes
├── store/                    # Redux state management
│   ├── rootReducer.ts        # Combined reducers
│   ├── store.ts              # Store configuration
│   └── reducers/             # Feature reducers (40+)
│       ├── {feature}/
│       │   ├── types.ts      # Types and interfaces
│       │   ├── actions.ts    # Action creators and thunks
│       │   └── reducer.ts    # Reducer logic
├── theme/                    # MUI theme configuration
│   ├── colors.ts             # Color palette
│   ├── fonts.ts              # Typography
│   └── theme.ts              # Complete theme
├── translations/             # i18n translations
├── types/                    # Global TypeScript types
├── utils/                    # Utility functions
├── App.tsx                   # Root component
├── index.tsx                 # React root
├── i18n.js                   # i18next configuration
└── permissions.ts            # Role-based permissions
```

---

## Example Prompt Usage

### Example 1: Adding a New Admin Page

**Prompt:**

> "I need to add a new admin page for managing 'Demand Segments'. Create:
>
> 1. Route constant in routes/constants.ts
> 2. Redux slice in store/reducers/demandSegments/ with types, actions, reducer
> 3. API endpoints in src/api/api.ts for list, create, update, delete
> 4. Page component in pages/admin/DemandSegmentsPage.tsx with a table
> 5. Add route to AppRoutes with permission check for EvenFlowAdmin role
>
> Include loading states, error handling, and follow all EvenFlow-FE conventions."

**Expected Output:**

- Complete Redux slice following 3-file pattern
- TypeScript-typed API endpoints
- React.FC page component with Redux integration
- Proper error handling and loading states
- Route integration with PrivateRoute wrapper

### Example 2: Creating a Form Component

**Prompt:**

> "Create a form component 'ServiceRequestForm' for creating a new service request:
>
> - Fields: title (required), description (optional), category (select from list), price (number, required), isUrgent (checkbox)
> - Validation: title min 3 chars, price > 0
> - Use TSS-React for styling
> - Props: onSubmit callback, initialData (optional), isLoading
> - Follow EvenFlow-FE component conventions with React.FC and TypeScript"

**Expected Output:**

- React.FC component with properly typed props
- TSS-React styling hook
- Form validation using useValidation hook
- Proper error messages and field states

### Example 3: Debugging Redux Flow

**Prompt:**

> "Debug: When I create a new appointment, the Redux state shows the appointment was created successfully, but the UI doesn't update with the new item. Walk me through:
>
> 1. Check selector is getting latest state
> 2. Verify action is dispatched correctly
> 3. Check reducer logic for adding to array
> 4. Verify re-render is triggered"

**Expected Output:**

- Identification of specific issue in flow
- Step-by-step debugging guidance
- Specific file and code locations to check

### Example 4: Adding API Integration

**Prompt:**

> "Add API endpoints and Redux integration for fetching available appointment slots:
>
> - Endpoint: GET /appointments/slots with query params: serviceCenterId, date
> - Response: array of IAppointmentSlot objects
> - Create Redux Thunk action that fetches and stores in appointment state
> - Include loading and error states"

**Expected Output:**

- Typed API endpoint in src/api/api.ts
- Redux Thunk action in appropriate reducer
- Integration with existing appointment state

---

## Best Practices for AI Contributions

1. **Read existing patterns first** - Study similar implementations before creating new code
2. **Type everything** - Never generate code without TypeScript types
3. **Follow naming conventions** - Use consistent naming patterns across the codebase
4. **Handle errors gracefully** - Always include try-catch and error states
5. **Test integration points** - Verify Redux flow, API calls, and component rendering
6. **Document complex logic** - Add JSDoc comments for non-obvious implementations
7. **Reuse existing utilities** - Check utils/ before writing new utilities
8. **Consistent imports** - Follow the import organization pattern (React, MUI, local, Redux)
9. **Accessibility first** - Ensure interactive components are keyboard accessible
10. **Performance conscious** - Avoid unnecessary re-renders, use React.memo sparingly with comments

---

## Reference Documentation

For detailed information on specific topics, see:

- **Tech Stack Details** → `docs/1-determine-techstack.md`
- **File Categorization** → `docs/2-file-categorization.json`
- **Architecture Domains** → `docs/3-architectural-domains.json`
- **Domain Deep Dives** → `docs/4-domains/{domain}.md`
- **Style Guides by Category** → `docs/5-style-guides/{category}.md`

---

**Last Generated:** Auto-generated from Bitovi AI Enablement Prompt Chain  
**Maintenance:** Update whenever adding new domains, technologies, or major architectural changes  
**Questions?** Refer to specific style guide files for detailed conventions on each file category.
