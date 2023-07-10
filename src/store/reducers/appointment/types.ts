import {IAddress} from "../dealershipGroups/types";
import {ParsableDate} from "@material-ui/pickers/constants/prop-types";
import {TEnumMap} from "../utils";
import {EDemandCategory, EPricingDisplayType} from "../pricingSettings/types";
import {EOfferType, IOffer} from "../offers/types";
import moment from "moment";
import {
    EMaintenanceOptionType,
    ICreateAppointmentResp,
    ICustomerLoadedData,
    ILoadedVehicle, IOfferForCategory,
    IServiceCategory, IServiceCategoryShort,
    ITransportation
} from "../../../api/types";
import {EPackagePricingType} from "../appointmentFrameReducer/types";
import {TEmailRequirement} from "../screenSettings/types";

export interface IServiceCenterProfile {
    id: number;
    name: string;
    serviceCenterEmail: string;
    contactPersonalEmail: string;
    phoneNumber: string;
    avatarPath: string;
    address: IAddress;
    dealershipId: number;
    dealershipName: string;
    serviceCenterFlag: number;
    isRoundPrice: boolean;
    isAuthRequired: boolean;
    maintenancePackageDisclaimer?: string;
    isShowPriceDetails?: boolean;
    defaultVehicleMakeId?: number|null;
    isCommentRequired: boolean;
    engineTypeFieldName?: string;
    dmsId?: string;
    maintenancePackageOptionTypes: EMaintenanceOptionType[];
    eMenuEnabled?: boolean;
    emailRequirement?: TEmailRequirement;
}
export interface ISR {
    id: number;
    code: string;
    description?: string;
    price?: number;
}

export type TS1Form = {
    year: string|null;
    mileage: string|null;
    vin: string;
    model: string;
    make: string;
    transmission: string;
    driveType: string;
}
export interface IVehicleData {
    vin: string;
    make: string;
    year: number;
    model: string;
    mileage: number;
    transmission: string;
    driveType: string;
    engineTypeId?: number;
    makeId?: number;
}

export interface IVehicleShort {
    vin: string;
    make: string;
    year: number;
    model: string;
    mileage: number;
}

export interface IVehicle extends IVehicleShort {
    transmission: string;
    driveType: string;
    engineTypeId: number|null;
    // serviceInterval: string;
}

export type TS3Form = {
    date?: ParsableDate,
    appointmentType: EAppointmentTimingType;
}

export enum ETransportation {
    HaveARide,
    WaitWithAVehicle,
    PickUpVehicle,
    Rental,
    Shuttle,
    LoanerCar,
}
export const transportations: TEnumMap<ETransportation>[][] = [
    [
        {id: ETransportation.HaveARide, label: "I have a ride"},
        {id: ETransportation.WaitWithAVehicle, label: "I will wait with my vehicle"},
        {id: ETransportation.PickUpVehicle, label: "I would like for you to pick up my vehicle"}
    ],
    [
        {id: ETransportation.Rental, label: "I would like a rental"},
        {id: ETransportation.Shuttle, label: "I will take the shuttle"},
        {id: ETransportation.LoanerCar, label: "I would take a loaner car"},
    ]
];
export const flatTransportations: TEnumMap<ETransportation>[] = transportations.reduce((acc, ta) => [
    ...acc, ...ta
], [] as TEnumMap<ETransportation>[]);
export interface IPersonalInformation {
    fullName: string;
    phoneNumber: string;
    email: string;
}

export interface IReminders {
    email: boolean;
    phone: boolean;
    sms: boolean;
}
export interface IPrivacy {
    privacy: boolean;
    callback: boolean;
}
export interface IPrice {
    value: number;
    category: EDemandCategory;
    amountOfSavingMoney?: number;
    ancillaryPrice: number;
}
export interface IAppointmentSlot {
    date: ParsableDate;
    time: string;
    price: IPrice;
    priceWithOffer?: IPrice;
    offer?: IOffer;
    isShorterWaitTime: boolean;
}
export interface ISearchedDateRange {
    from: ParsableDate;
    to: ParsableDate;
}
export interface IAppointmentResponse {
    items: IAppointmentSlot[];
    searchedDateRange: ISearchedDateRange;
    slotGapMinutes: number;
    consultantId?: string;
}
export enum EAppointmentTimingType {
    SpecialOffers, PreferredDate, FirstAvailable
}

