# Routing Domain Deep Dive

## Overview

Client-side routing using React Router v5 with centralized route definitions, role-based access control via PrivateRoute, and permission matrix in `permissions.ts`.

## Route Structure

Routes organized by feature/domain in separate files under `src/routes/`:

### Main Routes (`src/routes/constants.ts`)

```typescript
export const Routes = {
  Admin: AdminRoutes,
  Login: AdminLogin,
  EndUser: EndUser,
  Account: AccountRoutes,
  CapacityManagement: CapacityManagementRoutes,
  BookingFlow: BookingFlowConfigRoutes,
  Pricing: PricingRoutes,
  Reporting: ReportingRoutes,
  Employees: EmployeeRoutes,
  Dealer: DealerRoutes,
  Services: ServicesRoutes,
  CenterProfile: CenterProfileRoutes,
};
```

### Route Type Definitions (`src/routes/types.ts`)

```typescript
export enum AdminRoutes {
  Base = '/admin',
  Appointments = '/admin/appointments',
  DealershipGroups = '/admin/dealership-groups',
  Application = '/admin/application',
  Reporting = '/admin/reporting',
  Profile = '/admin/profile',
  Base = '/admin',
}

export enum CapacityManagementRoutes {
  Base = '/admin/capacity-management',
  CapacitySettings = '/admin/capacity-management/capacity-settings',
  EmployeeSchedule = '/admin/capacity-management/employee-schedule',
  MobileService = '/admin/capacity-management/mobile-service',
  Pods = '/admin/capacity-management/pods',
  Pricing = '/admin/capacity-management/pricing-settings',
  // ... more routes
}

export enum BookingFlowConfigRoutes {
  Base = '/admin/booking-flow-config',
  BookingFlowConfigDetails = '/admin/booking-flow-config/details',
  ServiceOpsCodesMapping = '/admin/booking-flow-config/service-codes-mapping',
  FirstScreen = '/admin/booking-flow-config/first-screen',
  ScreenSettings = '/admin/booking-flow-config/screen-settings',
}
```

## Application Routes Hierarchy

### Root App (`src/App.tsx`)

```tsx
<SnackbarProvider>
  <ConfirmModal />
  <AppRoutes
    valueServicePreviousScreen={valueServicePreviousScreen}
    valueServiceNextScreen={valueServiceNextScreen}
  />
</SnackbarProvider>
```

### Top-Level Routes (`src/routes/AppRoutes/AppRoutes.tsx`)

```tsx
<Route path={Routes.EndUser.Base} component={BookingFlow} />
<PrivateRoute path={Routes.Admin.Base} component={AdminPanel} />
<Route path={Routes.Login.Base} component={Login} />
<Route path={Routes.Account.Base} component={AccountRoutes} />
```

### Nested Route Features

**Booking Flow Routes** (`src/routes/BookingFlowRoutes/BookingFlowRoutes.tsx`)

```tsx
<Switch>
  <Route exact path={Routes.EndUser.Base} component={BookingFlow} />
  <Route path={Routes.EndUser.ManageAppointment} component={ManageAppointmentFlow} />
  <PrivateRoute path={Routes.EndUser.CreateAppointment} component={CreateAppointmentFlow} />
</Switch>
```

**Admin Routes** (`src/routes/AdminRoutes/AdminRoutes.tsx`)

```tsx
<Switch>
  <PrivateRoute path={Routes.CapacityManagement.Base} component={CapacityRoutes} />
  <PrivateRoute path={Routes.BookingFlow.Base} component={BookingFlowSettingsRoutes} />
  <PrivateRoute path={Routes.Pricing.Base} component={PricingRoutes} />
  <PrivateRoute path={Routes.Reporting.Base} component={ReportingRoutes} />
  {/* All admin routes protected */}
</Switch>
```

## Permission-Based Access Control

### Permission Matrix (`src/permissions.ts`)

```typescript
const baseRoles: TRole[] = [
  Roles.EvenFlowAdmin,
  Roles.EvenFlowAccountManager,
  Roles.ServiceDirector,
  Roles.ServiceManager,
  Roles.Staff,
];

export const PERMISSIONS: TRouteRoleMap[] = [
  { route: Routes.Login.Base, roles: true }, // Public

  {
    route: Routes.Admin.Base,
    roles: baseRoles, // Only these roles can access
  },

  {
    route: Routes.Admin.Reporting,
    roles: baseRoles.exceptOf([Roles.Staff]), // Reporting restricted
  },

  {
    route: Routes.Admin.DealershipGroups,
    roles: [Roles.EvenFlowAdmin], // Only EvenFlow admin
  },

  { route: Routes.Admin.Profile, roles: true }, // All authenticated users
];
```

### Role Types

```typescript
// src/types/types.ts
export enum Roles {
  EvenFlowAdmin = 'EvenFlowAdmin',
  EvenFlowAccountManager = 'EvenFlowAccountManager',
  EvenFlowSupport = 'EvenFlowSupport',
  EvenFlowAIAgent = 'EvenFlowAIAgent',
  DealerOwner = 'DealerOwner',
  ServiceDirector = 'ServiceDirector',
  ServiceManager = 'ServiceManager',
  BDCManager = 'BDCManager',
  Staff = 'Staff',
}
```

