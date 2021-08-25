import {AxiosResponse} from "axios";
import {ParsableDate} from "@material-ui/pickers/constants/prop-types";
import {
    EAppointmentTimingType,
    EReminderType,
    IPersonalInformation,
    IVehicleData
} from "../store/reducers/appointment/types";
import {IOffer} from "../store/reducers/offers/types";
import {IServiceRequest, IServiceRequestShort} from "../store/reducers/serviceRequests/types";
import {ICurrentUser} from "../store/reducers/users/types";
import {TEnumKeyLabel} from "../store/reducers/utils";

export type TApiResponse<R=any> = Promise<AxiosResponse<R>>;
export type TApiEndpoint<T=any, R=any> = (arg: T) => TApiResponse<R>;
export type TApiView = Record<string, TApiEndpoint>;

export type TApi = Record<string, TApiView>;
export enum EServiceCategoryPage {
    Page1="Page1",
    Page2="Page2"
}

export interface ICreateAppointment {
    id?: number;
    date: ParsableDate;
    slot: string;
    customerId?: string;
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
        dmsId: string|null;
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
export interface IUpdateAppointment extends ICreateAppointment, ICreateAppointmentResp {
    id: number;
}
export interface ICreateAppointmentResp {
    id: number;
    hashKey: string;
}

export interface ICustomerLoadedData {
    emails: string[];
    firstName: string;
    lastName: string;
    id: string;
    sessionId?: string;
    phoneNumbers: string[];
    vehicles: ILoadedVehicle[];
}
export interface ILoadedVehicle {
    dmsId: string;
    vin: string;
    make: string;
    model: string;
    year: number;
    mileage: number;
    warrantyExpiration?: ParsableDate;
}
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

export enum AppointmentStatus {
    Active, Cancelled
}
export const appointmentStatuses: TEnumKeyLabel<AppointmentStatus> = {
    [AppointmentStatus.Active]: "Active",
    [AppointmentStatus.Cancelled]: "Canceled"
}

export interface IListAppointment {
    id: number;
    hashKey: string;
    appointmentStatus: AppointmentStatus;
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
    isEditable: boolean;
    reminderTypes: EReminderType[];
    serviceRequests: IServiceRequestShort[];
    createdBy: string;
    user?: ICurrentUser;
}
export interface ISearchCustomerParams {
    serviceCenterId: number;
    searchTerm: string;
}
export interface ISearchTerm {
    searchTerm: string;
}
export interface ISecurityCode {
    securityCode: string;
}
export interface IServiceCenterId {
    serviceCenterId: number;
}
export interface ISessionId {
    "session-id": string;
}

export interface IServiceCategory {
    id: number;
    name: string;
    page: EServiceCategoryPage;
    iconPath?: string;
    loadedIcon?: JSX.Element | string;
    serviceRequests: IServiceRequest[];
}
export interface IServiceConsultantShort {
    id: string;
    name: string
}
export interface IServiceConsultant {
    id: string;
    name: string;
    dmsId: string;
    dmsName: string;
    position: string;
    iconPath: string;
}
