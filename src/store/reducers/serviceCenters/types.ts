import {IAddress, IDealershipGroupShort} from "../dealershipGroups/types";
import {TChangePageDataGeneric, TChangePagingGeneric} from "../utils";

export interface IServiceCenter {
    id: number;
    name: string;
    address: IAddress;
    mainAddress: string;
    avatarPath: string;
}
export interface IServiceCenterExtended extends IServiceCenter {
    countOfManagers: number;
    countOfTechnician: number;
    countOfEmployees: number;
    countOfBays: number;
    dealership: IDealershipGroupShort;
    serviceCenterEmail: string;
    contactPersonalEmail: string;
    phoneNumber: string;
    dealershipId: number;
}
export interface IServiceCenterForm {
    name: string,
    serviceCenterEmail: string,
    contactPersonalEmail: string,
    phoneNumber: string,
    address: IAddress
}

export type TGetAll = {type: "ServiceCenters/GetAll", payload: IServiceCenterExtended[]};
export type TGetShort = {type: "ServiceCenters/GetShort", payload: IServiceCenter[]};
export type TShortLoading = {type: "ServiceCenters/ShortLoading", payload: boolean};
export type TCreate = {type: "ServiceCenters/Create", payload: IServiceCenterExtended}
export type TLoading = {type: "ServiceCenters/Loading", payload: boolean};
export type TSaving = {type: "ServiceCenters/Saving", payload: boolean};
export type TChangePageData = TChangePageDataGeneric<"ServiceCenters/ChangePageData">;
export type TChangePaging = TChangePagingGeneric<"ServiceCenters/ChangePaging">;

export type TServiceCenterActions =
    | TCreate
    | TLoading
    | TSaving
    | TChangePageData
    | TChangePaging
    | TGetShort
    | TShortLoading
    | TGetAll;