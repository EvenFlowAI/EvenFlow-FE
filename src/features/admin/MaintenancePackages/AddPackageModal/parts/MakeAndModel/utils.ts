export const upperCase = (array: string[]): string[] => {
  return array.map(item => item.toUpperCase());
};

export const removeDuplicates = (array: string[]): string[] => {
  return Array.from(new Set(array));
};

export const removeDuplicatesV2 = (array: number[]): number[] => {
  return Array.from(new Set(array));
};
