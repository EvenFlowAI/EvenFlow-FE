import {
  Indicators,
  IValueSettings,
} from "../../../store/reducers/valueSettings/types";
import { TableCellProps } from "@mui/material";

export type TRow = {
  id: Indicators;
  title: string;
  tab: string;
  idx?: string;
};

export type TData = {
  [K in Indicators]: IValueSettings;
};

export type TColumn = {
  label: string;
  id: number;
  width: string;
  cellProps?: TableCellProps;
};

export enum SliderRange {
  Max = 10,
  Min = -10,
}
