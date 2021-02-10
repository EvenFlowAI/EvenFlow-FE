import moment from "moment";
import {IRemappedAppointmentSlot} from "../../../store/reducers/appointment/types";

export type TGroupedAppointments = {
    [k: string]: {
        date: moment.Moment;
        lowestPrice: number;
        idx: string;
        offers: boolean;
        appointments: IRemappedAppointmentSlot[];
    }
}