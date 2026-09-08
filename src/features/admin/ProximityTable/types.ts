import { EProximityType } from '../../../store/reducers/slotScoring/types';

export type TRow = {
  id: EProximityType;
  label: string;
};

export enum SliderRange {
  Min = 0,
  Max = 10,
  Default = 0,
}
export type TProximity = {
  point: number;
};
export type TForm = {
  [T in EProximityType]: TProximity;
};
