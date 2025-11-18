# Routing Style Guide

## Overview

The EvenFlow-FE project uses **React Router v5.2.0** with centralized route definitions and role-based access control. Routes are organized by feature with a consistent structure that enforces permission checking. This guide documents the unique conventions and patterns.

## Routing Directory Structure

```
src/routes/
├── constants.ts              # Route path constants
├── types.ts                  # Route type definitions and enums
├── PrivateRoute/
│   └── PrivateRoute.tsx     # Protected route wrapper component
├── AppRoutes/
│   └── AppRoutes.tsx        # Main route configuration
├── AdminRoutes/
│   └── AdminRoutes.tsx      # Admin-specific routes
├── BookingFlowRoutes/
│   └── BookingFlowRoutes.tsx # Booking flow routes
└── ... (8+ route modules)
```

## Route Constants

### Path Definition Pattern

```typescript
// src/routes/constants.ts
export const Routes = {
  // Public routes
  Login: '/login',
  BookingFlow: '/booking/:id',

  // Admin routes
  Admin: '/admin',
  AdminServiceCenters: '/admin/service-centers',
  AdminPricing: '/admin/pricing',
  AdminReporting: '/admin/reporting',

  // Booking specific
  BookingWelcome: '/booking/:id/welcome',
  BookingAppointment: '/booking/:id/appointment',
  BookingConfirmation: '/booking/:id/confirmation',

  // Feature routes
  AdminPanel: '/admin/panel',
  Profile: '/admin/profile',
} as const;

export type TRoute = (typeof Routes)[keyof typeof Routes];
```

## Route Type Definitions

### Screen Enums

```typescript
// src/types/screens.ts
export enum EScreenType {
  WELCOME = 'WELCOME',
  SERVICE_SELECTION = 'SERVICE_SELECTION',
  APPOINTMENT_SELECTION = 'APPOINTMENT_SELECTION',
  CUSTOMER_INFORMATION = 'CUSTOMER_INFORMATION',
  CONFIRMATION = 'CONFIRMATION',
  VALUE_SERVICE = 'VALUE_SERVICE',
  TRANSPORTATION = 'TRANSPORTATION',
}

export type TScreen = EScreenType;
```

### Route Parameter Types

```typescript
// src/routes/types.ts
export interface IRouteParam {
  id: string;
  tab?: string;
  mode?: 'view' | 'edit' | 'create';
}

export type TRouteParams = Record<string, string | undefined>;
```

## Role-Based Access Control

### Permission Matrix

```typescript
// src/permissions.ts
import { TRole } from './store/reducers/users/types';
import { Routes } from './routes/constants';

export const permissionMatrix: Record<string, TRole[]> = {
  [Routes.Admin]: ['EvenFlowAdmin', 'DealerOwner', 'ServiceDirector'],
  [Routes.AdminServiceCenters]: ['EvenFlowAdmin', 'DealerOwner'],
  [Routes.AdminPricing]: ['EvenFlowAdmin', 'ServiceDirector', 'ServiceManager'],
  [Routes.AdminReporting]: ['EvenFlowAdmin', 'DealerOwner', 'ServiceDirector'],
  [Routes.Profile]: ['EvenFlowAdmin', 'DealerOwner', 'ServiceDirector', 'ServiceManager'],
};

export const hasPermission = (route: string, userRole?: TRole): boolean => {
  if (!userRole) return false;
  const allowedRoles = permissionMatrix[route];
  return allowedRoles?.includes(userRole) ?? true;
};
```

## PrivateRoute Component

### Implementation Pattern

```typescript
// src/routes/PrivateRoute/PrivateRoute.tsx
import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useCurrentUser } from '../../hooks/useCurrentUser/useCurrentUser';
import { hasPermission } from '../../permissions';
import { Routes } from '../constants';

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
  requiredRoles?: TRole[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  requiredRoles,
  ...rest
}) => {
  const currentUser = useCurrentUser();

  return (
    <Route
      {...rest}
      render={(props) => {
        // Check if user is authenticated
        if (!currentUser) {
          return <Redirect to={Routes.Login} />;
        }

        // Check if user has required role
        if (requiredRoles && !requiredRoles.includes(currentUser.role)) {
          return <Redirect to={Routes.Admin} />;
        }

        // Check permission matrix
        if (rest.path && !hasPermission(rest.path, currentUser.role)) {
          return <Redirect to={Routes.Admin} />;
        }

        return <Component {...props} />;
      }}
    />
  );
};
```

## Route Configuration

### Main AppRoutes Component

```typescript
// src/routes/AppRoutes/AppRoutes.tsx
import React, { useEffect } from 'react';
import { Route, Switch, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { PrivateRoute } from '../PrivateRoute/PrivateRoute';
import { Routes } from '../constants';

const AppRoutes: React.FC = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.users);

  return (
    <Switch>
      {/* Public routes */}
      <Route exact path={Routes.Login} component={Login} />
      <Route path={Routes.BookingFlow} component={BookingFlow} />

      {/* Protected admin routes */}
      <PrivateRoute
        path={Routes.Admin}
        component={AdminPanel}
        requiredRoles={['EvenFlowAdmin', 'DealerOwner', 'ServiceDirector']}
      />

      <PrivateRoute
        path={Routes.AdminServiceCenters}
        component={ServiceCenters}
        requiredRoles={['EvenFlowAdmin', 'DealerOwner']}
      />

      <PrivateRoute
        path={Routes.Profile}
        component={Profile}
      />

      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
};

export default AppRoutes;
```

