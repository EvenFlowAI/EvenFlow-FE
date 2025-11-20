# Data Layer Domain Deep Dive

## Overview

Centralized HTTP API client using Axios with interceptors for authentication, error handling, and session management. All API calls abstracted through `src/api/api.ts`.

## Architecture

### Axios Instance Setup (`src/api/request.ts`)

```typescript
import axios from 'axios';
import { APIUrl } from '../config/config';

export const request = axios.create({
  baseURL: APIUrl,
  headers: {
    Authorization: authService.getLocalToken()
      ? `Bearer ${authService.getLocalToken()}`
      : undefined,
  },
});
```

### Configuration

- **Base URL**: Set from `APIUrl` constant in `config/config.ts`
- **Environment-based URLs**:
  - Production: `https://api.evenflow.ai`
  - QA: `https://be.qa.evenflow.ai`
  - Dev: `https://be.dev.evenflow.ai`
  - Local: `http://localhost:5000`

## Request Interceptors

### Token Management

```typescript
request.interceptors.request.use(request => {
  // Add SessionId for self-booking flows
  const sessionId = sessionStorage.getItem(LocalTokens.sessionId);
  if (sessionId?.length) {
    request.headers['SessionId'] = sessionId;
  }

  const url = request.url ?? '';
  const isSkippable = skipCallIfNoToken.includes(url);

  // Check authentication for different flows
  const isAdmin = getAuthenticationTokenForAdmin() != null;
  const isSelfCustomer = getAuthenticationTokenForSelfCustomer() != null;

  // Self-booking flow (no auth required on first entry)
  if (isSkippable && !isAdmin && !isSelfCustomer) {
    setSelfCustomerToken();
    return Promise.reject(new Error('Token not set yet'));
  }

  return request;
});
```

### Response Interceptors

```typescript
request.interceptors.response.use(
  resp => resp,
  async error => {
    // Handle 401 Unauthorized - attempt token refresh
    if (error?.response?.status === 401 && authService.getRefreshToken()) {
      const rq = error.config;
      try {
        await authService.refresh();
        rq.headers['Authorization'] = `Bearer ${authService.getLocalToken()}`;
        return request(rq); // Retry original request
      } catch (e) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
```

## API Client Organization (`src/api/api.ts`)

Methods organized by domain:

```typescript
const accounts = {
  passwordRecovery: (data: IPasswordRecoveryData): TApiResponse<IPasswordRecoveryResp> =>
    request.post('/accounts/password-recovery', data),
  setNewPassword: (data: ISetNewPasswordData): TApiResponse =>
    request.patch('/accounts/password-reset', data),
};

const appointment = {
  list: (data: IListAppointmentRequest): TApiResponse<PaginatedAPIResponse<IAppointment>> =>
    request.post('/appointments/by-query', data),
  cancelByKey: (key: string): TApiResponse => request.put(`/appointments/${key}/cancel/by-key`),
  getByKey: (key: string): TApiResponse<IAppointmentByKey> =>
    request.get(`/appointments/${key}/by-key`),
};

const configs = {
  get: (): TApiResponse<IConfig> => request.get('/configs'),
};

const serviceCenters = {
  list: (): TApiResponse<IServiceCenter[]> => request.get('/service-centers'),
};

export const API = {
  accounts,
  appointment,
  authentication,
  configs,
  serviceCenters,
  // ... 20+ more domains
};
```

## Type System

### Response Types (`src/api/types.ts`)

```typescript
export type TApiResponse<R = any> = Promise<AxiosResponse<R>>;

export interface IAppointment {
  id: number;
  customerId: number;
  serviceCenterId: number;
  appointmentTime: string;
  status: string;
}

export interface PaginatedAPIResponse<T> {
  data: T[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}

export enum EServiceCategoryPage {
  Page1,
  Page2,
}

export enum EMaintenanceOptionType {
  Base,
  Value,
  Preferred,
}
```

### Request Types

```typescript
export interface IListAppointmentRequest {
  pageIndex: number;
  pageSize: number;
  filter?: string;
  sort?: string;
}

export interface IPasswordRecoveryData {
  email: string;
  dealershipId: number;
}
```

## Authentication Token Management

### Token Storage (`src/api/helper.ts`)

```typescript
export const getAuthenticationTokenForAdmin = (): string | null => {
  return localStorage.getItem(LocalTokens.accessToken);
};

export const getAuthenticationTokenForSelfCustomer = (): string | null => {
  return sessionStorage.getItem(LocalTokens.accessToken);
};

export const setAuthenticationTokenForAdmin = (token: string): void => {
  localStorage.setItem(LocalTokens.accessToken, token);
};

export const setAuthenticationTokenForSelfCustomer = (token: string): void => {
  sessionStorage.setItem(LocalTokens.accessToken, token);
};
```

Two authentication flows:

1. **Admin**: Tokens in localStorage (persistent across sessions)
2. **Self-Booking**: Tokens in sessionStorage (cleared on tab close)

### Auth Service (`src/api/AuthService/AuthService.ts`)

