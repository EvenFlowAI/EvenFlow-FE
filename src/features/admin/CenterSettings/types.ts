import { TOptContentData } from '../../../store/reducers/optimizationWindows/types';

export enum ECenterSettingType {
  ShowDropOffTime,
  DmsAppointmentTime,
}

export type TOptContent = {
  [k in ECenterSettingType]: TOptContentData;
};

export const centerSettingsList: ECenterSettingType[] = [
  ECenterSettingType.ShowDropOffTime,
  ECenterSettingType.DmsAppointmentTime,
];
