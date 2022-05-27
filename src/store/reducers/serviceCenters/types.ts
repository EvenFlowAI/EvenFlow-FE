import {IAddress, IDealershipGroupShort} from "../dealershipGroups/types";
import {TChangePageDataGeneric, TChangePagingGeneric} from "../utils";
import {ITimeSpan} from "../../../types/types";

export interface IServiceCenter {
    id: number;
    name: string;
    address: IAddress;
    applyPricingOptimization: boolean;
    mainAddress: string;
    avatarPath?: string;
    timeZoneId: string;
    laborRatePerHour: number;
    isAuthRequired: boolean;
    serviceCenterFlag?: number;
    isUpdateAdvisorInAppointments?: boolean;
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
    id?: number;
    avatarPath?: string;
    name: string;
    serviceCenterEmail: string;
    contactPersonalEmail: string;
    phoneNumber: string;
    address: IAddress;
    timeZoneId: string;
}
export interface IHOOData {
    dayOfWeek: number;
    from: ITimeSpan;
    to: ITimeSpan;
}
export interface IHOODataForm {
    dayOfWeek: number;
    from: string;
    to: string;
}

export interface IBreak {
    id?: number;
    dayOfWeek: number;
    from: string;
    to: string;
}

export interface IBreakFrom {
    breaks: IBreak[];
}

export interface IWeeklySchedule {
    dayOfWeek: number;
    averageTechnicians: number;
    averageLevelThreeTechnicians: number;
}
export interface IWeeklyScheduleForm {
    weeklySchedules: IWeeklySchedule[]
}
export interface ISCAnalytics {
    countOfTechnicians: number;
    countOfBays: number;
    countOfPods: number;
    countOfAppointmentsToday: number;
}

export type TGetAll = {type: "ServiceCenters/GetAll", payload: IServiceCenterExtended[]};
export type TGetDealershipAll = {type: "ServiceCenters/GetDealershipAll", payload: IServiceCenterExtended[]};
export type TGetShort = {type: "ServiceCenters/GetShort", payload: IServiceCenter[]};
export type TShortLoading = {type: "ServiceCenters/ShortLoading", payload: boolean};
export type TCreate = {type: "ServiceCenters/Create", payload: IServiceCenterExtended}
export type TLoading = {type: "ServiceCenters/Loading", payload: boolean};
export type TDealershipLoading = {type: "ServiceCenters/DealershipLoading", payload: boolean};
export type TSaving = {type: "ServiceCenters/Saving", payload: boolean};
export type TSelectSC = {type: "ServiceCenters/SelectSC", payload: IServiceCenter|undefined};
export type TFullSCList = {type: "ServiceCenters/FullSCList", payload: IServiceCenter[]};
export type TChangePageData = TChangePageDataGeneric<"ServiceCenters/ChangePageData">;
export type TChangePaging = TChangePagingGeneric<"ServiceCenters/ChangePaging">;
export type TChangeDealershipPaging = TChangePagingGeneric<"ServiceCenters/ChangeDealershipPaging">;
export type TSetDealerShipId = {type: "ServiceCenters/SetDealershipId", payload: number | undefined};
export type TSetReminders = {type: "ServiceCenters/SetReminders", payload: boolean};
export type TSetRemindersLoading = {type: "ServiceCenters/SetRemindersLoading", payload: boolean};

export type TServiceCenterActions =
    | TCreate
    | TLoading
    | TSelectSC
    | TFullSCList
    | TSaving
    | TDealershipLoading
    | TGetDealershipAll
    | TChangeDealershipPaging
    | TChangePageData
    | TChangePaging
    | TGetShort
    | TShortLoading
    | TSetDealerShipId
    | TGetAll
    | TSetReminders
    | TSetRemindersLoading;

export interface IPredictionParams {
    heavyRepairLaborHours: number;
    otherRepairLaborHours: number;
    defaultLaborHours: number;
    laborRatePerHour: number;
    warrantyLaborRatePerHour: number;
}