```typescript
export const authService = {
  getLocalToken: (): string | null => {
    return getAuthenticationTokenForAdmin() || getAuthenticationTokenForSelfCustomer();
  },

  getRefreshToken: (): string | null => {
    return (
      localStorage.getItem(LocalTokens.refreshToken) ||
      sessionStorage.getItem(LocalTokens.refreshToken)
    );
  },

  refresh: async (): Promise<void> => {
    const refreshToken = authService.getRefreshToken();
    const response = await request.post('/authentications/refresh', {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    // Update stored tokens
    const isAdmin = getAuthenticationTokenForAdmin() != null;
    if (isAdmin) {
      setAuthenticationTokenForAdmin(accessToken);
      setRefreshTokenForAdmin(newRefreshToken);
    } else {
      setAuthenticationTokenForSelfCustomer(accessToken);
      setRefreshTokenForSelfCustomer(newRefreshToken);
    }
  },

  logout: (): void => {
    localStorage.removeItem(LocalTokens.accessToken);
    localStorage.removeItem(LocalTokens.refreshToken);
    sessionStorage.removeItem(LocalTokens.accessToken);
    sessionStorage.removeItem(LocalTokens.refreshToken);
  },
};
```

## API Usage in Redux Actions

Pattern for integrating API calls with Redux:

```typescript
export const loadAppointments = createAsyncThunk(
  'appointment/loadAppointments',
  async (query: IListAppointmentRequest, { rejectWithValue }) => {
    try {
      const response = await API.appointment.list(query);
      return response.data;
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to load appointments';
      return rejectWithValue(message);
    }
  }
);

// In reducer
.addCase(loadAppointments.fulfilled, (state, action) => {
  state.appointments = action.payload;
  state.isLoading = false;
})
.addCase(loadAppointments.rejected, (state, action) => {
  state.error = action.payload as string;
  state.isLoading = false;
});
```

## API Endpoints Structure

### Endpoint Groups

```
/accounts/*               - Password recovery, profile
/appointments/*          - CRUD operations for appointments
/authentications/*       - Login, token refresh
/service-centers/*       - Dealership locations
/employees/*             - Staff management
/service-requests/*      - Customer requests
/schedules/*             - Employee schedules
/pricing-settings/*      - Pricing configuration
/slots/*                 - Appointment slots
/offers/*                - Service offers
/packages/*              - Service packages
/vehicle-details/*       - Vehicle information
/recalls/*               - Recall management
/categories/*            - Service categories
```

### Endpoint Patterns

```typescript
// List
GET /entities

// Get by ID
GET /entities/:id

// Get by Key (external reference)
GET /entities/:key/by-key

// Create
POST /entities
// Body: { ...data }

// Update
PATCH /entities/:id
// Body: { ...changes }

// Delete
DELETE /entities/:id

// Action on entity
PUT /entities/:id/action-name
```

## Error Handling

### API Error Response

```typescript
interface IApiError {
  message: string;
  errorCode?: string;
  details?: Record<string, any>;
}
```

### Error Handling Pattern

```typescript
try {
  const response = await API.appointment.list(query);
  // Success handling
} catch (error: AxiosError<IApiError>) {
  const errorMessage = error.response?.data?.message || 'Unknown error';
  const statusCode = error.response?.status;

  if (statusCode === 401) {
    // Unauthorized - handled by interceptor
  } else if (statusCode === 403) {
    // Forbidden
    dispatch(showNotification({ type: 'error', message: 'Access denied' }));
  } else if (statusCode === 400) {
    // Bad request - show validation errors
    Object.entries(error.response?.data?.details).forEach(([field, msg]) => {
      dispatch(setFieldError(field, msg));
    });
  }
}
```

## Pagination Pattern

Common pagination structure:

```typescript
export interface PaginatedAPIResponse<T> {
  data: T[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}

// Usage
const response = await API.appointment.list({
  pageIndex: 0,
  pageSize: 10,
});

const { data, totalCount, pageSize } = response.data;
const totalPages = Math.ceil(totalCount / pageSize);
```

## Session Management

### Session ID for Self-Booking

```typescript
// Set session ID on first booking visit
const sessionId = generateSessionId();
sessionStorage.setItem(LocalTokens.sessionId, sessionId);

// Automatically added to all requests in interceptor
request.headers['SessionId'] = sessionId;
```

## API Key Configuration

From `config/tokens.ts`:

```typescript
export const ClientId = process.env.REACT_APP_CLIENT_ID || 'default-client-id';
```

Used in:

```typescript
const tokens = await Api.call(Api.endpoints.Authentications.Anonymous, {
  data: { ClientId },
});
```

## Best Practices

1. ✅ Always use `API.*` for HTTP calls, never raw axios
2. ✅ Type all API request/response data
3. ✅ Handle errors in Redux thunks with proper user feedback
4. ✅ Use interceptors for authentication/error handling
5. ✅ Store tokens securely (localStorage for admin, sessionStorage for booking)
6. ✅ Implement retry logic for token refresh on 401
7. ✅ Keep endpoint definitions centralized
8. ✅ Use proper HTTP methods (GET, POST, PATCH, DELETE)
9. ✅ Include pagination info for list endpoints
10. ✅ Validate request data before sending
