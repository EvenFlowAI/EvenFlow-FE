import {EServiceType} from "../appointmentFrameReducer/types";

export type TZipCode = {
    code: number;
    id: number;
}

export type TZoneNew = {
    name: string;
    zipCodes: number[];
    serviceType?: EServiceType;
    serviceCenterId: number;
}

export type TZoneUpdate = {
    name: string;
    zipCodes: number[];
    serviceType: EServiceType;
    id: number;
}

export type TZone = {
    name: string;
    id: number;
    zipCodes: TZipCode[];
    serviceType: EServiceType;
}

export type TZonesServiceType = "serviceValet" | "mobileService";
