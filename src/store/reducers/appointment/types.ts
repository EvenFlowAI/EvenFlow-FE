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