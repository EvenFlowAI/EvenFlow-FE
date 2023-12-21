import moment from "moment/moment";

export const getAppointmentDate = (date: moment.Moment, d: number) => {
    return moment.utc(date).date(d).startOf('day').toISOString().replace('.000', '');
}