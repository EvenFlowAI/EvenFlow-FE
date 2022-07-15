import {AxiosResponse} from "axios";
import {ParsableDate} from "@material-ui/pickers/constants/prop-types";
import {
    EAppointmentTimingType,
    EReminderType, ETransportation,
    IPersonalInformation,
    IVehicleData
} from "../store/reducers/appointment/types";
import {IOffer} from "../store/reducers/offers/types";
import {IServiceRequest, IServiceRequestShort} from "../store/reducers/serviceRequests/types";
import {ICurrentUser} from "../store/reducers/users/types";
import {TEnumKeyLabel} from "../store/reducers/utils";
import {EServiceCategoryType, ICategory} from "../store/reducers/categories/types";

export type TApiResponse<R = any> = Promise<AxiosResponse<R>>;
export type TApiEndpoint<T = any, R = any> = (arg: T) => TApiResponse<R>;
export type TApiView = Record<string, TApiEndpoint>;

export type TApi = Record<string, TApiView>;

export type serviceRequestAssigned = {
    type: number;
    serviceRequestId: number;
    description?: string;
    code?: string;
}

export enum EServiceCategoryPage {
    Page1,
    Page2
}

export enum EServiceCenterName {
    RiverviewFord,
    BMWSchererville,
    DealertrackTest,
    SanfordInfinity
}

export enum EVehiclePropType {
    Make, Model, Transmission, DriveType, EngineType
}

export enum ECustomerCriteria {
    Any, Own, Lease
}

export enum EMaintenanceOptionType {
    Base, Value, Preferred
}

export interface ICreateAppointment {
    id?: number;
    serviceCategoryId?: number | null;
    serviceCategoryIds?: number[];
    maintenancePackageOptionId: number | null;
    date: ParsableDate;
    slot: string;
    customerId?: string;
    reminderTypes: EReminderType[];
    gmt: number;
    appointmentTimingType: EAppointmentTimingType;
    driver: IPersonalInformation;
    serviceCenterId: number;
    offerId: number | null;
    consultantId?: string;
    transportationType?: ETransportation
    vehicle: {
        dmsId: string | null;
        vin: string;
        make: string;
        year: string | null;
        model: string,
        mileage: string | null;
        transmission: string;
        driveType: string;
        engineType: string;
    },
    isNeedCall: boolean;
    comment: string;
    serviceRequestIds: number[];
    searchTerm?: string;
}

export interface IUpdateAppointment extends ICreateAppointment {
    id?: number;
    hashKey?: string;
}

export interface ICreateAppointmentResp extends IAppointmentByQuery {
    id: number;
    hashKey: string;
}

export interface ICustomerLoadedData {
    emails: string[];
    firstName?: string;
    lastName?: string;
    fullName?: string;
    id: string;
    sessionId?: string;
    phoneNumbers: string[];
    vehicles: ILoadedVehicle[];
}

export interface IVehicle {
    vin: string;
    make: string;
    model: string;
    year: number|null;
    mileage: number|null;
    serviceInterval?: string;
    modelDetails?: string;
}

export interface ILoadedVehicle  extends IVehicle {
    dmsId?: string;
    warrantyExpiration?: ParsableDate;
    appointmentHashKeys: string[];
}

export interface IPasswordRecoveryData {
    email: string;
}

export interface IPasswordRecoveryResp {
}

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
    orderBy?: string;
    isAscending?: boolean;
    searchTerm?: string;
    status?: EAppointmentStatus | unknown;
}

export interface IDriverInfo {
    fullName: string;
    phoneNumber: string;
    email: string;
}

export enum AppointmentStatus {
    Active, Cancelled
}

export const appointmentStatuses: TEnumKeyLabel<AppointmentStatus> = {
    [AppointmentStatus.Active]: "Active",
    [AppointmentStatus.Cancelled]: "Canceled"
}

export interface IMaintenancePackageOption {
    name: string;
    maintenancePackageName: string;
    maintenancePackageId?: number;
    id?: number;
}

