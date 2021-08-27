import moment from "moment";
import {IServiceCategory} from "../../../api/types";

export const getAppointmentDate = (date: moment.Moment, d: number) => {
    return moment.utc(date).date(d).startOf('day').toISOString().replace('.000', '');
}

export const collectServiceRequestIds = (s: IServiceCategory|null, sub: IServiceCategory|null): number[] => {
    const ids = [];
    if (s) {
        for (let i=0; i<s.serviceRequests.length; i++) {
            ids.push(s.serviceRequests[i].id);
        }
    }
    if (sub) {
        for (let i=0; i < sub.serviceRequests.length; i++) {
            ids.push(sub.serviceRequests[i].id);
        }
    }
    return ids;
}