import {AxiosResponse} from "axios";
import {ParsableDate} from "@material-ui/pickers/constants/prop-types";
import {
    EAppointmentTimingType,
    EReminderType, ETransportation,
    IPersonalInformation,
    IVehicleData
} from "../store/reducers/appointment/types";
import {EOfferType, IOffer} from "../store/reducers/offers/types";
import {IServiceRequest, IServiceRequestShort} from "../store/reducers/serviceRequests/types";
import {ICurrentUser} from "../store/reducers/users/types";
import {TEnumKeyLabel} from "../store/reducers/utils";
import {EServiceCategoryType, ICategory} from "../store/reducers/categories/types";
import {EJobType} from "../store/reducers/pods/types";
import {EServiceType} from "../store/reducers/appointmentFrameReducer/types";
import {ETransportColumn} from "../store/reducers/transportationNeeds/types";
import {IFirstScreenOption} from "../store/reducers/serviceTypes/types";

export type TApiResponse<R = any> = Promise<AxiosResponse<R>>;
export type TApiEndpoint<T = any, R = any> = (arg: T) => TApiResponse<R>;
export type TApiView = Record<string, TApiEndpoint>;

export type TApi = Record<string, TApiView>;

export type TServiceRequestAssigned = {
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
    SanfordInfinity,
    Dominion,
    Fremont,
    LakePowellFord
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
        engineTypeId?: number|null;
    },
    isNeedCall: boolean;
    comment: string;
    serviceRequestIds: number[];
    searchTerm?: string;
    jobType?: EJobType;
    serviceTypeOptionId: number|null;
    address?: string;
    zipCode?: string;
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
    city?:string;
}

export interface IVehicle {
    vin: string;
    make: string;
    model: string;
    year: number|null;
    mileage: number|null;
    serviceInterval?: string;
    modelDetails?: string;
    engineTypeId?: number|null;
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
    city?: string;
}

export enum AppointmentStatus {
    Active, Cancelled
}

export const appointmentStatuses: TEnumKeyLabel<AppointmentStatus> = {
    [AppointmentStatus.Active]: "Active",
    [AppointmentStatus.Cancelled]: "Canceled"
}

export const jobTypes: TEnumKeyLabel<EJobType> = {
    [EJobType.Internal]: "Internal",
    [EJobType.Warranty]: "Warranty",
    [EJobType.CustomerPay]: "Customer Pay",
    [EJobType.Recall]: "Recall",
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
    serviceType: EServiceType;
    serviceTypeOption?: IFirstScreenOption|null;
    address?: string;
    zipCode?: string;
    ancillaryPrice: number;
}

export interface IListAppointment extends IBaseAppointment {
    serviceCategory: ICategory|null;
}

export interface IAppointmentByQuery extends IBaseAppointment {
    serviceCategories: ICategory[];
    jobType?: EJobType;
    serviceTypeOption?: IFirstScreenOption;
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

export interface IOfferForCategory {
    id: number;
    type: EOfferType;
    expiringDate: string;
    description: string;
    title: string;
    valueOff?: number;
}

export interface IServiceCategory extends IServiceCategoryShort {
    page: EServiceCategoryPage;
    serviceRequests: IServiceRequest[];
    type: EServiceCategoryType;
    price: number;
    loadedIcon?: JSX.Element | string;
    iconPath?: string;
    description?: string;
    offer?: IOfferForCategory;
    isCommentRequired?: boolean;
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
    city?: string;
}

export interface ITransportation {
    id: number;
    type: number;
    name: string;
    description: string;
    column: ETransportColumn;
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
    engineTypeIds: number[];
}

export interface IComplimentaryService {
    id: number;
    name: string;
    price: number;
    durationInHours: number;
    orderIndex: number;
}

export type TServiceRequestShort = {
    id: number;
    code: string;
    description: string;
    durationInHours: number;
    price: number;
    orderIndex: number;
}

export type TExtendedComplimentary = {
    laborAmount: number;
    partsAmount: number;
    detailedDescription?: string;
} & IComplimentaryService;

export type TExtendedService = {
    laborAmount: number;
    partsAmount: number;
    detailedDescription?: string;
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

export interface IPackageServiceRequestsAssigned {
    type: EMaintenanceOptionType;
    serviceRequestId: number;
    description: string;
    code: string;
}

export interface IPackageByQuery {
    name: string;
    id: number;
    isApplyPricingOptimization: boolean;
    serviceRequests: TExtendedService[];
    complimentaryServices: TExtendedComplimentary[];
    serviceRequestsAssigned: IPackageServiceRequestsAssigned[];
}

export interface IMake {
    name: string;
    models: string[];
    id?:number;
}

export interface IModel {
    name: string;
    id: number;
}
export interface IMakeExtended {
    name: string;
    models: IModel[];
    id: number;
}

export type TEngineType = {
    id: number;
    name: string;
}
// todo change type of intervalUpsellServices

export interface IPackageById {
    isApplyPricingOptimization: boolean;
    isApplyBusinessRules: boolean;
    options: IPackageOptionDetailed[];
    serviceRequestsAssigned: TServiceRequestAssigned[];
    name: string;
    id: number;
    serviceRequests: TExtendedService[];
    complimentaryServices: TExtendedComplimentary[];
    intervalUpsellServices: TExtendedService[];
    businessRules: IBusinessRule;
    engineTypes: TEngineType[];
}

export type TOptionServiceRequest = {
    isSendToDMS: boolean;
    serviceRequestId: number;
}

// todo change type of intervalUpsellServices

export interface IPackageOptionDetailed {
    id: number;
    type: EMaintenanceOptionType;
    price: number;
    serviceRequests: TOptionServiceRequest[];
    intervalUpsellServices: TOptionServiceRequest[];
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
