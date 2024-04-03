import {TFilters} from "./types";
import {EReportingStatus} from "../../../api/types";

export const initialOrder = {
    orderBy: "date",
    isAscending: true,
}

export const initialPaging = {pageIndex: 0, pageSize: 10}

export const initialFilters: TFilters = {
    searchTerm: '',
    serviceBook: null,
    scheduler: null,
    reportingStatus: [EReportingStatus.Active],
    dateFrom: null,
    dateTo: null,
    scId: null,
    pageData: initialPaging,
    advisor: null,
    technician: null,
}
export const allColumns = ["Date", "Day", "Time", "Customer Name", "Service Advisor", "Technician", "Vehicle", "Service Book", "Scheduler", "Status"]
export const requiredColumns = ["Date", "Day", "Time", "Customer Name", "Vehicle", "Status"]
export const localStorageItemName = "appointmentsColumns";