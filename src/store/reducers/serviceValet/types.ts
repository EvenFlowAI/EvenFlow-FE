import {EServiceType} from "../appointmentFrameReducer/types";

export interface IZonePriceSettings {
    geographicZoneName: string;
    geographicZoneId: number;
    flatFee: number;
    serviceMultiplier: number;
    id: number,
}

export interface IZonePricingUpdate {
    flatFee: number;
    serviceMultiplier: number;
}

export interface IDistancePriceSettings {
    id: number;
    minValue: number;
    maxValue: number;
    costPerMile: number;
    serviceMultiplier: number;
    orderIndex: number;
    serviceType: EServiceType;
    serviceCenterId?: number;
}

export interface TDistanceRange {
    minValue: number;
    maxValue: number;
    costPerMile: number;
    serviceMultiplier?: number;
    serviceType?: EServiceType;
    serviceCenterId?: number;
}

export interface TDistanceRangeUpdate extends TDistanceRange {
    id: number;
}