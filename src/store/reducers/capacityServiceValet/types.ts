import { EPricingDisplayType } from '../pricingSettings/types';
import { TIdAndName } from '../../../types/types';

export enum EDaysFromMonday {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
}

export interface IZonesRoutingByDay {
  dayOfWeek: EDaysFromMonday;
  geographicZoneIds: number[];
}

export interface ITimeRangeAndCapacity {
  serviceCenterId: number;
  id?: number;
  dayOfWeek?: number;
  pickUpMin: string | null;
  pickUpMax: string | null;
  dropOffMin: string | null;
  dropOffMax: string | null;
  capacity: number | null;
}

export interface ICenterSettingsSR {
  id: number;
  code: string;
  description: string;
  price: number;
  pricingDisplayType: EPricingDisplayType;
}
export type TDefaultOpsCode = {
  id: number;
  code: string;
  description?: string;
  price?: number;
  orderIndex?: number;
};

export interface ISVZoneDefaultOpsCode {
  zone: TIdAndName;
  serviceRequest: TDefaultOpsCode;
}

export interface ICenterSettings {
  showDropOffTime: boolean;
  dropOffTimeDescription?: string;
  dmsAppointmentTime?: string;
  serviceRequest?: ICenterSettingsSR;
  zoneServiceRequests: ISVZoneDefaultOpsCode[];
  appointmentLeadDays: number;
  syncAppointmentNativeTime: boolean;
}

export interface IShowDropOffTime {
  showDropOffTime: boolean;
  description?: string;
}

export type TDmsAppointmentTime = {
  dmsAppointmentTime: string;
};

export type TServiceValetRequestId = {
  serviceRequestId: number;
};

export interface InitialState {
  zonesRouting: IZonesRoutingByDay[];
  timeRangesAndCapacity: ITimeRangeAndCapacity[];
  isLoading: boolean;
  centerSettings: ICenterSettings | null;
}

export type TZonesOpsCodesRequest = {
  zoneId: number;
  serviceRequestId: number;
};
