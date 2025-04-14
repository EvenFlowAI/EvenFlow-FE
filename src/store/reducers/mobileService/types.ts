import { EServiceType } from '../appointmentFrameReducer/types';
import { IDistancePriceSettings, IZonePriceSettings } from '../serviceValet/types';
import { TGeographicZoneShort } from '../../../types/types';
import { ICenterSettings } from '../capacityServiceValet/types';
export type TZipCode = {
  code: string;
  id: number;
};

export type TZoneNew = {
  name: string;
  zipCodes: string[];
  serviceType?: EServiceType;
  serviceCenterId: number;
};

export type TZoneUpdate = {
  name: string;
  zipCodes: string[];
  serviceType: EServiceType;
  id: number;
};

export type TZone = {
  name: string;
  id: number;
  zipCodes: TZipCode[];
  serviceType: EServiceType;
};

export type TReassignZip = {
  id: number;
  geographicZoneId: number;
};

export type TZonesServiceType = 'serviceValet' | 'mobileService';

export enum EAncillaryPriceType {
  Zone,
  Distance,
}

export type TAncillaryPriceTypeData = {
  serviceCenterId: number;
  serviceType: EServiceType;
};

export type TChangeAncillaryPriceType = {
  serviceType: EServiceType;
  ancillaryPriceType: EAncillaryPriceType;
};

export type TState = {
  isLoading: boolean;
  currentZone: TZone | null;
  zones: TZone[];
  pricingByZones: IZonePriceSettings[];
  pricingByDistance: IDistancePriceSettings[];
  isPricingByZoneLoading: boolean;
  ancillaryPriceType: EAncillaryPriceType;
  mobileZonesShort: TGeographicZoneShort[];
  centerSettings: ICenterSettings | null;
};
