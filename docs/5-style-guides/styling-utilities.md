# Styling Utilities Style Guide

## Overview

The EvenFlow-FE project centralizes design system values in `src/theme/` directory. This includes color palettes, typography definitions, theme configuration, and font imports. This guide documents the unique conventions for styling utilities.

## Theme Directory Structure

```
src/theme/
├── colors.ts         # MUI color palette definitions
├── fonts.ts          # Font face definitions and typography
├── theme.ts          # Complete MUI theme configuration
└── index.ts          # Exports all theme utilities
```

## Colors Configuration

### Palette Definition

```typescript
// src/theme/colors.ts
import { PaletteOptions } from '@mui/material/styles';

export const colors: PaletteOptions = {
  primary: {
    main: '#7898FF',
    light: '#8FA7FF',
    dark: '#5B7AD9',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#f50057',
    light: '#f73378',
    dark: '#c51d3a',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#F7F8FB',
    paper: '#FFFFFF',
  },
  success: {
    main: '#89E5AB',
    light: '#A8EDBC',
    dark: '#5AC881',
    contrastText: '#202021',
  },
  error: {
    main: '#FF0000',
    light: '#FF4444',
    dark: '#CC0000',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#FFA500',
    light: '#FFB84D',
    dark: '#FF8C00',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#202021',
    light: '#4A4A4B',
    dark: '#000000',
    contrastText: '#FFFFFF',
  },
  divider: '#DADADA',
};

// Semantic color constants
export const semanticColors = {
  positive: colors.success?.main,
  negative: colors.error?.main,
  neutral: colors.info?.main,
  warning: colors.warning?.main,
};
```

### Color Usage Pattern

```typescript
// In styling hooks
export const useCardStyles = makeStyles()((theme) => ({
  successCard: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  },
  errorCard: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
}));

// In components
<Box sx={{ backgroundColor: theme.palette.primary.main }}>
  {/* content */}
</Box>
```

## Typography Configuration

### Font Faces and Imports

```typescript
// src/theme/fonts.ts
import { CSSProperties } from '@mui/material/styles/createTypography';

export const fontFamilies = {
  primary: '"Roboto", "Helvetica", "Arial", sans-serif',
  secondary: '"Segoe UI", "Tahoma", "Geneva", "Verdana", sans-serif',
  monospace: '"Courier New", "Courier", monospace',
};

// Import fonts in main CSS or styled-components
export const fontFaceDeclarations = `
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
`;
```

### Typography Definitions

```typescript
import { TypographyOptions } from '@mui/material/styles/createTypography';

export const typography: TypographyOptions = {
  fontFamily: fontFamilies.primary,
  fontSize: 14,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,

  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.015625em',
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 700,
    lineHeight: 1.3,
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 700,
    lineHeight: 1.4,
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.5,
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 1.6,
  },

  body1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.43,
  },

  button: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.75,
    textTransform: 'none',
  },

  caption: {
    fontSize: '0.75rem',
    fontWeight: 400,
    lineHeight: 1.66,
  },

  overline: {
    fontSize: '0.75rem',
    fontWeight: 500,
    lineHeight: 2,
    textTransform: 'uppercase',
  },
};
```

## Complete Theme Configuration

### MUI Theme Setup

```typescript
// src/theme/theme.ts
import { createTheme, ThemeOptions } from '@mui/material/styles';
import { colors } from './colors';
import { typography } from './fonts';

const themeOptions: ThemeOptions = {
  palette: colors,
  typography: typography,
  spacing: 8, // Base spacing unit = 8px
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
};

export const theme = createTheme(themeOptions);
```

## Breakpoints and Responsive Design

### MUI Breakpoint System

```typescript
// Available breakpoints with defaults:
// xs: 0px
// sm: 600px
// md: 960px
// lg: 1280px
// xl: 1920px

// Usage in styling
export const useResponsiveStyles = makeStyles()(theme => ({
  container: {
    padding: theme.spacing(3),
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(2),
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: theme.spacing(2),
    [theme.breakpoints.down('lg')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
    },
  },
}));
```