export interface IBaseAppointment {
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
    maintenancePackageOptionId: number | null;
    maintenancePackageOption: IPackageOptions | null;
    // maintenancePackageOption: IMaintenancePackageOption | null;
    driver: IDriverInfo;
    duration: number;
    transactionValue: number;
    serviceCenterId: number;
    transportationOption: ITransportation|null;
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

export interface IListAppointment extends IBaseAppointment {
    serviceCategory: ICategory|null;
}

export interface IAppointmentByQuery extends IBaseAppointment {
    serviceCategories: ICategory[];
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

export interface IServiceCategoryShort {
    id: number;
    name: string;
}

export interface IServiceCategory extends IServiceCategoryShort {
    page: EServiceCategoryPage;
    serviceRequests: IServiceRequest[];
    type: EServiceCategoryType;
    price: number;
    loadedIcon?: JSX.Element | string;
    iconPath?: string;
    description?: string;
}

export interface IServiceConsultant {
    id: string;
    name: string;
    dmsId: string;
    dmsName: string;
    position: string;
    iconPath: string;
}

export interface ICustomer {
    fullName: string;
    phoneNumber: string;
    email: string;
}

export interface ITransportation {
    type: number;
    name: string;
    description: string;
}

export interface IYearRange {
    from: number;
    to: number;
}

export interface IBusinessRule {
    vehicleMakes: string[];
    vehicleModels: string[];
    vehicleYearRange: IYearRange;
    vehicleMileageValues: string[];
    customerCriteria: ECustomerCriteria;
}

export interface IComplimentaryService {
    id: number;
    name: string;
    price: number;
    durationInHours: number;
}

export type TServiceRequestShort = {
    id: number;
    code: string;
    description: string;
    durationInHours: number;
    price: number;
}

export type TExtendedComplimentary = {
    laborAmount: number;
    partsAmount: number;
} & IComplimentaryService;

export type TExtendedService = {
    laborAmount: number;
    partsAmount: number;
} & TServiceRequestShort;

export interface IPackageOptions {
    id: number;
    type: EMaintenanceOptionType;
    name: string;
    price: number;
    serviceRequests: TExtendedService[];
    complimentaryServices: TExtendedComplimentary[];
    marketPriceServiceRequests: number;
    marketPriceComplimentaryServices: number;
    maintenancePackageName: string;
}

export interface IPackage {
    isApplyPricingOptimization?: boolean;
    maintenancePackageName?: string;
    options: IPackageOptions[];
}

export interface IPackage {
    options: IPackageOptions[];
}

export interface IPackageAppointments extends IPackage{
    isApplyPricingOptimization: boolean;
    maintenancePackageName: string;
}

export interface IPackageByQuery {
    name: string;
    id: number;
    isApplyPricingOptimization: boolean;
    serviceRequests: TExtendedService[];
    complimentaryServices: TExtendedComplimentary[];
}

export interface IMake {
    name: string;
    models: string[];
    id?:number;
}

export interface IPackageById {
    isApplyPricingOptimization: boolean;
    isApplyBusinessRules: boolean;
    options: IPackageOptionDetailed[];
    serviceRequestsAssigned: serviceRequestAssigned[];
    name: string;
    id: number;
    serviceRequests: TExtendedService[];
    complimentaryServices: TExtendedComplimentary[];
    businessRules: IBusinessRule;
}

export type TOptionServiceRequest = {
    isSendToDMS: boolean;
    serviceRequestId: number;
}

export interface IPackageOptionDetailed {
    id: number;
    type: EMaintenanceOptionType;
    price: number;
    serviceRequests: TOptionServiceRequest[];
    complimentaryServices: number[];
    complimentaryServiceLaborHours: number;
    complimentaryServicePrice: number;
    maintenancePackageId: number;
    serviceRequestLaborHours: number;
    serviceRequestPrice: number;
    name?: string;
    serviceRequestAssignedId?: number;
}

export enum EAppointmentStatus {Active, Canceled}
