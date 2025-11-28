// Constants
export const DEFAULT_SIDEBAR_HEX = '252525';
export const MAX_FILE_SIZE_MB = 2;
export const ACCEPTED_EXTENSIONS = ['image/png', 'image/svg+xml'];

// Validation helpers
export const normalizeHex = (value: string) =>
  value
    .replace(/[^0-9a-fA-F]/g, '')
    .toUpperCase()
    .slice(0, 6);
export const isValidFullHex = (value: string) => /^([0-9A-F]{6})$/.test(value);
