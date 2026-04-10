---
applyTo: "src/types/**/*.{ts,tsx},src/utils/**/*.{ts,tsx},src/config/**/*.{ts,tsx}"
---

# EvenFlow Types and Utility Rules

- Keep cross-feature contracts in `src/types/` and feature-local contracts near their feature.
- Follow existing naming conventions (`I*` interfaces, `E*` enums, established `T*` aliases).
- Utilities should be stateless and reusable; avoid side effects and framework coupling.
- Prefer existing helper modules before creating duplicate utility functions.
- Keep date logic aligned with dayjs helpers and existing parsable date types.
- Maintain strong typing for utility inputs/outputs and avoid `any` unless unavoidable.

