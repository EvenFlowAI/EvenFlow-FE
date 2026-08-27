import dayjs from 'dayjs';
import {
  customerSegments,
  dayOfWeek,
  ECustomerPresence,
  ECustomerSegment,
  EDayOfWeek,
  EOfferType,
  IOffer,
  IOfferForm,
} from '../../../../store/reducers/offers/types';
import { time12HourSeconds, timeSpanString } from '../../../../utils/constants';
import { selectAllSR, TOfferForm } from '../types';
import { TEnumMap } from '../../../../store/reducers/types';
import { IAssignedServiceRequestShort } from '../../../../store/reducers/serviceRequests/types';

export const initialOfferForm: TOfferForm = {
  offerValue: undefined,
  offerTitle: undefined,
  offerType: EOfferType.AmountOff,
  serviceRequests: [selectAllSR],
  serviceCategories: [],
  customerSegments: [customerSegments[0]],
  customerPresence: ECustomerPresence.Both,
  dayOfWeek: [dayOfWeek[0]],
  timeOfDayFrom: dayjs('00:00:00', time12HourSeconds),
  timeOfDayTo: dayjs('23:59:59', time12HourSeconds),
  isProductPageOn: false,
};

export const mapOfferToForm = (payload: IOffer): TOfferForm => ({
  offerTitle: payload.title,
  offerValue: String(payload.value),
  offerType: payload.type,
  serviceRequests: payload.isAllServiceRequestsIncluded ? [selectAllSR] : payload.serviceRequests,
  customerSegments: payload.customerSegments
    .map(s => customerSegments.find(seg => seg.id === s))
    .filter(el => el !== undefined) as TEnumMap<ECustomerSegment>[],
  customerPresence: payload.customerPresence,
  dayOfWeek: payload.dayOfWeeks.reduce((acc, el) => {
    const dof = dayOfWeek.find(e => e.id === el);
    if (dof) acc.push(dof);
    return acc;
  }, [] as TEnumMap<EDayOfWeek>[]),
  durationFrom: dayjs(payload.duration.start),
  durationTo: dayjs(payload.duration.end),
  timeOfDayFrom: dayjs(payload.timeOfDay.start, timeSpanString),
  timeOfDayTo: dayjs(payload.timeOfDay.end, timeSpanString),
  serviceType: payload.serviceType?.name,
  serviceCategories: payload.serviceCategories,
});

export const normalizeSegments = (
  current: TEnumMap<ECustomerSegment>[],
  value: TEnumMap<ECustomerSegment>[]
): TEnumMap<ECustomerSegment>[] => {
  if (current.find(d => d.id === ECustomerSegment.All) && value.length > 1) {
    return value.filter(s => s.id !== ECustomerSegment.All);
  }
  if (value.find(s => s.id === ECustomerSegment.All)) {
    return [customerSegments[0]];
  }
  return value;
};

export const normalizeDaysOfWeek = (
  current: TEnumMap<EDayOfWeek>[],
  value: TEnumMap<EDayOfWeek>[]
): TEnumMap<EDayOfWeek>[] => {
  if (current.find(d => d.id === EDayOfWeek.EveryDay) && value.length > 1) {
    return value.filter(e => e.id !== EDayOfWeek.EveryDay);
  }
  if (value.find(d => d.id === EDayOfWeek.EveryDay)) {
    return [dayOfWeek[0]];
  }
  return value;
};

export const normalizeServiceRequests = (
  current: IAssignedServiceRequestShort[],
  value: IAssignedServiceRequestShort[]
): IAssignedServiceRequestShort[] => {
  if (current.find(sr => sr.id === 0) && value.length > 1) {
    return value.filter(e => e.id !== 0);
  }
  if (value.find(sr => sr.id === 0)) {
    return [selectAllSR];
  }
  return value;
};

export const validateOfferForm = (
  form: TOfferForm,
  showError: (message: string) => void
): boolean => {
  let valid = true;

  if (!form.offerTitle?.length) {
    valid = false;
    showError('"Offer Title" must not be empty');
  }
  if (!form.offerValue?.length) {
    valid = false;
    showError('"Offer Value" must be greater than "0"');
  }
  if (!form.customerSegments.length) {
    valid = false;
    showError('"Customer Segment" must not be empty');
  }
  if (!form.serviceRequests.length) {
    valid = false;
    showError('"Service Request" must not be empty');
  }
  if (!form.dayOfWeek.length) {
    valid = false;
    showError('"Day of Week" must not be empty');
  }
  if (!form.durationFrom) {
    valid = false;
    showError('"Start Date" must not be empty');
  }
  if (!form.durationTo) {
    valid = false;
    showError('"End Date" must not be empty');
  }
  if (!form.timeOfDayFrom) {
    valid = false;
    showError('"Start Time" must not be empty');
  }
  if (!form.timeOfDayTo) {
    valid = false;
    showError('"End Time" must not be empty');
  }

  return valid;
};

export const buildOfferPayload = (
  form: TOfferForm,
  serviceCenterId: number,
  payloadId?: number
): IOfferForm => ({
  id: payloadId,
  title: form.offerTitle || '',
  value: Number(form.offerValue),
  serviceCenterId,
  type: form.offerType,
  customerPresence: form.customerPresence,
  customerSegments: form.customerSegments.map(s => s.id),
  dayOfWeeks: form.dayOfWeek.map(d => d.id),
  duration: {
    start: form.durationFrom?.toISOString(),
    end: form.durationTo?.toISOString(),
  },
  timeOfDay: {
    start: dayjs(form.timeOfDayFrom, time12HourSeconds).format(timeSpanString),
    end: dayjs(form.timeOfDayTo, time12HourSeconds).format(timeSpanString),
  },
  isAllServiceRequestsIncluded: Boolean(form.serviceRequests.find(sr => sr.id === 0)),
  serviceRequests: form.serviceRequests.find(sr => sr.id === 0)
    ? null
    : form.serviceRequests.map(s => s.id),
  serviceType: form.serviceType ? { name: form.serviceType } : undefined,
});
