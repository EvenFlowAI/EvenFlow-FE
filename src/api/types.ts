import {AxiosResponse} from "axios";
import {ParsableDate} from "@material-ui/pickers/constants/prop-types";
import {
    EReminderType, IServiceRequestPrice,
    IVehicleData, IVehicleForSlots, IWaitListData, MPOptionShort, TRecallForRequest
} from "../store/reducers/appointment/types";
import {EOfferType, IOffer} from "../store/reducers/offers/types";
import {IServiceRequest, IServiceRequestShort} from "../store/reducers/serviceRequests/types";
import {ICurrentUser} from "../store/reducers/users/types";
import {TEnumKeyLabel} from "../store/reducers/utils";
import {EServiceCategoryType, ICategory} from "../store/reducers/categories/types";
import {EJobType} from "../store/reducers/pods/types";
import {EPackagePricingType} from "../store/reducers/appointmentFrameReducer/types";
import {ETransportColumn} from "../store/reducers/transportationNeeds/types";
import {IFirstScreenOption} from "../store/reducers/serviceTypes/types";
import {TPackagePrice} from "../store/reducers/packages/types";
import {TScheduler, TServiceBook} from "../store/reducers/appointments/types";

export type TApiResponse<R = any> = Promise<AxiosResponse<R>>;

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
    SanfordInfiniti,
    Dominion,
    Fremont,
    LakePowellFord,
    LexusCincinnati,
    LexusRiverCenter,
    DealerBuilt,
}

export enum ECustomerCriteria {
    Any, Own, Lease
}

export enum EMaintenanceOptionType {
    Base, Value, Preferred
}

export interface ICreateAppointmentResp extends IAppointmentByQuery {
    id: number;
    hashKey: string;
    transactionValue: number;
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
    fromSearchByName?: boolean;
    isUpdating?: boolean;
    address?: IAddressData|null;
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
    hasRepairOrders?: boolean;
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
    reportingStatus? :EReportingStatus | null | unknown;
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
    serviceTypeOption?: IFirstScreenOption|null;
    ancillaryPrice: number;
}

export interface IListAppointment extends IBaseAppointment {
    serviceCategory: ICategory|null;
}

export type TServiceValetSlot = {
    pickUpMin: string;
    pickUpMax: string;
    dropOffMin?: string;
    dropOffMax?: string;
}

export interface IAddressData {
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    fullAddress?: string;
    originalFullAddress?: string;
}

export type TAppointmentAdvisor = {
    isAnySelected: boolean;
    id?: string|null;
}

export interface IAppointmentByKey extends IBaseAppointment {
    serviceCategories: ICategory[];
    jobType?: EJobType;
    serviceTypeOption?: IFirstScreenOption;
    recalls?: string[];
    recallDescriptions?: string[];
    advisor?: TAppointmentAdvisor|null;
    detailedPriceList?: IServiceRequestPrice[];
    serviceValetTime?: TServiceValetSlot;
    notes?: string;
    address?: IAddressData;
    isWaitlist?: boolean;
    waitlistTextSettings?: Partial<IWaitListData>;
}

export interface IAppointmentByQuery extends IBaseAppointment {
    serviceCategories: ICategory[];
    jobType?: EJobType;
    serviceTypeOption?: IFirstScreenOption;
    recalls?: string[];
    recallDescriptions?: string[];
    consultant?: Partial<IServiceConsultant>|null;
    detailedPriceList?: IServiceRequestPrice[];
    serviceValetTime?: TServiceValetSlot;
    notes?: string;
    address?: IAddressData;
}

export interface IAppointmentCustomerInfo {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    dmsId?: string;
}

export interface IAppointmentVehicle {
    vin: string;
    make: string;
    model: string;
    year: number;
    dmsId?: string;
}

export type TDateAppointmentData = {
    date: ParsableDate;
    scheduler: TScheduler;
}

