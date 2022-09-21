import {EServiceType} from "../appointmentFrameReducer/types";

export type TZipCode = {
    code: string;
    id: number;
}

export type TZoneNew = {
    name: string;
    zipCodes: string[];
    serviceType?: EServiceType;
    serviceCenterId: number;
}

export type TZoneUpdate = {
    name: string;
    zipCodes: string[];
    serviceType: EServiceType;
    id: number;
}

export type TZone = {
    name: string;
    id: number;
    zipCodes: TZipCode[];
    serviceType: EServiceType;
}

export type TReassignZip = {
    id: number;
    geographicZoneId: number;
}

export type TZonesServiceType = "serviceValet" | "mobileService";

export enum EAncillaryPriceType {
    Zone,
    Distance
}

export type TAncillaryPriceTypeData = {
    serviceCenterId: number;
    serviceType: EServiceType;
}

export type TChangeAncillaryPriceType = {
    serviceType: EServiceType;
    ancillaryPriceType: EAncillaryPriceType;
}
