import {TScheduler, TServiceBook, TServiceConsultant} from "../../../store/reducers/appointments/types";
import {EReportingStatus, IAppointment} from "../../../api/types";
import {IPageRequest, TParsableDate} from "../../../types/types";

export type TView = "calendar" | "list";

export type TFilters = {
    searchTerm: string;
    serviceBook: TServiceBook|null;
    scheduler: TScheduler|null;
    reportingStatus: EReportingStatus[];
    dateFrom: TParsableDate;
    dateTo: TParsableDate;
    scId: number|null;
    pageData: IPageRequest;
    advisor: TServiceConsultant|null;
    technician: TServiceConsultant|null;
    initialFiltersSet: boolean;
}

export type TViewButton = { label: string, type: TView };

export const views: TViewButton[] = [
    {type: "calendar", label: "Calendar View"},
    {type: "list", label: "List View"}
];

export type TDayType = "prev" | "cur" | "next"

export type TDay = {
    date: TParsableDate,
    day: number,
    type: TDayType
}

export type TAppointmentsByDate = {[key: string]: IAppointment[]}