export interface IVehicleForSlots {
    vin: string;
    make: string;
    year: number|null;
    model: string;
    mileage: number|null;
    engineTypeId?: number|null;
}

export type TRecallForRequest = {
    serviceRequestId: number;
    number: string;
    id?: number;
}

export type MPOptionShort = {
    id?: number;
    priceType?: EPackagePricingType|null;
    optionType?: EMaintenanceOptionType|null;
}

export interface IAppointmentSlotsRequest {
    serviceCenterId: number;
    maintenancePackageOptionId?: number|null;
    maintenancePackageOption: MPOptionShort|null;
    fromDate?: ParsableDate;
    appointmentTimingType: EAppointmentTimingType;
    countOfDays?: number;
    offerType?: EOfferType;
    serviceCategoryIds?: number[],
    onlyOffers?: boolean;
    shorterWaitTime?: boolean;
    serviceRequestIds: number[];
    customerId?: string;
    warrantyExpiration?: ParsableDate;
    consultantId?: string | null;
    valueServiceOfferIds?: number[];
    vehicle?: IVehicleForSlots;
    searchTerm?: string;
    appointmentHashKey?: string;
    jobType?: number|null;
    serviceTypeOptionId: number|null;
    zipCode?: string;
    address?: string;
    recalls: TRecallForRequest[];
}
export interface IRemappedAppointmentSlot extends IAppointmentSlot {
    id: string;
    date: moment.Moment;
    serviceRequestPrices?: IServiceRequestPrice[];
    timingType?: number;
    appointmentDate?: string;
}

export interface IAppointmentFilters {
    offersOnly: boolean;
    waitTimeOnly: boolean;
}

export type TAppointmentState = {
    sessionId: string;
    updated: boolean;
    customerEnteredEmail: string;
    customerSelectedVehicle: ILoadedVehicle|null;
    scProfile?: IServiceCenterProfile;
    serviceRequests: ISR[];
    customerLoadedData: ICustomerLoadedData|null;
    appointmentId: ICreateAppointmentResp|null;
    selectedSR: number[],
    s1Data: TS1Form;
    search: string;
    s3Data: TS3Form;
    transportation: ITransportation|null;
    personalInformation: IPersonalInformation;
    reminders: IReminders;
    privacy: IPrivacy;
    comment: string;
    appointment: IRemappedAppointmentSlot|null;
    serviceValetAppointment: IServiceValetAppointment|null;
    searchedDateRange: ISearchedDateRange|null;
    appointmentSlots: IRemappedAppointmentSlot[];
    serviceValetSlots: IServiceValetAppointment[];
    appointmentFilters: IAppointmentFilters;
    serviceCategories: IServiceCategory[];
    allServiceCategories: IServiceCategoryShort[];
    isProfileLoading: boolean;
    dropOffSettings: IDropOffSettings|null;
};
export enum EReminderType {
    Email, Phone, Sms
}

export const APPOINTMENT_STATE_KEY = "APPOINTMENT";
export const APPOINTMENT_STATE_SAVED_KEY = "APPOINTMENT_SAVED";

export interface IMake {
    name: string;
    models: string[];
}

export interface IServiceRequestPrice {
    requestName: string;
    pricingDisplayType: EPricingDisplayType;
    priceValue?: number;
    offer?: IOfferForCategory;
}

export interface IServiceValetRequestPrice {
    requestName: string;
    priceValue: number;
    pricingDisplayType: EPricingDisplayType;
    serviceCategoryId: number;
}

export interface IAppointmentPriceItem {
    serviceRequestId: number;
    price: number;
}

export interface IServiceValetAppointmentPrice {
    priceWithoutOptimization: number;
    value: number;
    amountOfSavingMoney: number;
    ancillaryPrice: number;
    category: string;
    items: IAppointmentPriceItem[];
}

export interface IServiceValetAppointment {
    date: ParsableDate;
    pickUpMin: string;
    pickUpMax: string;
    dropOffDescription: string;
    available: number,
    price: IServiceValetAppointmentPrice;
    serviceRequestPrices: IServiceValetRequestPrice[];
    dropOffMin?: string;
    dropOffMax?: string;
}

export interface IDropOffSettings {
    showDropOffTime: boolean;
    description: string;
}

export interface ISVAppointmentResponse {
    items: IServiceValetAppointment[];
    searchedDateRange: ISearchedDateRange;
    dropOffSettings: IDropOffSettings;
}