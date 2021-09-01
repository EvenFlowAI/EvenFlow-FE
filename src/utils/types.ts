import {TRole} from "../store/reducers/users/types";
import {IRemappedAppointmentSlot} from "../store/reducers/appointment/types";

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
}
export type TGroupedAppointments = {
    [k: string]: TGroupedAppointment
}

export type TGroupedAppointmentsList = [keyof TGroupedAppointments, TGroupedAppointment];