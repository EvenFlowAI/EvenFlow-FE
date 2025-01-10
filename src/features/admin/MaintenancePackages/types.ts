import { EMaintenanceOptionType } from "../../../api/types";

export type TExpandedState = {
  id?: number;
  isOpen?: boolean;
};

export type TOption = {
  value: EMaintenanceOptionType;
  name: string;
};

export type TSummaryCell = {
  isEditable: boolean;
  optionType: number;
  numberValue: string;
  fieldName: string;
  error?: boolean;
};

export type TCellData = {
  isSelected: boolean;
  optionType: number;
};

export type TRequestRow = {
  requestId: number;
  cellData: TCellData[];
};

export type TSelectedOption = {
  type: string | number;
  name: string;
};
