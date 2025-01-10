import { EAppointmentTimingType } from '../../../../../store/reducers/appointment/types';

export type TCard = {
  description: string;
  name: EAppointmentTimingType;
  icon: JSX.Element;
};
