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

export const urlToFile = async (
  url: string | undefined,
  fileNameFallback = 'defaultLogo.svg'
): Promise<File | null> => {
  if (!url) return null;
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const name = url.split('/').pop() || fileNameFallback;
    return new File([blob], name, { type: blob.type || 'image/svg+xml' });
  } catch {
    return null;
  }
};
