# Custom Hooks Domain Deep Dive

## Overview

Custom hooks extract reusable logic from components and integrate with Redux, routing, forms, and external services. 22+ custom hooks providing business logic abstraction.

## Business Logic Hooks

### User & Authentication

```typescript
// src/hooks/useCurrentUser/useCurrentUser.ts
export const useCurrentUser = (): ICurrentUser | undefined => {
  return useSelector((state: RootState) => state.users.currentUser);
};

// Usage
const currentUser = useCurrentUser();
if (!currentUser) navigate(Routes.Login.Base);
```

### Dealership Profile

```typescript
// src/hooks/useDealershipProfile/useDealershipProfile.tsx
export const useDealershipProfile = () => {
  const { selectedSC } = useSelector((state: RootState) => state.appointment);
  const { scProfile } = useSelector((state: RootState) => state.appointment);

  return {
    selectedServiceCenter: selectedSC,
    profile: scProfile,
  };
};
```

### Service Centers Selection

```typescript
// src/hooks/useSCs/useSCs.tsx
export const useSCs = () => {
  const dispatch = useDispatch();
  const { selectedSC } = useSelector((state: RootState) => state.appointment);

  const selectServiceCenter = useCallback(
    (scId: number) => {
      dispatch(setSelectedServiceCenter(scId));
    },
    [dispatch]
  );

  return {
    selectedSC,
    selectServiceCenter,
  };
};
```

### Pod Selection

```typescript
// src/hooks/useSelectedPod/useSelectedPod.ts
export const useSelectedPod = (): number | null => {
  return useSelector((state: RootState) => state.appointment.selectedPod);
};
```

### Service Option Handling

```typescript
// src/hooks/useServiceOption/useServiceOption.tsx
export const useServiceOption = () => {
  const { serviceTypeOption } = useSelector((state: RootState) => state.appointmentFrame);

  return serviceTypeOption;
};
```

## UI State Management Hooks

### Modal Control

```typescript
// src/hooks/useModal/useModal.tsx
interface UseModalReturn {
  modalOpen: boolean;
  setOpen: (open: boolean) => void;
  onClose: () => void;
}

export const useModal = (): UseModalReturn => {
  const [modalOpen, setOpen] = useState(false);

  return {
    modalOpen,
    setOpen,
    onClose: () => setOpen(false),
  };
};

// Usage
function DeleteModal() {
  const { modalOpen, setOpen, onClose } = useModal();
  return (
    <>
      <Button onClick={() => setOpen(true)}>Delete</Button>
      <Dialog open={modalOpen} onClose={onClose}>
        {/* Confirm dialog */}
      </Dialog>
    </>
  );
}
```

### Message/Notification Display

```typescript
// src/hooks/useMessage/useMessage.tsx
export const useMessage = () => {
  const { enqueueSnackbar } = useSnackbar();

  return {
    showSuccess: (message: string) => enqueueSnackbar(message, { variant: 'success' }),
    showError: (message: string) => enqueueSnackbar(message, { variant: 'error' }),
    showWarning: (message: string) => enqueueSnackbar(message, { variant: 'warning' }),
    showInfo: (message: string) => enqueueSnackbar(message, { variant: 'info' }),
  };
};

// Usage
const { showSuccess, showError } = useMessage();
try {
  await api.update(data);
  showSuccess('Updated successfully');
} catch (error) {
  showError('Update failed');
}
```

### Confirmation Dialog

```typescript
// src/hooks/useConfirm/useConfirm.tsx
export const useConfirm = () => {
  const [confirmState, setConfirmState] = useState<IConfirmState | null>(null);

  const confirm = (message: string): Promise<boolean> => {
    return new Promise(resolve => {
      setConfirmState({
        message,
        onConfirm: () => {
          setConfirmState(null);
          resolve(true);
        },
        onCancel: () => {
          setConfirmState(null);
          resolve(false);
        },
      });
    });
  };

  return { confirm, confirmState };
};

// Usage
const { confirm } = useConfirm();
const handleDelete = async () => {
  if (await confirm('Are you sure you want to delete?')) {
    await api.delete(id);
  }
};
```

### Exception/Error Display

```typescript
// src/hooks/useException/useException.ts
export const useException = () => {
  const { showError } = useMessage();

  const handleException = (error: any) => {
    const message = error?.message || 'An error occurred';
    showError(message);
  };

  return { handleException };
};
```

### Sidebar & Layout

```typescript
// src/hooks/useSideBar/useSideBar.tsx
export const useSideBar = () => {
  const { isSidebarOpen } = useSelector((state: RootState) => state.screenSettings);
  const dispatch = useDispatch();

  const toggleSidebar = useCallback(() => {
    dispatch(setSidebarOpen(!isSidebarOpen));
  }, [isSidebarOpen, dispatch]);

  return {
    isOpen: isSidebarOpen,
    toggle: toggleSidebar,
  };
};
```

## Form & Validation Hooks

### Validation

```typescript
// src/hooks/useValidation/useValidation.tsx
interface ValidationRule {
  validate: (value: any) => boolean;
  message: string;
}

export const useValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (
    data: Record<string, any>,
    rules: Record<string, ValidationRule[]>
  ): boolean => {
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
  };

  return { validate, errors, setErrors };
};

// Usage
const { validate, errors } = useValidation();

const handleSubmit = () => {
  if (
    validate(formData, {
      email: [{ validate: v => /.+@.+/.test(v), message: 'Invalid email' }],
    })
  ) {
    // Submit
  }
};
```

