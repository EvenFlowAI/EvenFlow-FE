import {IAddress} from "../dealershipGroups/types";

export interface IServiceCenterProfile {
    id: number;
    name: string;
    serviceCenterEmail: string;
    contactPersonalEmail: string;
    phoneNumber: string;
    avatarPath: string;
    address: IAddress;
    dealershipId: number;
}
export interface ISR {
    id: number;
    code: string;
    description?: string;
}
export type TS1Form = {
    year: string|null;
}