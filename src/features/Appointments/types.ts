import {TScheduler, TServiceBook} from "../../store/reducers/appointments/types";
import {EAppointmentStatus} from "../../api/types";
import moment from "moment/moment";
import {IPageRequest} from "../../types/types";

export type TView = "calendar" | "list";

export type TFilters = {
    searchTerm: string;
    serviceBook: TServiceBook|null;
    scheduler: TScheduler|null;
    status: EAppointmentStatus | '' | unknown;
    date: moment.Moment | null;
    scId: number|null;
    pageData: IPageRequest;
}