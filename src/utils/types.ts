import {TRole} from "../store/reducers/users/types";
import {IRemappedAppointmentSlot} from "../store/reducers/appointment/types";
import moment from "moment";

export type TCalendarProps = {
    text: string;
    dates: string[];
    location: string;
    timeZone?: string;
    details?: string;
}
export type TRouteRoleMap = {
    route: string;
    roles: TRole[] | boolean;
}

export type TGroupedAppointment = {
    date: moment.Moment;
    lowestPrice: number;
    idx: string;
    offers: boolean;
    appointments: IRemappedAppointmentSlot[];
    amountOfSavingMoney?: number;
    ancillaryPrice: number;
}
export type TGroupedAppointments = {
    [k: string]: TGroupedAppointment
}

export type TOption = {
    value: number;
    name: string;
}

export type TTextParams = {
    label: string;
    fullWidth?: boolean;
    disabled?: boolean;
    placeholder?: string;
    error?: boolean;
    required?: boolean;
    key?: string;
};

export type TGAOptions = {
    siteSpeedSampleRate: number;
    cookieDomain: string;
    allowLinker: boolean;
    storage: string;
    clientId?: string;
}