## Data Fetching Hooks

### Consultants Data

```typescript
// src/hooks/useGetConsultantsData/useGetConsultantsData.tsx
export const useGetConsultantsData = (serviceCenterId?: number) => {
  const dispatch = useDispatch();
  const { consultants, isLoading } = useSelector((state: RootState) => state.employees);

  useEffect(() => {
    if (serviceCenterId) {
      dispatch(loadConsultants(serviceCenterId));
    }
  }, [serviceCenterId, dispatch]);

  return { consultants, isLoading };
};
```

### Transportation Data

```typescript
// src/hooks/useGetTransportationsData/useGetTransportationsData.tsx
export const useGetTransportationsData = () => {
  const dispatch = useDispatch();
  const { transportations, isLoading } = useSelector((state: RootState) => state.transportation);

  useEffect(() => {
    dispatch(loadTransportations());
  }, [dispatch]);

  return { transportations, isLoading };
};
```

## Utility Hooks

### Debounce

```typescript
// src/hooks/useDebounce/useDebounce.tsx
export const useDebounce = <T>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Usage - search input debounce
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 500);

useEffect(() => {
  if (debouncedSearch) {
    dispatch(loadSearchResults(debouncedSearch));
  }
}, [debouncedSearch, dispatch]);
```

### Click Outside Detection

```typescript
// src/hooks/useClickOutside/useClickOutside.tsx
export const useClickOutside = (ref: React.RefObject<HTMLElement>, callback: () => void): void => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [ref, callback]);
};

// Usage
const ref = useRef<HTMLDivElement>(null);
useClickOutside(ref, () => setDropdownOpen(false));
```

### On Screen Detection

```typescript
// src/hooks/useOnScreen/useOnScreen.tsx
export const useOnScreen = (ref: React.RefObject<HTMLElement>): boolean => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [ref]);

  return isVisible;
};

// Usage - lazy load when visible
const ref = useRef<HTMLDivElement>(null);
const isVisible = useOnScreen(ref);

useEffect(() => {
  if (isVisible) {
    loadHeavyComponent();
  }
}, [isVisible]);
```

### Local Storage

```typescript
// src/hooks/useStorage/useStorage.ts
export const useStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    setStoredValue(value);
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  return [storedValue, setValue] as const;
};

// Usage
const [preferences, setPreferences] = useStorage('userPrefs', {});
```

## Routing Hooks

### Query Parameters

```typescript
// src/hooks/useQueryParams/useQueryParams.tsx
export const useQueryParams = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  return {
    pageIndex: parseInt(query.get('page') || '0'),
    filter: query.get('filter') || '',
    sort: query.get('sort') || '',
  };
};
```

### Browser History/Back Navigation

```typescript
// src/hooks/usePopState/usePopState.tsx
export const usePopState = () => {
  const history = useHistory();

  const onBack = useCallback(() => {
    history.goBack();
  }, [history]);

  return { onBack };
};
```

## Analytics Hooks

### Analytics by Service Center

```typescript
// src/hooks/useAnalyticsBySCId/useAnalyticsBySCId.tsx
export const useAnalyticsBySCId = (
  scId?: string,
  isCreated?: boolean,
  setTracker?: (ids: string[]) => void
) => {
  useEffect(() => {
    if (scId && isCreated) {
      // Track service center booking event
      ReactGA.event({
        category: 'booking',
        action: 'appointment_created',
        label: `SC: ${scId}`,
      });

      // Set tracking IDs
      if (setTracker) {
        setTracker([scId]);
      }
    }
  }, [scId, isCreated, setTracker]);
};
```

## Pagination Hook

### Pagination Logic

```typescript
// src/hooks/usePaginations/usePaginations.tsx
interface PaginationState {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}

export const usePaginations = (initialPageSize: number = 10) => {
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
    totalCount: 0,
  });

  const goToPage = (pageIndex: number) => {
    setPaginationState(prev => ({ ...prev, pageIndex }));
  };

  const setPageSize = (pageSize: number) => {
    setPaginationState(prev => ({ ...prev, pageSize, pageIndex: 0 }));
  };

  return {
    ...paginationState,
    goToPage,
    setPageSize,
  };
};
```

## Styling Hooks

All use `tss-react` makeStyles() pattern:

```typescript
// src/hooks/styling/useCardStyles.ts
export const useStyles = makeStyles()((theme) => ({
  root: {
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
  },
  title: {
    fontSize: '18px',
    fontWeight: 600,
    marginBottom: theme.spacing(1),
  },
}));

// Usage in component
const { classes } = useStyles();
return <div className={classes.root}><h3 className={classes.title}>Title</h3></div>;
```

## Best Practices

1. ✅ Extract business logic into custom hooks
2. ✅ Use Redux selectors in hooks for state
3. ✅ Memoize callbacks with useCallback
4. ✅ Clean up effects (event listeners, timers)
5. ✅ Type hook parameters and return values
6. ✅ Keep hooks focused on single responsibility
7. ✅ Use custom hooks for complex component logic
8. ✅ Expose hooks from index files for easier imports
9. ✅ Document hook parameters and usage
10. ✅ Test hooks with @testing-library/react-hooks
