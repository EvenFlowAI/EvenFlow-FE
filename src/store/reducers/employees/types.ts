import {IDealershipGroupExtended} from "../dealershipGroups/types";
import {IServiceCenter} from "../serviceCenters/types";
import {TChangePageDataGeneric, TChangePagingGeneric} from "../utils";

export interface IEmployeeInfo {
    hourlyRate: number;
    overtimeRate: number;
    skillLevel: number;
    certifications?: string[];
}

export interface IEmployee {
    dealership?: IDealershipGroupExtended;
    serviceCenter?: IServiceCenter;
    employeeInfo?: IEmployeeInfo;
    id: string;
    fullName: string;
    firstName: string;
    lastName: string;
    dealershipId: number;
    serviceCenterId: number;
    userName: string;
    email: string;
    role: string;
    phoneNumber: string;
    avatarPath?: string;
}

export interface IEmployeeForm {
    firstName: string;
    lastName: string;
    serviceCenterId: number | null;
    email?: number;
    phoneNumber?: string;
    employeeInfo?: IEmployeeInfo
}

export type TGetAll = {type: "Employees/GetAll"; payload: IEmployee[]};
export type TGetDealershipEmployees = {type: "Employees/GetDealershipEmployees", payload: IEmployee[]};
export type TLoading = {type: "Employees/Loading"; payload: boolean};
export type TLoadingDealership = {type: "Employees/LoadingDealership"; payload: boolean};
export type TSaving = {type: "Employees/Saving"; payload: boolean};
export type TCreate = {type: "Employees/Create"; payload: IEmployee};
export type TLoadingTechnicians = {type: "Employees/LoadingTechnicians", payload: boolean};
export type TGetTechnicians = {type: "Employees/GetTechnicians", payload: IEmployee[]};
export type TChangeDPaging = TChangePagingGeneric<"Employees/ChangeDPaging">;
export type TChangePaging = TChangePagingGeneric<"Employees/ChangePaging">;
export type TChangePageData = TChangePageDataGeneric<"Employees/ChangePageData">;

export type TEmployeeActions =
    | TGetDealershipEmployees
    | TLoadingTechnicians
    | TGetTechnicians
    | TSaving
    | TCreate
    | TLoading
    | TLoadingDealership
    | TChangeDPaging
    | TChangePageData
    | TChangePaging
    | TGetAll;