import moment from "moment";
import {
    EMaintenanceOptionType, EReportingStatus,
    IListAppointment,
    IVehicle, TAppointmentAdvisor
} from "../../../api/types";
import {EPackagePricingType} from "../appointmentFrameReducer/types";
import {EAppointmentTimingType, TRecallForRequest} from "../appointment/types";

export interface IAppointmentsRequest {
    pageIndex: number;
    pageSize: number;
    serviceCenterId: number;
    orderBy?: keyof IListAppointment | string | undefined;
    isAscending?: boolean;
    date?: moment.Moment | null;
    reportingStatus? :EReportingStatus | null | unknown;
    searchTerm?: string;
    serviceBookId?: number|unknown;
    scheduler?: string|unknown;
    isServiceBookServiceCenter?: boolean,
}

export interface IVehicleDetails {
    vehicleVin?: string;
    vehicleMake?: string;
    vehicleModel?: string;
    vehicleYear?: string;
    vehicleMileage?: string;
}

export interface IPackageRequestData {
    serviceCenterId: number;
    vehicle: IVehicle;
}

type TPackageOptionRequest = {
    id?: number;
    priceType?: EPackagePricingType|null;
    optionType?: EMaintenanceOptionType|null;
}

export interface ICheckPodRequest {
    serviceRequestIds: number[];
    serviceCategoryIds: number[];
    valueServiceOfferIds: number[];
    recalls: TRecallForRequest[];
    maintenancePackageOption: TPackageOptionRequest|null;
    appointmentTimingType: EAppointmentTimingType;
    serviceCenterId: number;
    address: string|null;
    zipCode: string|null;
    vehicle: IVehicle;
    serviceTypeOptionId: number|null;
    advisor: TAppointmentAdvisor;
}

export type TServiceBook = {
    id?: number;
    name: string;
}

export enum EScheduler {
    SelfMobile,SelfWebsite
}

export type TScheduler = {
    id?: string;
    type?: EScheduler;
    fullName: string;
}
