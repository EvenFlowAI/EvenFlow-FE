import {EServiceType} from "../appointmentFrameReducer/types";

export interface IFirstScreenOption {
    id: number;
    name: string;
    iconPath?: string;
    type: EServiceType;
    orderIndex: number;
    description?: string;
    note?: string;
    transportationOptionId?: number;
    externalLink?: string;
}

export type TUpdateFirstScreenOption = {
    name: string;
    type: EServiceType|string;
    orderIndex: number;
    description?: string;
    note?: string;
    transportationOptionId?: number;
    externalLink?: string;
}

export type TNewFirstScreenOption = TUpdateFirstScreenOption & {
    serviceCenterId: number;
}