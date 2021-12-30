import moment from "moment";
import {EAppointmentStatus, IListAppointment} from "../../../api/types";

export interface IAppointmentsRequest {
    pageIndex: number;
    pageSize: number;
    serviceCenterId: number;
    orderBy: keyof IListAppointment | string | undefined;
    isAscending: boolean;
    date: moment.Moment | null;
    status: EAppointmentStatus | null | unknown;
    searchTerm: string;
}