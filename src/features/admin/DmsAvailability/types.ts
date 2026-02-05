import dayjs from 'dayjs';
import { TParsedAddress } from '../../booking/AppointmentFlow/Screens/YourLocation/types';
import { ETransportationType } from '../../../store/reducers/transportationNeeds/types';

export type TFormXTime = {
  opCode: {
    name: string | null;
    id: number | null;
  } | null;
  advisor: {
    name: string | null;
    id: number | null;
  } | null;
  transportation: {
    name: string | null;
    type: ETransportationType | null;
    id: number | null;
  } | null;
  pickUpAddress: string | null | TParsedAddress;
  dropOffAddress: string | null | TParsedAddress;
  make: {
    name: string | null;
    id: number | null;
  } | null;
  model: {
    name: string | null;
    id: number | null;
  } | null;
  year: string | null;
  date: [dayjs.Dayjs | null, dayjs.Dayjs | null];
};

export const defaultFormXTime: TFormXTime = {
  opCode: null,
  advisor: null,
  transportation: null,
  pickUpAddress: null,
  dropOffAddress: null,
  make: null,
  model: null,
  year: null,
  date: [dayjs(), dayjs().add(6, 'days')],
};

export type TFormTekion = {
  advisor: {
    name: string | null;
    id: number | null;
  } | null;
  pod: {
    name: string | null;
    id: number | null;
  } | null;
  transportation: {
    name: string | null;
    type: ETransportationType | null;
    id: number | null;
  } | null;
  pickUpAddress: string | null | TParsedAddress;
  dropOffAddress: string | null | TParsedAddress;
  date: [dayjs.Dayjs | null, dayjs.Dayjs | null];
};

export const defaultFormTekion: TFormTekion = {
  advisor: null,
  pod: null,
  transportation: null,
  pickUpAddress: null,
  dropOffAddress: null,
  date: [dayjs(), dayjs().add(6, 'days')],
};
