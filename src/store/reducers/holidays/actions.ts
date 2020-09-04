import {AppThunk, IPageRequest, IPagingResponse, PaginatedAPIResponse} from "../../../types/types";
import {IHoliday, THolidayActions} from "./types";
import {Api} from "../../../config/requests";


const loading = (payload: boolean): THolidayActions => ({type: "Holidays/Loading", payload});
// const saving = (payload: boolean): THolidayActions => ({type: "Holidays/Saving", payload});
const setPaging = (payload: IPagingResponse): THolidayActions => ({type: "Holidays/ChangePaging", payload});
export const setHolidayPageData = (payload: Partial<IPageRequest>): THolidayActions => ({type: "Holidays/ChangePageData", payload});
const _loadAll = (payload: IHoliday[]): THolidayActions => ({type: "Holidays/LoadAll", payload});
export const loadAllHolidays = (serviceCenterId: number): AppThunk => async (dispatch, getState) => {
    dispatch(loading(true));
    const {pageData} = getState().holidays;
    try {
        const {data: {paging, result}} = await Api.call<PaginatedAPIResponse<IHoliday>>(
            Api.endpoints.Holidays.GetAll,
            {data: {...pageData, serviceCenterId}}
        );
        dispatch(setPaging(paging));
        dispatch(_loadAll(result));
        dispatch(loading(false));
    } catch (e) {
        dispatch(loading(false));
        throw e;
    }
}