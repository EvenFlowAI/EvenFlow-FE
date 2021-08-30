import moment from "moment";
import {IPackageOptions, IServiceCategory} from "../../../api/types";

export const getAppointmentDate = (date: moment.Moment, d: number) => {
    return moment.utc(date).date(d).startOf('day').toISOString().replace('.000', '');
}

export const collectServiceRequestIds = (
    s: IServiceCategory|null, sub: IServiceCategory|null, selectedPackage?: IPackageOptions|null
, individualOpsCodes?: number[]): number[] => {
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
    if (selectedPackage) {
        // DO not send any ops codes
        // selectedPackage.
    }
    if (individualOpsCodes) {
        for (let c of individualOpsCodes) {
            ids.push(c);
        }
    }
    return ids;
}