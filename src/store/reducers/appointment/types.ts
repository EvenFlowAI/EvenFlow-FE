import {IAddress} from "../dealershipGroups/types";
import {ParsableDate} from "@material-ui/pickers/constants/prop-types";

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