export interface IAppointment {
    id: number;
    hashKey: string;
    appointmentNumber: string;
    appointmentStatus: AppointmentStatus;
    reportingStatus: EReportingStatus;
    createdDateTime: ParsableDate;
    dateTime: ParsableDate;
    customerInformation?: IAppointmentCustomerInfo;
    vehicle?: IAppointmentVehicle;
    serviceBook: TServiceBook;
    servicesRequested: string[];
    isDefaultRecall: boolean;
    serviceOption?: string;
    totalValue: number;
    ancillaryPrice: number;
    advisor?: string;
    transportation?: string;
    address?: IAddressData;
    notes?: string;
    scheduler: TScheduler;
    isEditable: boolean;
    modificationInfo: TDateAppointmentData[];
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

export interface IConsultantsRequestData {
    serviceCenterId: number;
    pageIndex: 0;
    pageSize: 0;
    searchTerm: string;
    serviceRequestIds: number[];
    serviceCategoryIds: number[];
    maintenancePackageOption: MPOptionShort|null;
    recalls: TRecallForRequest[];
    serviceTypeOptionId: number|null;
    vehicle: IVehicleForSlots;
    valueServiceOfferIds?: number[];
    address?: string;
    zipCode?: string;
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

export type TUpsellOfOption = {
    id: number;
    name: string;
    detailedDescription: string;
    orderIndex: number;
}

export interface IPackageOptions {
    id: number;
    type: EMaintenanceOptionType;
    name: string;
    price: number;
    serviceRequests: TExtendedService[];
    complimentaryServices: TExtendedComplimentary[];
    marketPriceServiceRequests: number;
    marketPriceComplimentaryServices: number;
    marketPriceIntervalUpsells: number;
    intervalUpsells: TUpsellOfOption[];
    totalMaintenanceValue: number;
    marketPriceIntervalUpsell: number;
    maintenancePackageName: string;
    priceType?: EPackagePricingType;
}

export interface IPackage {
    isApplyPricingOptimization?: boolean;
    maintenancePackageName?: string;
    options: IPackageOptions[];
    priceTitles: TPackagePrice[];
    segmentTitles: TSegmentTitle[];
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
    priceTitle?: string;
    priceWithFeeTitle?: string;
    isShowSuggestedPrice?: boolean;
    isManualOverridePrice?: boolean;
    intervalUpsells: TIntervalUpsellForPackage[];
}

export type TModelCode = {
    id: number;
    code: string;
    name: string;
}

export interface IMake {
    name: string;
    models: string[];
    id?:number;
    modelCodes?: TModelCode[];
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

export type TIntervalUpsellForPackage = {
    id: number;
    code: string;
    description: string;
    durationInHours: number;
    invoiceAmount: number;
    orderIndex: number;
    partsUnitCost: number;
    numberOfParts: number;
}

export enum ESegmentTitle {
    IntervalUpsell,
    Complimentary
}

export type TSegmentTitle = {
    title: string;
    type: ESegmentTitle;
}

export interface IPackageById {
    isApplyPricingOptimization: boolean;
    isApplyBusinessRules: boolean;
    options: IPackageOptionDetailed[];
    serviceRequestsAssigned: TServiceRequestAssigned[];
    name: string;
    id: number;
    serviceRequests: TExtendedService[];
    complimentaryServices: TExtendedComplimentary[];
    intervalUpsells: TIntervalUpsellForPackage[];
    businessRules: IBusinessRule;
    engineTypes: TEngineType[];
    isShowSuggestedPrice?: boolean;
    isManualOverridePrice?: boolean;
    priceTitles: TPackagePrice[];
    segmentTitles: TSegmentTitle[];
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
    intervalUpsells: TOptionServiceRequest[];
    complimentaryServices: number[];
    complimentaryServiceLaborHours: number;
    complimentaryServicePrice: number;
    maintenancePackageId: number;
    serviceRequestLaborHours: number;
    serviceRequestPrice: number;
    intervalUpsellServiceLaborHours: number;
    intervalUpsellServicePrice: number;
    name?: string;
    serviceRequestAssignedId?: number;
}
export enum EReportingStatus {
    Active,
    Rescheduled,
    Cancelled,
    Showed,
    WalkInWithAppointment,
    NoShowed,
    WaitlistActive,
    WaitlistRescheduled,
    WaitlistCancelled,
    WaitlistShowed,
    WaitlistWalkInWithAppointment,
    WaitlistNoShowed
}

export const reportingStatuses: TEnumKeyLabel<EReportingStatus> = {
    [EReportingStatus.Active]: "Active",
    [EReportingStatus.Rescheduled]: "Rescheduled",
    [EReportingStatus.Cancelled]: "Canceled",
    [EReportingStatus.Showed]: "Showed",
    [EReportingStatus.WalkInWithAppointment]: "Walk In With Appointment",
    [EReportingStatus.NoShowed]: "No Showed",
    [EReportingStatus.WaitlistActive]: "Waitlist Active",
    [EReportingStatus.WaitlistRescheduled]: "Waitlist Rescheduled",
    [EReportingStatus.WaitlistCancelled]: "Waitlist Cancelled",
    [EReportingStatus.WaitlistShowed]: "Waitlist Showed",
    [EReportingStatus.WaitlistWalkInWithAppointment]: "Waitlist Walk In With Appointment",
    [EReportingStatus.WaitlistNoShowed]: "Waitlist No Showed",
}
