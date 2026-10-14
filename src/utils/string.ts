export const normalizeWhitespace = (value: string): string => {
  return value.trim().replace(/\s+/g, ' ');
};

/**
 * Trims leading/trailing spaces and collapses inner whitespace into a single space.
 * Nullish values and values containing only whitespace are treated as empty ('').
 */
export const normalizeOptionalWhitespace = (value?: string | null): string => {
  return value ? normalizeWhitespace(value) : '';
};
