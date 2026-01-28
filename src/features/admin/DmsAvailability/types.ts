import dayjs from 'dayjs';
import { TParsedAddress } from '../../booking/AppointmentFlow/Screens/YourLocation/types';
import { ETransportationType } from '../../../store/reducers/transportationNeeds/types';

export type TFormXTime = {
  opCode: string | null;
  advisor: string | null;
  transportation: {
    name: string | null;
    type: ETransportationType | null;
  } | null;
  pickUpAddress: string | null | TParsedAddress;
  dropOffAddress: string | null | TParsedAddress;
  make: string | null;
  model: string | null;
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
  date: [dayjs().subtract(1, 'month'), dayjs()],
};

export type TFormTekion = {
  advisor: string | null;
  pod: string | null;
  transportation: {
    name: string | null;
    type: ETransportationType | null;
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
  date: [dayjs().subtract(1, 'month'), dayjs()],
};
