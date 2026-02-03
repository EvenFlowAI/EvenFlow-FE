import { TFormTekion, TFormXTime } from '../types';
import { ETransportationType } from '../../../../store/reducers/transportationNeeds/types';

import dayjs from 'dayjs';

function isValidDateRange(dateRange: [dayjs.Dayjs | null, dayjs.Dayjs | null]): boolean {
  const [start, end] = dateRange;

  if (!start || !end) return false;

  if (!dayjs(start).isValid() || !dayjs(end).isValid()) return false;

  if (end.isBefore(start)) return false;

  const diff = end.diff(start, 'day');
  return diff <= 6;
}

export function validateXTime(formXTime: TFormXTime): boolean {
  const isBaseValid =
    formXTime.opCode?.name?.length &&
    isValidDateRange(formXTime.date) &&
    formXTime.make?.name?.length &&
    formXTime.model?.name?.length &&
    formXTime.year?.length;

  if (!isBaseValid) return false;

  if (formXTime.transportation?.type === ETransportationType.PickUpDelivery) {
    return !!(formXTime.pickUpAddress && formXTime.dropOffAddress);
  }

  return true;
}

export function validateTekion(formTekion: TFormTekion): boolean {
  const isBaseValid =
    formTekion.advisor?.name?.length &&
    formTekion.pod?.name?.length &&
    formTekion.transportation?.name &&
    isValidDateRange(formTekion.date);

  if (!isBaseValid) return false;

  if (formTekion.transportation?.type === ETransportationType.PickUpDelivery) {
    return !!(formTekion.pickUpAddress && formTekion.dropOffAddress);
  }

  return true;
}
