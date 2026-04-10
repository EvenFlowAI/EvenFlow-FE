---
applyTo: "src/theme/**/*.{ts,tsx},src/hooks/styling/**/*.{ts,tsx},src/**/styles.ts,src/**/styles.tsx"
---

# EvenFlow Styling Rules

- Prefer TSS React (`makeStyles` from `tss-react/mui`) for reusable style modules.
- Build styles from theme tokens (`theme.palette`, `theme.spacing`, `theme.breakpoints`, `theme.typography`).
- Reuse design tokens from `src/theme/` before introducing new raw values.
- Keep responsive behavior aligned with existing MUI breakpoint patterns.
- Use `sx` only for small local cases; prefer extracted style hooks for reusable or complex UI.
- Follow existing class naming style (`camelCase`) and avoid ad hoc inline `style` objects.

