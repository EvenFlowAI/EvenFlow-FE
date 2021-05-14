import {IPageRequest, IPagingResponse} from "../../types/types";
import {defaultRowsPerPage} from "../../config/config";

export const defaultPageData: IPageRequest = {
    pageSize: defaultRowsPerPage,
    pageIndex: 0
}
export const defaultPaging: IPagingResponse = {
    numberOfRecords: 0,
    numberOfPages: 0
}