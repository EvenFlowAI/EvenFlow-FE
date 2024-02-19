import {IDealershipGroupExtended} from "../dealershipGroups/types";
import {IServiceCenter} from "../serviceCenters/types";
import {IAdvisorShort} from "../users/types";
import {TChangePageDataGeneric, TChangePagingGeneric} from "../types";
import {IOrder, IPageRequest, IPagingResponse, TParsableDate} from "../../../types/types";

export interface IEmployeeInfo {
    hourlyRate: number;
    overtimeRate: number;
    skillLevel: number;
    certifications?: string[];
}

export interface IEmployee {
    dealership?: IDealershipGroupExtended;
    serviceCenter?: IServiceCenter;
    serviceCenters?: IServiceCenter[];
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
    position?: string;
    showOnBooking?: boolean;
    dmsId?: string | number;
}

export interface IEmployeeFilters {
    role?: string;
    dealershipId?: number;
    serviceCenterId?: number|null;
    searchTerm?: string;
}

export interface IEmployeeForm {
    firstName: string;
    lastName: string;
    serviceCenterId?: number | null;
    email?: string;
    phoneNumber?: string;
    employeeInfo?: IEmployeeInfo,
    dmsId: string | null;
}

export type TGetAll = {type: "Employees/GetAll"; payload: IEmployee[]};
export type TGetDealershipEmployees = {type: "Employees/GetDealershipEmployees", payload: IEmployee[]};
export type TLoading = {type: "Employees/Loading"; payload: boolean};
export type TLoadingDealership = {type: "Employees/LoadingDealership"; payload: boolean};
export type TSaving = {type: "Employees/Saving"; payload: boolean};
export type TCreate = {type: "Employees/Create"; payload: IEmployee};
export type TLoadingTechnicians = {type: "Employees/LoadingTechnicians", payload: boolean};
export type TGetTechnicians = {type: "Employees/GetTechnicians", payload: IEmployee[]};
export type TChangeFilters = {type: "Employees/ChangeFilters", payload: IEmployeeFilters};
export type TChangeDPaging = TChangePagingGeneric<"Employees/ChangeDPaging">;
export type TChangePaging = TChangePagingGeneric<"Employees/ChangePaging">;
export type TChangePageData = TChangePageDataGeneric<"Employees/ChangePageData">;
export type TLoadingDMSAdvisors = { type: "SCEmployees/LoadingDMSAdvisors", payload: boolean };
export type TGetUsersShort = {type: "Employees/GetUsersShort", payload: IAdvisorShort[]};
export type TGetCalendarData = {type: "Employees/GetCalendarData", payload: ICalendarItem[]};
export type TGetScheduleByDate = {type: "Employees/GetScheduleByDate", payload: IScheduleByDate|null};

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
    | TChangeFilters
    | TGetAll
    | TLoadingDMSAdvisors
    | TGetUsersShort
    | TGetCalendarData
    | TGetScheduleByDate;

export type TDmsAdvisor = {
    id: string;
    name: string;
}
export type TEmployeesState = {
    employeesList: IEmployee[];
    dealershipEmployeesList: IEmployee[];
    techniciansList: IEmployee[];
    searchTerm: string;
    order: IOrder<IEmployee>;
    loadingTechnicians: boolean;
    loadingDealership: boolean;
    loading: boolean;
    loadingDMSAdvisors: boolean;
    saving: boolean;
    dealershipPaging: IPagingResponse;
    paging: IPagingResponse;
    pageData: IPageRequest;
    filters: IEmployeeFilters;
    usersShort: IAdvisorShort[];
    calendarData: ICalendarItem[];
    scheduleByDate: IScheduleByDate|null;
}
export type TSCState = {
    advisorsList: IAdvisorShort[];
    techniciansList: IAdvisorShort[];
    DmsAdvisors: TDmsAdvisor[];
}

export interface ICalendarItem {
    date: TParsableDate;
    techniciansCount: number;
    advisorsCount: number;
}

export interface IScheduleByDate {
    employeeName: string;
    role: string;
    serviceBook: string;
    serviceBookId: number;
    employeeId: string;
    isOnSchedule: boolean;
    startAt: string;
    finishAt: string;
}