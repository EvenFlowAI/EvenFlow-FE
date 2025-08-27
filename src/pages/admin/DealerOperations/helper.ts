export function numberToOrdinalWord(num: number): string {
  switch (num) {
    case 1:
      return 'First';
    case 2:
      return 'Second';
    case 3:
      return 'Third';
    case 4:
      return 'Fourth';
    case 5:
      return 'Fifth';
    case 6:
      return 'Sixth';
    case 7:
      return 'Seventh';
    case 8:
      return 'Eighth';
    case 9:
      return 'Ninth';
    case 10:
      return 'Tenth';
    default:
      return num.toString();
  }
}

export const validateGroup = <T>(arr: T[], validator: (el: T) => boolean): boolean => {
  return arr.length === 0 || arr.every(validator);
};
