# UI Domain Deep Dive

## Overview

The UI domain implements React components using Material-UI (MUI) as the primary component library with Emotion for CSS-in-JS styling and TSS-React for TypeScript-first styling hooks.

## Framework & Libraries

- **React 18.2.0** - Component framework
- **@mui/material 5.15.4** - Component library
- **@emotion/react & @emotion/styled** - CSS-in-JS engine
- **tss-react 4.9.3** - TypeScript styling solution
- **MUI Icons** - Icon library

## Component Architecture

### Base Components

Located in `src/components/`:

1. **Form Controls** (`formControls/`)
   - `TextInput`, `NumberInput`, `PasswordInput`, `PhoneInput`
   - `SelectInput`, `CheckboxGroup`, `RadioGroup`
   - `DateInput`, `TimeInput`, `FileInput`
   - All extend MUI TextField or equivalent with consistent styling

   ```tsx
   // Example from TextInput
   interface TextInputProps extends TextInputPropsInterface {
     label?: string;
     value: string;
     onChange: (value: string) => void;
     error?: string;
     required?: boolean;
   }
   ```

2. **Buttons** (`buttons/`)
   - `ActionButtons`, `SaveButton`, `DeleteButton`, `CancelButton`
   - `ArrowButton`, `EditButton`, `LinkButton`, `PercentButton`
   - All styled consistently with MUI Button component

3. **Tables** (`tables/`)
   - `BaseTable` - Foundation for all data tables
   - `SortableTable` - Adds sorting capability
   - `DragableTable` - Adds drag-drop reordering
   - Support virtual scrolling via `react-window` for large datasets

4. **Modals** (`modals/`)
   - `BaseModal` - Wrapper around MUI Dialog with consistent styling
   - `ConfirmModal` - Delete/confirmation dialogs
   - All modals controlled via Redux `modals` reducer

5. **Pickers** (`pickers/`)
   - `DatePicker` - MUI date picker wrapper
   - `TimePicker` - Time selection
   - `TimeSlotPicker` - Appointment slot selection
   - `LocationPicker` - Geographic location selection

6. **Data Components**
   - `DataCalendar` - Calendar visualization for dates
   - `UserLocation` - User location display

7. **Wrappers**
   - `TitleContainer` - Header container
   - `ContentContainer` - Main content area
   - `FallBack` - Error fallback UI

### Styling Patterns

#### Pattern 1: TSS-React with Emotion (Preferred)

```tsx
import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  title: {
    fontSize: '18px',
    fontWeight: 600,
  },
}));

// Usage in component
const { classes } = useStyles();
return (
  <div className={classes.root}>
    <h1 className={classes.title}>Title</h1>
  </div>
);
```

#### Pattern 2: Emotion Styled Components

```tsx
import styled from '@emotion/styled';

const StyledContainer = styled.div`
  display: flex;
  padding: 16px;
  background-color: #f5f5f5;
`;
```

#### Pattern 3: MUI sx Prop (Inline)

```tsx
<Box sx={{ display: 'flex', gap: 2, p: 2 }}>{/* content */}</Box>
```

### Component Type Enforcement

All components enforce TypeScript types strictly:

```tsx
// Good - Component with proper typing
interface CardProps {
  title: string;
  content: React.ReactNode;
  actions?: React.ReactNode;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ title, content, actions, onClick }) => {
  return (
    <Box onClick={onClick}>
      <Typography variant="h6">{title}</Typography>
      {content}
      {actions}
    </Box>
  );
};
```

## Feature Components

### Booking Flow Components (`src/features/booking/`)

- `BookingFlowPage` - Main booking container
- `BookingFlowSteps` - Step navigation and flow logic
- Service selection, consultant selection, appointment timing, transportation options, confirmation

### Admin Components (`src/features/admin/`)

Organized by admin functionality:

- `ServiceCenters/` - Dealership location management
- `ServiceCategories/` - Service type configuration
- `Pricing*/` - Pricing strategy management
- `Reporting/` - Analytics and reporting views
- `TimeOfDayDesirability/` - Demand pattern configuration
- Navigation: `SideBar/`, `NavBar/`

## Responsive Design

MUI Breakpoints used:

- `xs` (0px) - Mobile phones
- `sm` (600px) - Tablets
- `md` (960px) - Small laptops
- `lg` (1280px) - Desktops
- `xl` (1920px) - Large screens

Detection via `useMediaQuery`:

```tsx
const isMobile = useMediaQuery(theme.breakpoints.down('mdl'));
if (isMobile) {
  return <MobileVersion />;
}
return <DesktopVersion />;
```

## Common UI Patterns

### 1. Tab-Based Navigation

Uses `@mui/lab` TabContext/TabPanel:

```tsx
const [selectedTab, setTab] = useState<string>('0');

return (
  <TabContext value={selectedTab}>
    <TabList onChange={(e, newValue) => setTab(newValue)}>
      <Tab label="Tab 1" value="0" />
      <Tab label="Tab 2" value="1" />
    </TabList>
    <TabPanel value="0">{/* Content 1 */}</TabPanel>
    <TabPanel value="1">{/* Content 2 */}</TabPanel>
  </TabContext>
);
```

### 2. Autocomplete with Chips

Standardized autocomplete with tag/chip support:

```tsx
<AutocompleteWithChips
  options={items}
  value={selected}
  onChange={setSelected}
  label="Select items"
/>
```

### 3. Confirmation Dialogs

```tsx
const { confirm } = useConfirm();
const handleDelete = async () => {
  const result = await confirm('Are you sure?');
  if (result) {
    // Perform delete
  }
};
```

## Theme Configuration

Theme defined in `src/theme/theme.ts`:

```tsx
const theme = createTheme({
  palette: {
    primary: { main: colors.primary },
    secondary: { main: colors.secondary },
  },
  typography: {
    fontFamily: fonts.primary,
  },
});
```

Colors and fonts centralized in `src/theme/colors.ts` and `src/theme/fonts.ts`.

## Accessibility & Best Practices

1. All interactive elements keyboard accessible
2. ARIA labels on icon buttons
3. Semantic HTML structure
4. Color contrast meets WCAG standards
5. Form labels properly associated with inputs

## Key Hooks for UI

- `useMediaQuery()` - Responsive breakpoint detection
- `useTheme()` - Theme object access
- `useActionButtonsStyles()` - Standardized action button styling
- `useStyles()` - Component-specific styling via TSS-React
- `useOnScreen()` - Detect element visibility

## Performance Considerations

1. **Large Lists**: Use `react-window` virtualization
2. **Heavy Computations**: Memoize with `useMemo()`
3. **Callbacks**: Stabilize with `useCallback()`
4. **Component Splitting**: Lazy load route components
5. **Image Optimization**: Use MUI Image component or native loading="lazy"
