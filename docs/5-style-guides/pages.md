# Pages Style Guide

## Overview

The EvenFlow-FE project organizes page/route-level components in `src/pages/` directory. Pages are top-level route components that represent complete screens/views. This guide documents the unique conventions for page components.

## Pages Directory Structure

```
src/pages/
├── admin/                              # Admin pages
│   ├── Login/
│   │   ├── Login.tsx
│   │   ├── useLoginForm.ts
│   │   └── types.ts
│   ├── AdminPanel/
│   │   ├── AdminPanel.tsx
│   │   ├── AdminTabs.tsx
│   │   └── types.ts
│   ├── Profile/
│   ├── TimeDifferentiation/
│   ├── ServiceCategories/
│   ├── BookingFlowConfig/
│   ├── FirstScreenOptions/
│   ├── ScreenSettings/
│   └── ApplicationOpCodeCategory/
│
└── booking/                            # Booking flow pages
    ├── Welcome/
    │   ├── Welcome.tsx
    │   └── types.ts
    ├── ValueService/
    ├── ManageAppointmentFlow/
    ├── EditAppointment/
    ├── CancelAppointment/
    ├── AppointmentFlow/
    ├── BookingFlow/
    ├── CreateAppointmentFlow/
    └── (10+ booking-related pages)
```

## Page Component Patterns

### Basic Page Structure

```typescript
// src/pages/admin/Profile/Profile.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Box, CircularProgress } from '@mui/material';
import { usePageStyles } from './usePageStyles';

export const Profile: React.FC = () => {
  const { classes } = usePageStyles();
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector(state => state.users);

  useEffect(() => {
    dispatch(fetchCurrentUserProfile());
  }, [dispatch]);

  if (loading) {
    return (
      <Box className={classes.centerContainer}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className={classes.errorContainer}>
        <Typography color="error">Failed to load profile: {error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Box className={classes.header}>
        <Typography variant="h4">User Profile</Typography>
      </Box>

      {currentUser && (
        <Box className={classes.content}>
          {/* Profile content */}
        </Box>
      )}
    </Container>
  );
};
```

### Page with Routing

```typescript
// src/pages/admin/AdminPanel/AdminPanel.tsx
import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { AdminRoutes } from '../../../routes/AdminRoutes/AdminRoutes';
import { usePageStyles } from './usePageStyles';

interface TabConfig {
  label: string;
  value: string;
  path: string;
}

const tabs: TabConfig[] = [
  { label: 'Dashboard', value: 'dashboard', path: '/admin/dashboard' },
  { label: 'Settings', value: 'settings', path: '/admin/settings' },
  { label: 'Reports', value: 'reports', path: '/admin/reports' },
];

export const AdminPanel: React.FC = () => {
  const { classes } = usePageStyles();
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <Box className={classes.root}>
      <Tabs
        value={selectedTab}
        onChange={(_, newValue) => setSelectedTab(newValue)}
        className={classes.tabs}
      >
        {tabs.map((tab, index) => (
          <Tab key={tab.value} label={tab.label} value={index} />
        ))}
      </Tabs>

      <Box className={classes.tabContent}>
        <AdminRoutes />
      </Box>
    </Box>
  );
};
```

### Multi-Step Flow Page

```typescript
// src/pages/booking/AppointmentFlow/AppointmentFlow.tsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Box, Stepper, Step, StepLabel } from '@mui/material';
import { EScreenType } from '../../../types/screens';
import { usePageStyles } from './usePageStyles';

interface RouteParams {
  id: string;
}

const screenSteps = [
  { label: 'Services', screen: EScreenType.SERVICE_SELECTION },
  { label: 'Slots', screen: EScreenType.APPOINTMENT_SELECTION },
  { label: 'Information', screen: EScreenType.CUSTOMER_INFORMATION },
  { label: 'Confirmation', screen: EScreenType.CONFIRMATION },
];

export const AppointmentFlow: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const { classes } = usePageStyles();
  const dispatch = useDispatch();
  const { currentScreen, trackerData } = useSelector(state => state.appointmentFrame);

  useEffect(() => {
    dispatch(initializeAppointmentFlow(id));
  }, [id, dispatch]);

  const currentStepIndex = screenSteps.findIndex(
    step => step.screen === currentScreen
  );

  const renderScreen = () => {
    switch (currentScreen) {
      case EScreenType.SERVICE_SELECTION:
        return <ServiceSelection />;
      case EScreenType.APPOINTMENT_SELECTION:
        return <AppointmentSelection />;
      case EScreenType.CUSTOMER_INFORMATION:
        return <CustomerInformation />;
      case EScreenType.CONFIRMATION:
        return <AppointmentConfirmation />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" className={classes.container}>
      <Stepper activeStep={currentStepIndex} className={classes.stepper}>
        {screenSteps.map((step) => (
          <Step key={step.screen}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box className={classes.screenContainer}>
        {renderScreen()}
      </Box>
    </Container>
  );
};
```

## Page with Modals

