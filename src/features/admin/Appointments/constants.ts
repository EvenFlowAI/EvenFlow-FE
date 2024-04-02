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
    date: null,
    scId: null,
    pageData: initialPaging,
    advisor: null,
    technician: null,
}