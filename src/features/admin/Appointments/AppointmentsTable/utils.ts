import {IAppointment} from "../../../../api/types";
import moment from "moment/moment";

export const getAppointmentDate = (appointment: IAppointment) => {
    return moment.utc(appointment.dateTime);
}