## Shadows and Elevation

### Shadow System

```typescript
// MUI provides 25 shadow levels (0-24)
// Access via theme.shadows[n]

export const useShadowStyles = makeStyles()(theme => ({
  elevated: {
    boxShadow: theme.shadows[2], // Low elevation
  },
  card: {
    boxShadow: theme.shadows[4], // Medium elevation
  },
  modal: {
    boxShadow: theme.shadows[12], // High elevation
  },
}));
```

## Transitions and Animations

### Theme Transitions

```typescript
export const useTransitionStyles = makeStyles()(theme => ({
  smooth: {
    transition: theme.transitions.create(['background-color', 'color'], {
      duration: theme.transitions.duration.standard,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
  quick: {
    transition: theme.transitions.create('all', {
      duration: theme.transitions.duration.shortest,
    }),
  },
}));

// Common duration values:
// shortest: 150ms
// shorter: 200ms
// short: 250ms
// standard: 300ms
// complex: 375ms
// enteringScreen: 225ms
// leavingScreen: 195ms
```

## Z-Index System

### Standardized Z-Index Values

```typescript
export const zIndex = {
  mobileStepper: 1000,
  speedDial: 1050,
  appBar: 1100,
  drawer: 1200,
  navigationModal: 1300,
  fab: 1050,
  snackbar: 1400,
  tooltip: 1500,
  modal: 1300,
  popover: 1300,
  popper: 1300,
} as const;

// Usage
export const useZIndexStyles = makeStyles()(theme => ({
  appBar: {
    zIndex: zIndex.appBar,
  },
  modal: {
    zIndex: zIndex.modal,
  },
}));
```

## Spacing System

### Consistent Spacing

```typescript
// MUI spacing(n) = n * 8px
// spacing(1) = 8px
// spacing(2) = 16px
// spacing(3) = 24px
// spacing(4) = 32px

export const useSpacingStyles = makeStyles()(theme => ({
  section: {
    padding: theme.spacing(4), // 32px
  },
  subsection: {
    padding: theme.spacing(2, 3), // 16px vertical, 24px horizontal
  },
  tight: {
    margin: theme.spacing(1), // 8px
  },
}));
```

## Media Queries

### Utility Media Query Functions

```typescript
export const useMediaQueries = makeStyles()(theme => ({
  // Mobile first responsive
  mobileOnly: {
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  desktopOnly: {
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  tabletAndUp: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}));
```

## Key Conventions

1. **Color Palette** - All colors defined in colors.ts, never hardcoded
2. **Typography** - Use theme.typography.\* for font styles
3. **Spacing** - Always use theme.spacing() for consistent spacing
4. **Breakpoints** - Use theme.breakpoints.up/down for responsive design
5. **Shadows** - Use theme.shadows[n] for elevation
6. **Transitions** - Use theme.transitions.create() for animations
7. **Z-Index** - Use zIndex constant object for consistent layering
8. **No Magic Numbers** - All measurements derived from theme system
9. **Semantic Colors** - Use palette semantic colors (success, error, warning)
10. **Consistent Naming** - All theme utilities follow established naming

## Example: Theme Integration

```typescript
// src/theme/index.ts
export { theme } from './theme';
export { colors, semanticColors } from './colors';
export { typography, fontFamilies } from './fonts';

// Usage in App.tsx
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme/theme';

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      {/* Application content */}
    </ThemeProvider>
  );
};
```

## Custom Component Overrides

### Theme Component Customization

```typescript
// In theme.ts components section
components: {
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        textTransform: 'none',
      },
      contained: {
        '&:hover': {
          backgroundColor: theme.palette.primary.dark,
        },
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: theme.shape.borderRadius * 2,
      },
    },
  },
}
```
