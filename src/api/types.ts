import {AxiosResponse} from "axios";
import {ParsableDate} from "@material-ui/pickers/constants/prop-types";
import {EAppointmentTimingType, EReminderType} from "../store/reducers/appointment/types";

export type TApiResponse<R=any> = Promise<AxiosResponse<R>>;
export type TApiEndpoint<T=any, R=any> = (arg: T) => TApiResponse<R>;
export type TApiView = Record<string, TApiEndpoint>;

export type TApi = Record<string, TApiView>;

interface IDriver {
    fullName: string;
    phoneNumber: string;
    email: string;
}
export interface ICreateAppointment {
    date: ParsableDate;
    slot: {};
    reminderTypes: EReminderType[];
    gmt: number;
    appointmentTimingType: EAppointmentTimingType;
    driver: IDriver;
    serviceCenterId: number;
    offerId: number;
    transportationNeeds: {
        isNeed: boolean;
        description: string;
    },
    vehicle: {
        vin: string;
        make: string;
        year: number;
        model: string,
        mileage: number;
        transmission: string;
        driveType: string;
        engineType: string;
    },
    isNeedCall: boolean;
    comment: string;
    serviceRequestIds: number[];
}
export interface ICreateAppointmentResp {}