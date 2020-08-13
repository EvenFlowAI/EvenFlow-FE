import {IDealershipGroupExtended} from "../dealershipGroups/types";
import {IServiceCenter} from "../serviceCenters/types";
import {changePagingGeneric, TChangePagingGeneric} from "../utils";

export interface IEmployeeInfo {
    hourlyRate: number;
    overtimeRate: number;
    skillLevel: number;
    certifications: string[];
}

export interface IEmployee {
    dealership: IDealershipGroupExtended;
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
export type TChangePaging = TChangePagingGeneric<"Employees/ChangePaging">;

export type TEmployeeActions =
    | TChangePaging
    | TGetAll;