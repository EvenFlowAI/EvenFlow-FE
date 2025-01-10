type TStyleProp = {
  backgroundColor?: string;
  fontSize?: number;
};
export const getTitleStyle = (
  index: number,
  isBMWService: boolean,
): TStyleProp => {
  let style: TStyleProp = {};
  switch (index) {
    case 0:
      style = { backgroundColor: "#C0C0C0" };
      break;
    case 1:
      style = { backgroundColor: "#B18965" };
      break;
    default:
      style = { backgroundColor: "#E3CD59" };
  }
  if (isBMWService) style.fontSize = 16;
  return style;
};