### Nested Route Structure

```typescript
// src/routes/AdminRoutes/AdminRoutes.tsx
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { PrivateRoute } from '../PrivateRoute/PrivateRoute';

export const AdminRoutes: React.FC = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <PrivateRoute
        path={`${path}/service-centers`}
        component={ServiceCenters}
      />
      <PrivateRoute
        path={`${path}/pricing`}
        component={PricingSettings}
      />
      <PrivateRoute
        path={`${path}/reporting`}
        component={Reporting}
      />
    </Switch>
  );
};
```

## URL Parameters

### useParams Hook

```typescript
interface AppointmentRouteParams {
  id: string;
  appointmentId?: string;
  mode?: 'view' | 'edit';
}

export const AppointmentDetails: React.FC = () => {
  const { id, appointmentId, mode } = useParams<AppointmentRouteParams>();

  useEffect(() => {
    if (appointmentId) {
      dispatch(fetchAppointment(appointmentId));
    }
  }, [appointmentId]);

  return (
    <div>
      {/* Component content */}
    </div>
  );
};
```

## Query Parameters

### useQueryParams Hook

```typescript
interface QueryParams {
  filter?: string;
  sort?: 'asc' | 'desc';
  page?: string;
}

export const TableList: React.FC = () => {
  const { filter, sort, page } = useQueryParams<QueryParams>();

  const currentPage = page ? parseInt(page) : 1;
  const currentFilter = filter || 'all';

  return (
    <Table
      page={currentPage}
      filter={currentFilter}
      sort={sort}
    />
  );
};
```

## Programmatic Navigation

### Navigation Patterns

```typescript
import { useHistory } from 'react-router-dom';
import { Routes } from '../routes/constants';

export const CreateAppointmentFlow: React.FC = () => {
  const history = useHistory();

  const handleComplete = () => {
    // Navigate to confirmation
    history.push(`${Routes.BookingFlow}/confirmation`);
  };

  const handleBack = () => {
    history.goBack();
  };

  const handleExitToHome = () => {
    history.push('/');
  };

  return (
    <div>
      {/* Component content */}
    </div>
  );
};
```

## Link Components

### Using React Router Links

```typescript
import { Link, NavLink } from 'react-router-dom';
import { Routes } from '../routes/constants';

export const Navigation: React.FC = () => {
  return (
    <nav>
      <Link to={Routes.Admin}>Dashboard</Link>
      <NavLink
        to={Routes.AdminServiceCenters}
        activeClassName="active"
        exact
      >
        Service Centers
      </NavLink>
    </nav>
  );
};
```

## Route Guards and Middleware

### Auth Check Wrapper

```typescript
export const useAuthCheck = () => {
  const history = useHistory();
  const currentUser = useCurrentUser();

  useEffect(() => {
    if (!currentUser) {
      history.push(Routes.Login);
    }
  }, [currentUser, history]);

  return currentUser;
};
```

## Dynamic Routes

### Routes Based on User Role

```typescript
export const getRoleBasedRoutes = (role: TRole): LinkType[] => {
  const baseRoutes = [{ to: Routes.Profile, name: 'Profile', roles: true }];

  const roleSpecificRoutes: Record<TRole, LinkType[]> = {
    EvenFlowAdmin: [
      { to: Routes.Admin, name: 'Admin', roles: true },
      { to: Routes.AdminServiceCenters, name: 'Service Centers', roles: true },
    ],
    DealerOwner: [
      { to: Routes.Admin, name: 'Dashboard', roles: true },
      { to: Routes.AdminPricing, name: 'Pricing', roles: true },
    ],
    // ... other roles
  };

  return [...baseRoutes, ...(roleSpecificRoutes[role] || [])];
};
```

## Key Conventions

1. **Route Constants** - All route paths defined in constants.ts
2. **Type Safety** - Route parameters typed with interfaces
3. **Permission Matrix** - Centralized permission definition
4. **PrivateRoute Wrapper** - All protected routes use PrivateRoute component
5. **exact Matching** - Use `exact` for routes to prevent partial matches
6. **Nested Routes** - Feature routes organized in separate modules
7. **No Hardcoded Paths** - Always use route constants
8. **useParams and useQueryParams** - Use custom hooks for parameter access
9. **History API** - Use useHistory hook for programmatic navigation
10. **Role-Based Rendering** - Use permission matrix for conditional rendering

## Example: Complete Route Setup

```typescript
// src/routes/constants.ts
export const Routes = {
  Login: '/login',
  Admin: '/admin',
  AdminServiceCenters: '/admin/service-centers',
  AdminPricing: '/admin/pricing/:centerId',
  BookingFlow: '/booking/:id',
  Profile: '/admin/profile',
} as const;

// src/routes/AppRoutes/AppRoutes.tsx
export const AppRoutes: React.FC = () => {
  return (
    <Switch>
      <Route exact path={Routes.Login} component={Login} />

      <PrivateRoute
        path={Routes.Admin}
        component={AdminPanel}
      />

      <PrivateRoute
        path={Routes.AdminServiceCenters}
        component={ServiceCenters}
      />

      <PrivateRoute
        path={Routes.AdminPricing}
        component={PricingSettings}
      />

      <Route path={Routes.BookingFlow} component={BookingFlow} />

      <Route component={NotFound} />
    </Switch>
  );
};
```
