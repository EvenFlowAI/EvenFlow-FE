import {
    EMaintenanceOptionType,
    EReportingStatus,
    IAppointment, IAppointmentByKey,
    IListAppointment,
    IPackageAppointments,
    IVehicle,
    TAppointmentAdvisor
} from "../../../api/types";
import {EPackagePricingType} from "../appointmentFrameReducer/types";
import {EAppointmentTimingType, TRecallForRequest} from "../appointment/types";
import {IPageRequest, TParsableDate} from "../../../types/types";
import {EDate} from "../../../features/admin/Appointments/types";

export interface IAppointmentsRequest {
    pageIndex: number;
    pageSize: number;
    serviceCenterId: number;
    dateRangeFilterBy: EDate;
    orderBy?: keyof IListAppointment | string | undefined;
    isAscending?: boolean;
    startDate?: TParsableDate;
    endDate?: TParsableDate;
    reportingStatuses? :EReportingStatus | null | unknown;
    searchTerm?: string;
    serviceBookId?: number|unknown;
    scheduler?: string|unknown;
    isServiceBookServiceCenter?: boolean;
    advisorId?: number;
    technicianDmsId?: string;

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

export enum EConsultantRole {
    None,
    Advisor,
    Technician,
    ServiceManager
}

export type TServiceConsultant = {
    id: number;
    dmsId: string;
    fullName: string;
    role: EConsultantRole;
}

export type TState = {
    appointments: IAppointment[];
    count: number;
    allCount: number;
    isLoading: boolean;
    isModalLoading: boolean;
    allAppointments: IAppointment[];
    packages: IPackageAppointments[];
    serviceBookList: TServiceBook[];
    schedulerList: TScheduler[];
    pageData: IPageRequest,
    serviceAdvisors: TServiceConsultant[];
    technicians: TServiceConsultant[];
    currentAppointment: IAppointmentByKey|null;
    isAppointmentLoading: boolean;
}