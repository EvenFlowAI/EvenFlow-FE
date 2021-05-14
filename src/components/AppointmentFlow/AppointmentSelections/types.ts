import moment from "moment";
import {IRemappedAppointmentSlot} from "../../../store/reducers/appointment/types";


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