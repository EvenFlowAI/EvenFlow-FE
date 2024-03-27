import {IDealershipGroupExtended} from "../dealershipGroups/types";
import {IServiceCenter} from "../serviceCenters/types";
import {IAdvisorShort, TRole} from "../users/types";
import {TChangePageDataGeneric, TChangePagingGeneric} from "../types";
import {IOrder, IPageRequest, IPagingResponse} from "../../../types/types";
import {EDayOfWeek} from "../offers/types";

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
export type TGetBaseSummary = {type: "Employees/GetBaseSummary", payload: IBaseSummary};
export type TGetBaseScheduleByEmployee = {type: "Employees/GetBaseScheduleByEmployee", payload: IEmployeeRoleHours[]};
export type TGetScheduleTimeByEmployee = {type: "Employees/GetScheduleTimeByEmployee", payload: IEmployeeSchedule};

export enum EAdvisorAssignMethod {
    Rotational,
    MaxCapacity,
    LastEmployee,
    NoAssignment
}

export enum EAssignmentLevel {
    Primary,
    Secondary
}

export type TEmployeeAssignmentMethod = {
    level: EAssignmentLevel,
    type: EAdvisorAssignMethod | null,
}
export type TEmployeeAssignmentSetting = {
    role: TRole,
    methods: TEmployeeAssignmentMethod[];
}

export interface IEmployeeAssignmentSetting {
    serviceBookName: string;
    serviceBookId?: number;
    employeeAssignmentSettings: TEmployeeAssignmentSetting[];
}

export type TGetAssignmentSettings = {type: "Employees/GetAssignmentSettings", payload: IEmployeeAssignmentSetting[]};

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
    | TGetBaseSummary
    | TGetBaseScheduleByEmployee
    | TGetScheduleTimeByEmployee
    | TGetAssignmentSettings;

export type TDmsAdvisor = {
    id: string;
    name: string;
    role: EDmsRole|null;
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
    baseSummary: IBaseSummary|null;
    employeeRoleHours: IEmployeeRoleHours[];
    employeeSchedule: IEmployeeSchedule|null;
    assignmentSettings: IEmployeeAssignmentSetting[];
}
export type TSCState = {
    advisorsList: IAdvisorShort[];
    techniciansList: IAdvisorShort[];
    DmsAdvisors: TDmsAdvisor[];
}

export type TDayHours = {
    day: EDayOfWeek;
    value: number;
}

export interface IRoleHours {
    role: string;
    serviceBook: string;
    serviceBookId?: number;
    dailyHours: TDayHours[];
}

export interface IBaseSummary {
    roleHours: IRoleHours[];
    totalHours: TDayHours[];
}

export interface IEmployeeRoleHours extends IRoleHours {
    employeeId: string;
    employeeName: string;
}

export interface IBaseScheduleByEmployee {
    roleHours: IEmployeeRoleHours[];
}

export type TScheduleByEmployeeRequestData = {
    serviceCenterId: number;
    orderBy: string;
    isAscending: boolean;
    serviceBookId: number|null;
    isServiceBookServiceCenter: boolean;
    name?: string;
    role?: string;
}

export type TDaySchedule = {
    dayOfWeek: number;
    from: string;
    to: string;
    isOnSchedule: boolean;
}

export interface IEmployeeSchedule {
    employeeId: string;
    serviceCenterId: number;
    dayOfWeekSchedules: TDaySchedule[];
    role: string;
    employeeName: string;
    serviceBookId?: number;
    serviceBook?: string;
}

export type TBaseScheduleRequest = {
    serviceCenterId: number;
    employeeId: string;
    serviceBookId?: number;
}

export type TSetScheduleData = {
    serviceCenterId: number;
    employeeId: string;
    dayOfWeekSchedules: TDaySchedule[];
    serviceBookId?: number;
}

export enum EDmsRole {
    None,
    Advisor,
    Technician,
    ServiceManager
}

export type TServiceBookSetting = {
    serviceBookId?: number;
    employeeAssignmentSettings: TEmployeeAssignmentSetting[];
}

export type TUpdateAssignmentSettingsData = {
    serviceCenterId: number;
    serviceBookSettings: TServiceBookSetting[];
}