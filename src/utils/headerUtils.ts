export const getFileNameFromContentDisposition = (contentDisposition?: string): string | null => {
  if (!contentDisposition) return null;

  const utf8NameMatch = contentDisposition.match(/filename\*=(?:UTF-8'')?([^;]+)/i);
  if (utf8NameMatch?.[1]) {
    const encodedFileName = utf8NameMatch[1].replace(/["']/g, '').trim();
    try {
      return decodeURIComponent(encodedFileName);
    } catch {
      return encodedFileName;
    }
  }

  const plainNameMatch = contentDisposition.match(/filename="?([^;"]+)"?/i);
  if (plainNameMatch?.[1]) {
    return plainNameMatch[1].trim();
  }

  return null;
};
