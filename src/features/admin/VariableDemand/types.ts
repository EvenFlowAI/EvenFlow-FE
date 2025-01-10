export type TMPackage = {
  low: number;
  high: number;
  id: number;
  name: string;
  optionName: string;
  optionId: number;
};

export type TOpsCode = {
  opsCode: string;
  low: number;
  high: number;
  id: number;
};

export type SliderValues = {
  [key: string]: number;
};

export type SliderObject = {
  [key: string]: SliderValues;
};

export enum SliderRange {
  Min = -10,
  Max = 10,
}
