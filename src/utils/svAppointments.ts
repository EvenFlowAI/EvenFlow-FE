import {
  IRemappedAppointmentSlot,
  IServiceValetAppointment,
} from '../store/reducers/appointment/types';
import dayjs from 'dayjs';
import { TParsableDate } from '../types/types';

export const sortSVAppointments = (a: IServiceValetAppointment, b: IServiceValetAppointment) => {
  return dayjs(a.date).isAfter(b.date) ? 1 : -1;
};

export const sortAppointments = (a: IRemappedAppointmentSlot, b: IRemappedAppointmentSlot) => {
  return dayjs(a.date).isAfter(b.date) ? 1 : -1;
};

export const getClearDate = (d: TParsableDate) => {
  const utcOffset = dayjs().utcOffset();
  return utcOffset > 0
    ? dayjs(d).subtract(utcOffset, 'minutes')
    : dayjs(d).add(Math.abs(utcOffset), 'minutes');
};

export const getClearSVDate = (d: TParsableDate) => {
  const utcOffset = dayjs(d).utcOffset();
  return utcOffset > 0
    ? dayjs(d).subtract(utcOffset, 'minutes')
    : dayjs(d).add(Math.abs(utcOffset), 'minutes');
};

export const checkVin = (vin: string) => {
  return (
    vin && vin.length === 17 && (vin.includes('~') || vin.match(/[(A-H|J-N|P|R-Z|0-9)]{17}/gm))
  );
};