## PrivateRoute Component

Enforces authentication and authorization:

```tsx
// src/routes/PrivateRoute/PrivateRoute.tsx
export const PrivateRoute: React.FC<IPrivateRouteProps> = ({
  path,
  component: Component,
  exact = true,
}) => {
  const currentUser = useCurrentUser();

  return (
    <Route
      path={path}
      exact={exact}
      render={props => {
        if (!currentUser) {
          return <Redirect to={Routes.Login.Base} />;
        }

        if (!hasPermission(currentUser, path)) {
          return <div>Access Denied</div>;
        }

        return <Component {...props} />;
      }}
    />
  );
};
```

Key checks:

1. User authenticated (currentUser exists)
2. User has required role for route
3. Redirect to login if not authenticated
4. Show error if unauthorized

## Route Parameter Handling

### URL Parameters

```tsx
// Component using route params
function AppRoutes() {
  const { id } = useParams<{ id: string }>();
  // Use id in component
}
```

### Query Parameters

```tsx
// Using useQueryParams hook
function ServicesList() {
  const { pageIndex, filter, sort } = useQueryParams();

  useEffect(() => {
    dispatch(loadServices({ pageIndex, filter, sort }));
  }, [pageIndex, filter, sort]);
}
```

### Browser History Navigation

```tsx
// Using usePopState for back navigation
const { onBack } = usePopState();

function EditForm() {
  const handleCancel = () => {
    onBack(); // Go back to previous page
  };
}
```

## Route-Based Code Splitting

Lazy loading components by route:

```tsx
const AdminPanel = lazy(() => import('../../pages/admin/AdminPanel'));
const BookingFlow = lazy(() => import('../../pages/booking/BookingFlow'));

<Suspense fallback={<Loading />}>
  <Route component={AdminPanel} />
</Suspense>;
```

## Booking Flow Route Structure

Special structure for multi-step booking:

```tsx
// Main booking entry point
/appointment/:id  → BookingFlow component
  ├── Service selection step
  ├── Consultant selection
  ├── Date/time selection
  ├── Transportation options
  └── Confirmation

// Manage existing appointment
/appointment/edit/:id → EditAppointment
/appointment/cancel/:id → CancelAppointment
```

Managed via `appointmentFrameReducer` which tracks:

- Current screen/step
- Selected services, consultant, time
- Previous/next screen navigation

## Admin Panel Route Hierarchy

```
/admin
├── /admin/appointments
├── /admin/dealership-groups
├── /admin/capacity-management
│   ├── /...capacity-settings
│   ├── /...employee-schedule
│   ├── /...pods
│   └── /...pricing-settings
├── /admin/booking-flow-config
│   ├── /...details
│   ├── /...service-codes-mapping
│   ├── /...first-screen
│   └── /...screen-settings
├── /admin/pricing
├── /admin/reporting
└── /admin/profile
```

All nested under `/admin` and protected by `PrivateRoute`.

## Key Utilities

### `hasPermission()` Function

```typescript
export const hasPermission = (user: ICurrentUser | undefined, route: string): boolean => {
  if (!user) return true;

  for (const row of PERMISSIONS) {
    if (matchPath(route, row.route)) {
      if (typeof row.roles === 'boolean') {
        return row.roles;
      }
      return row.roles.includes(user.role);
    }
  }
  return true; // Default allow if not in matrix
};
```

### Route Constants Access

```typescript
// Always use Routes object, never hardcode paths
navigate(Routes.Admin.Appointments);
<Link to={Routes.BookingFlow.ScreenSettings} />
<Redirect to={Routes.Login.Base} />
```

## Navigation Patterns

### Programmatic Navigation

```tsx
const navigate = useNavigate(); // React Router v6 style (project uses v5)

// v5 approach
const history = useHistory();
history.push(Routes.Admin.Appointments);
```

### Link Navigation

```tsx
<Link to={Routes.BookingFlow.Details}>View Details</Link>
```

### Redirect on Condition

```tsx
{
  !currentUser && <Redirect to={Routes.Login.Base} />;
}
```

## Best Practices

1. ✅ Always use `Routes.` constant instead of hardcoded paths
2. ✅ Protect all admin routes with `PrivateRoute`
3. ✅ Define route permissions in `permissions.ts`
4. ✅ Use `useQueryParams()` for optional filters
5. ✅ Use `useParams()` for required route segments
6. ✅ Lazy load components for code splitting
7. ✅ Use `Redirect` for route changes during render
8. ✅ Check `hasPermission()` before showing route buttons

## Authentication Flow

```
User visits /admin
  ↓
PrivateRoute checks PrivateRoute component
  ↓
Not authenticated? → Redirect to /login
  ↓
Authenticated? Check hasPermission()
  ↓
Role allowed? → Render component
  ↓
Role denied? → Show "Access Denied"
```

## Integration with Other Domains

- **State Management**: Route changes trigger Redux actions
- **Authentication**: PrivateRoute uses `useCurrentUser()` Redux selector
- **Analytics**: Route changes tracked via GTM/GA
- **Notifications**: Route errors trigger notifications
