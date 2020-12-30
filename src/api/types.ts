import {AxiosResponse} from "axios";
import {ParsableDate} from "@material-ui/pickers/constants/prop-types";
import {EAppointmentTimingType, EReminderType, IPersonalInformation} from "../store/reducers/appointment/types";

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