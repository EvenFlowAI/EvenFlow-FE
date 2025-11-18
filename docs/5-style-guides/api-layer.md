# API Layer Style Guide

## Overview

The EvenFlow-FE project uses **Axios 0.19.2** for HTTP requests with a centralized API client architecture. The API layer is organized in `src/api/` with separation of concerns across request handling, response interceptors, and endpoint organization. This guide documents the unique conventions and patterns.

## API Directory Structure

```
src/api/
├── api.ts              # Main API client - exports all endpoints
├── request.ts          # Axios instance with interceptors
├── helper.ts           # Helper functions and utilities
├── types.ts            # API-specific types and interfaces
└── ApiEndpoints/
    ├── ApiEndpoints.ts # Main export combining all endpoints
    ├── accounts/       # Account operations
    ├── appointment/    # Appointment endpoints
    ├── serviceCenters/ # Service center endpoints
    └── ... (15+ endpoint modules)
```

## Request Setup

### Axios Instance

```typescript
// src/api/request.ts
import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { authService } from './AuthService/AuthService';

const request: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://api.example.com',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export { request };
```

## Request Interceptor

### Session ID and Token Management

```typescript
request.interceptors.request.use(
  config => {
    const sessionId = getSessionId(); // From localStorage or sessionStorage

    if (sessionId) {
      config.headers['SessionId'] = sessionId;
    }

    // For admin users (localStorage)
    const adminToken = localStorage.getItem('token');
    if (adminToken) {
      config.headers['Authorization'] = `Bearer ${adminToken}`;
    }

    // For self-booking users (sessionStorage)
    const bookingToken = sessionStorage.getItem('bookingToken');
    if (bookingToken) {
      config.headers['X-Booking-Token'] = bookingToken;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
```

## Response Interceptor

### Token Refresh on 401

```typescript
request.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle 401 Unauthorized with token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await authService.refresh();
        localStorage.setItem('token', newToken);

        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return request(originalRequest);
      } catch (refreshError) {
        // Refresh failed - redirect to login
        authService.logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

## API Endpoint Organization

### Main API Object

```typescript
// src/api/api.ts
import { TApiResponse, PaginatedAPIResponse } from './types';
import { request } from './request';

const accounts = {
  passwordRecovery: (data: IPasswordRecoveryData): TApiResponse<IPasswordRecoveryResp> =>
    request.post('/accounts/password-recovery', data),
  setNewPassword: (data: ISetNewPasswordData): TApiResponse =>
    request.patch('/accounts/password-reset', data),
};

const appointment = {
  list: (data: IListAppointmentRequest): TApiResponse<PaginatedAPIResponse<IAppointment>> =>
    request.post('/appointments/by-query', data),
  cancel: (id: number): TApiResponse => request.put(`/appointments/${id}/cancel`),
  getByKey: (key: string): TApiResponse<IAppointmentByKey> =>
    request.get(`/appointments/${key}/by-key`),
};

const serviceCenters = {
  list: (): TApiResponse<IServiceCenter[]> => request.get('/service-centers'),
  getById: (id: number): TApiResponse<IServiceCenter> => request.get(`/service-centers/${id}`),
  create: (data: ICreateServiceCenterRequest): TApiResponse<IServiceCenter> =>
    request.post('/service-centers', data),
  update: (id: number, data: IUpdateServiceCenterRequest): TApiResponse<IServiceCenter> =>
    request.put(`/service-centers/${id}`, data),
};

export const API = {
  accounts,
  appointment,
  serviceCenters,
  // ... 15+ endpoint modules
};
```

### Nested Endpoint Modules

```typescript
// src/api/ApiEndpoints/appointment/appointment.ts
import { request } from '../../request';
import { TApiResponse } from '../../types';

export const appointmentEndpoints = {
  // Appointments
  list: (filters: IAppointmentFilters): TApiResponse<IAppointment[]> =>
    request.post('/appointments/search', filters),

  // Service requests
  getServiceRequests: (appointmentId: number): TApiResponse<IServiceRequest[]> =>
    request.get(`/appointments/${appointmentId}/service-requests`),

  // Slots
  getSlots: (request: IAppointmentSlotsRequest): TApiResponse<IAppointmentSlot[]> =>
    request.post('/appointments/slots', request),

  // Combined operations
  create: (data: ICreateAppointmentRequest): TApiResponse<ICreateAppointmentResp> =>
    request.post('/appointments', data),
};
```

## API Types

### Response Type Definition

```typescript
// src/api/types.ts
import { AxiosResponse } from 'axios';

export type TApiResponse<T = any> = Promise<AxiosResponse<T>>;

export interface IPaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export type PaginatedAPIResponse<T> = IPaginatedResponse<T>;

// Specific response types
export interface IPasswordRecoveryResp {
  resetTokenId: string;
  email: string;
}

export interface ICreateAppointmentResp {
  appointment: IAppointment;
  confirmationNumber: string;
  totalPrice: number;
  estimatedDuration: number;
}

export interface IAppointmentByKey {
  id: number;
  status: EAppointmentStatus;
  scheduledDate: string;
  customerId: number;
}
```

### Request Type Definition

```typescript
export interface IPasswordRecoveryData {
  email: string;
}

