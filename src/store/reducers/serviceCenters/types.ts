import {IAddress} from "../dealershipGroups/types";

export interface IServiceCenter {
    id: number;
    name: string;
    address: IAddress;
    mainAddress: string;
    avatarPath: string;
}