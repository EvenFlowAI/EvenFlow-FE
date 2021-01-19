import {AxiosResponse} from "axios";
import {ParsableDate} from "@material-ui/pickers/constants/prop-types";
import {
    EAppointmentTimingType,
    EReminderType,
    IPersonalInformation,
    IVehicleData
} from "../store/reducers/appointment/types";
import {IOffer, IServiceType} from "../store/reducers/offers/types";
import {IServiceRequestShort} from "../store/reducers/serviceRequests/types";

export type TApiResponse<R=any> = Promise<AxiosResponse<R>>;
export type TApiEndpoint<T=any, R=any> = (arg: T) => TApiResponse<R>;
export type TApiView = Record<string, TApiEndpoint>;

export type TApi = Record<string, TApiView>;

export interface ICreateAppointment {
    date: ParsableDate;
    slot: string;
    reminderTypes: EReminderType[];
    gmt: number;
    appointmentTimingType: EAppointmentTimingType;
    driver: IPersonalInformation;
    serviceCenterId: number;
    offerId: number|null;
    transportationNeeds: {
        isNeed: boolean;
        description: string;
    },
    vehicle: {
        vin: string;
        make: string;
        year: string|null;
        model: string,
        mileage: string|null;
        transmission: string;
        driveType: string;
        engineType: string;
    },
    isNeedCall: boolean;
    comment: string;
    serviceRequestIds: number[];
}
export interface IUpdateAppointment extends ICreateAppointment, ICreateAppointmentResp {}
export interface ICreateAppointmentResp { id: number; hashKey: string; }
export interface IPasswordRecoveryData { email: string; }
export interface IPasswordRecoveryResp { }
export interface ISetNewPasswordData {
    userId: string;
    token: string;
    newPassword: string;
}
export interface IConfig {
    roles: string[];
    timeZones: string[];
}
export interface IListAppointmentRequest {
    serviceCenterId: number;
    offerId?: number;
    pageIndex: number;
    pageSize?: number;
    date?: ParsableDate;
    orderBy?: "requestDate" | "date" | "transactionValue";
    isAscending?: boolean;
}
export interface IDriverInfo {
    fullName: string;
    phoneNumber: string;
    email: string;
}
export interface ITransportationNeeds {
    isNeed: boolean;
    description: string;
}

export interface IListAppointment {
    id: number;
    requestDate: ParsableDate;
    dateInUtc: ParsableDate;
    remindAtInUtc: ParsableDate;
    timeSlot: string;
    vehicleId: number;
    vehicle: IVehicleData;
    customerId: string;
    driver: IDriverInfo;
    duration: number;
    transactionValue: number;
    serviceCenterId: number;
    transportationNeeds: ITransportationNeeds;
    isNeedCall: boolean;
    comment: string;
    offerId: number;
    offer: IOffer;
    "reminderTypes": EReminderType[];
    "serviceRequests": IServiceRequestShort[];
}