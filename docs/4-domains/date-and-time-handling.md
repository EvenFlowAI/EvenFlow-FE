# Date and Time Handling Domain

## Implementation Summary

Date/time logic is built around dayjs and MUI date picker integration, with project-specific wrappers used in UI flows.

## Concrete Patterns

- dayjs core and plugins are configured at app bootstrap in `src/index.tsx`.
- `LocalizationProvider` with `AdapterDayjs` is used globally.
- Reusable date-aware components exist in `src/components/DataCalendar/` and `src/components/pickers/`.

## Code Examples

From `src/index.tsx`:

```tsx
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
```

```tsx
<LocalizationProvider dateAdapter={AdapterDayjs}>
  <CssBaseline />
  <BrowserRouter>
    <App />
  </BrowserRouter>
</LocalizationProvider>
```

From `src/components/DataCalendar/DataCalendar.tsx`:

```tsx
const today = useMemo(() => dayjs(), []);
let cur = dayjs(date).startOf('month');
```

