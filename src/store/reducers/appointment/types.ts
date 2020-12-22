import {IAddress} from "../dealershipGroups/types";
import {ParsableDate} from "@material-ui/pickers/constants/prop-types";
import {TEnumMap} from "../utils";
import {EDemandCategory} from "../pricingSettings/types";
import {EOfferType, IOffer} from "../offers/types";
import moment from "moment";

export interface IServiceCenterProfile {
    id: number;
    name: string;
    serviceCenterEmail: string;
    contactPersonalEmail: string;
    phoneNumber: string;
    avatarPath: string;
    address: IAddress;
    dealershipId: number;
}
export interface ISR {
    id: number;
    code: string;
    description?: string;
}
export type TS1Form = {
    year: string|null;
    mileage: string|null;
    vin: string;
    model: string;
    make: string;
    transmission: string;
    driveType: string;
    engineType: string;
}
export interface IVehicleData {
    vin: string;
    make: string;
    year: number;
    model: string;
    mileage: number;
    transmission: string;
    driveType: string;
    engineType: string;
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
    LoanerCar
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
}
export interface IAppointmentSlot {
    date: ParsableDate;
    time: string;
    price: IPrice;
    offers: IOffer[];
    isShorterWaitTime: boolean;
}
export interface IAppointmentResponse {
    items: IAppointmentSlot[];
    searchedDateRange: {
        from: ParsableDate;
        to: ParsableDate;
    }
}
export enum EAppointmentTimingType {
    SpecialOffers, PreferredDate, FirstAvailable
}
export interface IAppointmentSlotsRequest {
    serviceCenterId: number;
    fromDate?: ParsableDate;
    appointmentTimingType: EAppointmentTimingType;
    countOfDays?: number;
    offerType?: EOfferType;
    serviceRequestIds: number[];
}
export interface IRemappedAppointmentSlot extends IAppointmentSlot {
    id: string;
    date: moment.Moment;
}

export type TAppointmentState = {
    scProfile?: IServiceCenterProfile;
    serviceRequests: ISR[];
    selectedSR: number|null,
    s1Data: TS1Form;
    search: string;
    s3Data: TS3Form;
    transportation: ETransportation|null;
    personalInformation: IPersonalInformation;
    reminders: IReminders;
    privacy: IPrivacy;
    comment: string;
    appointment: IRemappedAppointmentSlot|null;
    appointmentSlots: IRemappedAppointmentSlot[];
};

export const APPOINTMENT_STATE_KEY = "APPOINTMENT";
export const APPOINTMENT_STATE_SAVED_KEY = "APPOINTMENT_SAVED";