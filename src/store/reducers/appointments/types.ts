import moment from "moment";
import {EAppointmentStatus, EMaintenanceOptionType, IListAppointment, IVehicle} from "../../../api/types";
import {EPackagePricingType} from "../appointmentFrameReducer/types";
import {EAppointmentTimingType, TRecallForRequest} from "../appointment/types";

export interface IAppointmentsRequest {
    pageIndex: number;
    pageSize: number;
    serviceCenterId: number;
    orderBy?: keyof IListAppointment | string | undefined;
    isAscending?: boolean;
    date?: moment.Moment | null;
    status?: EAppointmentStatus | null | unknown;
    searchTerm?: string;
    serviceBook?: string|unknown;
    scheduler?: string|unknown;
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
    appointmentHashKey: string;
    address: string|null;
    zipCode: string|null;
    vehicle: IVehicle;
    serviceTypeOptionId: number|null;
    consultantId: string|null;
}