export interface ISetNewPasswordData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IListAppointmentRequest {
  serviceCenterId: number;
  filters?: IAppointmentFilters;
  page: number;
  pageSize: number;
}

export interface ICreateAppointmentRequest {
  serviceCenterId: number;
  serviceIds: number[];
  vehicleId: number;
  scheduledDate: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
}
```

## Authentication Service

### Token Management

```typescript
// src/api/AuthService/AuthService.ts
class AuthService {
  private tokenKey = 'token';
  private refreshTokenKey = 'refreshToken';

  getLocalToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setLocalToken(token: string, refreshToken?: string): void {
    localStorage.setItem(this.tokenKey, token);
    if (refreshToken) {
      localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
  }

  async refresh(): Promise<string> {
    const refreshToken = localStorage.getItem(this.refreshTokenKey);
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await request.post('/auth/refresh', {
        refreshToken,
      });
      const { token, refreshToken: newRefreshToken } = response.data;
      this.setLocalToken(token, newRefreshToken);
      return token;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    window.location.href = '/login';
  }
}

export const authService = new AuthService();
```

## Error Handling

### API Error Types

```typescript
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message;
    const data = error.response?.data;
    return new ApiError(status, message, data);
  }
  return new ApiError(500, 'Unknown error occurred');
};
```

### Error Handling in Components

```typescript
// Usage in Redux thunk
export const fetchAppointments =
  (serviceCenterId: number): AppThunk =>
  async dispatch => {
    try {
      dispatch(setLoading(true));
      const response = await API.appointment.list({ serviceCenterId });
      dispatch(setAppointments(response.data));
    } catch (error) {
      const apiError = handleApiError(error);
      dispatch(setError(apiError.message));
    } finally {
      dispatch(setLoading(false));
    }
  };
```

## Request Cancellation

### Cancel Token Usage

```typescript
import axios from 'axios';

let cancelTokenSource = axios.CancelToken.source();

export const cancelRequests = () => {
  cancelTokenSource.cancel('Request cancelled');
  cancelTokenSource = axios.CancelToken.source();
};

export const createAppointment = (data: ICreateAppointmentRequest): TApiResponse => {
  return request.post('/appointments', data, {
    cancelToken: cancelTokenSource.token,
  });
};
```

## Batch Requests

### Multiple Concurrent Requests

```typescript
export const fetchInitialData =
  (serviceCenterId: number): AppThunk =>
  async dispatch => {
    try {
      const [profileRes, slotsRes, vehiclesRes] = await Promise.all([
        API.serviceCenters.getById(serviceCenterId),
        API.appointment.getSlots({ serviceCenterId }),
        API.vehicles.list({ serviceCenterId }),
      ]);

      dispatch(setProfile(profileRes.data));
      dispatch(setSlots(slotsRes.data));
      dispatch(setVehicles(vehiclesRes.data));
    } catch (error) {
      dispatch(setError(handleApiError(error).message));
    }
  };
```

## Helper Functions

```typescript
// src/api/helper.ts

export const getSessionId = (): string | null => {
  // Try admin session first
  const adminSession = localStorage.getItem('sessionId');
  if (adminSession) return adminSession;

  // Try booking session
  const bookingSession = sessionStorage.getItem('bookingSessionId');
  return bookingSession;
};

export const formatApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  return 'An unexpected error occurred';
};

export const buildQueryString = (params: Record<string, any>): string => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      query.append(key, String(value));
    }
  });
  return query.toString();
};
```

## Key Conventions

1. **Centralized Endpoints** - All API calls go through API object
2. **Type Safety** - Every endpoint is typed with request and response types
3. **Error Handling** - All errors caught and formatted consistently
4. **Token Management** - Automatic token refresh on 401
5. **Session Tracking** - SessionId header sent with every request
6. **Pagination** - Paginated endpoints use standard PaginatedAPIResponse<T>
7. **Async Thunks** - All API calls dispatched from Redux thunks
8. **Request Organization** - Endpoints organized by feature/resource
9. **No Direct Requests** - Never call request/axios directly from components
10. **Interceptors** - All auth and session logic handled by interceptors

## Example: Complete Endpoint Module

```typescript
// src/api/ApiEndpoints/appointment/appointment.ts
import { request } from '../../request';
import {
  TApiResponse,
  ICreateAppointmentRequest,
  ICreateAppointmentResp,
  IAppointmentFilters,
  IAppointment,
} from '../../types';

export const appointment = {
  list: (filters: IAppointmentFilters, page: number, pageSize: number): TApiResponse =>
    request.post('/appointments/search', { ...filters, page, pageSize }),

  create: (data: ICreateAppointmentRequest): TApiResponse<ICreateAppointmentResp> =>
    request.post('/appointments', data),

  getById: (id: number): TApiResponse<IAppointment> => request.get(`/appointments/${id}`),

  update: (id: number, data: Partial<IAppointment>): TApiResponse<IAppointment> =>
    request.put(`/appointments/${id}`, data),

  cancel: (id: number, reason: string): TApiResponse =>
    request.put(`/appointments/${id}/cancel`, { reason }),

  getServiceRequests: (appointmentId: number): TApiResponse =>
    request.get(`/appointments/${appointmentId}/service-requests`),
};
```
