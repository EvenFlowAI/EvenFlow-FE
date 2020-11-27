import {IAddress} from "../dealershipGroups/types";
import {ParsableDate} from "@material-ui/pickers/constants/prop-types";
import {TEnumMap} from "../utils";

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
    appointmentType: TAppointmentType;
}
export type TAppointmentType = 1 | 2 | 3;

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
        {id: ETransportation.LoanerCar, label: "I would tale a loaner car"},
    ]
]