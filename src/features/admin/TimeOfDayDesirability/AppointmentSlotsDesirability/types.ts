import { ETimeSlotType } from '../../../../store/reducers/slotScoring/types';
import { TSlot } from '../utils';

export type TForm = {
  timeSlotType: ETimeSlotType;
  items: TSlot[];
};

export type TGap = {
  label: string;
  type: ETimeSlotType;
};

export enum EDesirabilityDays {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}
