// Constants
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

  // Helper: infer mime/type from URL extension
  const inferTypeFromUrl = (u: string): string | null => {
    const lower = u.toLowerCase();
    if (lower.endsWith('.png')) return ACCEPTED_EXTENSIONS[0];
    if (lower.endsWith('.svg') || lower.includes(ACCEPTED_EXTENSIONS[1]))
      return ACCEPTED_EXTENSIONS[1];
    return null;
  };

  // Helper: ensure filename has proper extension for type
  const ensureExtensionForType = (name: string, type: string): string => {
    const lower = name.toLowerCase();
    if (type === ACCEPTED_EXTENSIONS[0] && !lower.endsWith('.png')) {
      return `${name.replace(/\.(svg|png)$/i, '')}.png`;
    }
    if (type === ACCEPTED_EXTENSIONS[1] && !lower.endsWith('.svg')) {
      return `${name.replace(/\.(svg|png)$/i, '')}.svg`;
    }
    return name;
  };

  try {
    const res = await fetch(url);
    const blob = await res.blob();

    const serverType = blob.type && ACCEPTED_EXTENSIONS.includes(blob.type) ? blob.type : null;
    const inferredType = inferTypeFromUrl(url);
    const finalType = serverType ?? inferredType ?? ACCEPTED_EXTENSIONS[1]; // default to svg

    const rawName = url.split('/').pop() || fileNameFallback;
    const nameWithExt = ensureExtensionForType(rawName, finalType);

    return new File([blob], nameWithExt, { type: finalType });
  } catch {
    return null;
  }
};
