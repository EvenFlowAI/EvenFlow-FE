import { IServiceCenter } from "../../../../store/reducers/serviceCenters/types";

export const getServiceCentersNames = (
  items: IServiceCenter[] | undefined,
): string => {
  let string = "";
  if (items?.length) {
    const names = items.map((el) => el.name);

    names.forEach((name, index) => {
      string += index < names.length - 1 ? `${name}, ` : name;
    });
  }
  return string;
};
