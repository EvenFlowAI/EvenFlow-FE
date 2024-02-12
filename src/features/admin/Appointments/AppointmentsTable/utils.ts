import {IAppointment} from "../../../../api/types";
import dayjs from "dayjs";

export const getAppointmentDate = (appointment: IAppointment) => {
    return dayjs.utc(appointment.dateTime);
}