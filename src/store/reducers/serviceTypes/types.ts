import {EServiceType} from "../appointmentFrameReducer/types";

export interface IServiceType {
    id: number;
    name: string;
    iconPath?: string;
    type: EServiceType;
    orderIndex?: number;
    description?: string;
}

export type TUpdateServiceTypeData = {
    name: string;
    type: EServiceType;
    orderIndex?: number;
    description?: string;
}

export type TNewServiceType = TUpdateServiceTypeData & {
    serviceCenterId: number;
}