```typescript
// src/pages/admin/ServiceCategories/ServiceCategoriesPage.tsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Box, Button } from '@mui/material';
import { ServiceCategoriesTable } from '../../../features/admin/ServiceCategories/ServiceCategoriesTable/ServiceCategoriesTable';
import { AddServiceCategoryModal } from '../../../features/admin/ServiceCategories/AddServiceCategoryModal/AddServiceCategoryModal';
import { usePageStyles } from './usePageStyles';

export const ServiceCategoriesPage: React.FC = () => {
  const { classes } = usePageStyles();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const dispatch = useDispatch();
  const { categories, loading } = useSelector(state => state.serviceCategories);

  const handleCreate = () => {
    setSelectedCategoryId(null);
  };

  const handleEdit = (id: number) => {
    setSelectedCategoryId(id);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteServiceCategory(id));
    }
  };

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Box className={classes.header}>
        <Typography variant="h4">Service Categories</Typography>
        <Button
          variant="contained"
          onClick={handleCreate}
        >
          New Category
        </Button>
      </Box>

      <ServiceCategoriesTable
        data={categories}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AddServiceCategoryModal
        categoryId={selectedCategoryId}
        onClose={() => setSelectedCategoryId(null)}
      />
    </Container>
  );
};
```

## Page Styling

```typescript
// src/pages/admin/ServiceCategories/usePageStyles.ts
import { makeStyles } from 'tss-react/mui';

export const usePageStyles = makeStyles()(theme => ({
  container: {
    padding: theme.spacing(3),
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
  content: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(3),
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
  },
  errorContainer: {
    backgroundColor: theme.palette.error.light,
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(2),
  },
}));
```

## Page Types

```typescript
// src/pages/admin/ServiceCategories/types.ts
export interface IServiceCategoryPageState {
  selectedCategoryId: number | null;
  filters: IServiceCategoryFilters;
  viewMode: 'table' | 'grid';
}

export interface IServiceCategoryFilters {
  searchText?: string;
  status?: 'active' | 'inactive';
  sortBy?: 'name' | 'createdAt';
}
```

## Login Page Pattern

```typescript
// src/pages/admin/Login/Login.tsx
import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Box, TextField, Button, Alert } from '@mui/material';
import { login } from '../../../store/reducers/users/actions';
import { Routes } from '../../../routes/constants';
import { usePageStyles } from './usePageStyles';

interface LocationState {
  from?: { pathname: string };
}

export const Login: React.FC = () => {
  const { classes } = usePageStyles();
  const history = useHistory();
  const location = useLocation<LocationState>();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loading, error } = useSelector(state => state.users);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(login(email, password));
      const from = (location.state as LocationState)?.from?.pathname || Routes.Admin;
      history.push(from);
    } catch (err) {
      // Error handled by Redux
    }
  };

  return (
    <Container component="main" maxWidth="sm" className={classes.container}>
      <Box className={classes.form}>
        <Typography variant="h4" className={classes.title}>
          Sign In
        </Typography>

        {error && (
          <Alert severity="error" className={classes.error}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className={classes.submitButton}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </Box>
    </Container>
  );
};
```

## Page Key Conventions

1. **Component Type** - All pages are React.FC components
2. **Routing Integration** - Pages are directly connected to routes
3. **Redux Connected** - Pages use useSelector/useDispatch
4. **Top-Level Layout** - Pages define overall page layout
5. **Feature Composition** - Pages compose features from src/features
6. **Error/Loading States** - Pages handle these states
7. **Route Parameters** - Pages use useParams to access route data
8. **Modal Management** - Page-level state for modal visibility
9. **Styling** - Page styling in separate usePageStyles hook
10. **Single Page** - Each URL path has one page component

## Page Naming Pattern

- Login → Login.tsx
- Admin Dashboard → AdminPanel.tsx
- Service Categories → ServiceCategoriesPage.tsx (uses Page suffix for clarity)
- Appointment Flow → AppointmentFlow.tsx

## Example: Complete Page

```typescript
// src/pages/admin/Profile/Profile.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Box, CircularProgress, Alert } from '@mui/material';
import { ProfileForm } from '../../../features/admin/Profiles/UserProfile/UserProfile';
import { fetchUserProfile } from '../../../store/reducers/users/actions';
import { usePageStyles } from './usePageStyles';

export const Profile: React.FC = () => {
  const { classes } = usePageStyles();
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector(state => state.users);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  if (loading) {
    return (
      <Container className={classes.container}>
        <Box className={classes.loading}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className={classes.container}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" className={classes.container}>
      <Box className={classes.content}>
        {currentUser && (
          <ProfileForm user={currentUser} />
        )}
      </Box>
    </Container>
  );
};
```

## Common Page Patterns

1. **CRUD Page** - List view with edit/delete modals
2. **Form Page** - Form submission with validation
3. **Multi-Step Flow** - Stepper with screens
4. **Tab-Based** - Tabs switching between content
5. **Dashboard** - Multiple sections with widgets
6. **Detail View** - Single item detailed display
7. **Search/Filter** - List with filtering
8. **Authentication** - Login/Register flows
