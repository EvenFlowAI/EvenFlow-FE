import {
  EDay,
  EDemandCategory,
} from "../../../../store/reducers/pricingSettings/types";
import { TForm } from "./types";

import { TSwitchButton } from "../../../../types/types";

export const buttons: TSwitchButton<number>[] = [
  { type: EDemandCategory.Low, label: "Low" },
  { type: EDemandCategory.Average, label: "Average" },
  { type: EDemandCategory.High, label: "High" },
];

export const initialDay: EDemandCategory = EDemandCategory.Average;

export const initialForm: TForm = Object.values(EDay).reduce((acc, item) => {
  acc[item as EDay] = initialDay;
  return acc;
}, {} as TForm);
