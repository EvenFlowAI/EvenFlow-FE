import {IDealershipGroupExtended} from "../dealershipGroups/types";
import {IServiceCenter} from "../serviceCenters/types";
import {TChangePageDataGeneric, TChangePagingGeneric} from "../utils";

export interface IEmployeeInfo {
    hourlyRate: number;
    overtimeRate: number;
    skillLevel: number;
    certifications: string[];
}

export interface IEmployee {
    dealership?: IDealershipGroupExtended;
    serviceCenter: IServiceCenter;
    employeeInfo: IEmployeeInfo;
    id: string;
    fullName: string;
    dealershipId: number;
    serviceCenterId: number;
    userName: string;
    email: string;
    role: string;
    phoneNumber: string;
    avatarPath: string;
}

export type TGetAll = {type: "Employees/GetAll"; payload: IEmployee[]};
export type TLoading = {type: "Employees/Loading"; payload: boolean};
export type TSaving = {type: "Employees/Saving"; payload: boolean};
export type TChangePaging = TChangePagingGeneric<"Employees/ChangePaging">;
export type TChangePageData = TChangePageDataGeneric<"Employees/ChangePageData">;

export type TEmployeeActions =
    | TSaving
    | TLoading
    | TChangePageData
    | TChangePaging
    | TGetAll;