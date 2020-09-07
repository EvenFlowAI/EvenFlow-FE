import {createAction} from "@reduxjs/toolkit";
import {AppThunk, IPageRequest, IPagingResponse, PaginatedAPIResponse} from "../../../types/types";
import {Api} from "../../../config/requests";
import {IBay} from "./types";

export const getAllBays = createAction<IBay[]>("Bays/GetAllBays");
export const getFilteredBays = createAction<IBay[]>("Bays/GetFiltered");
export const setAllLoading = createAction<boolean>("Bays/AllLoading");
export const setAllPaging = createAction<IPagingResponse>("Bays/SetAllPaging");
export const setPageData = createAction<Partial<IPageRequest>>("Bays/SetPageData");
export const setPaging = createAction<IPagingResponse>("Bays/SetPaging");
export const saving = createAction<boolean>("Bays/Saving");
export const loading = createAction<boolean>("Bays/Loading");

export const loadAllBays = (serviceCenterId: number): AppThunk => async dispatch =>  {
    try {
        dispatch(setAllLoading(true));
        const {data: {paging, result}} = await Api.call<PaginatedAPIResponse<IBay>>(
            Api.endpoints.Bays.GetAll,
            {data: {serviceCenterId, pageIndex: 0, pageSize: 0}}
        )
        dispatch(getAllBays(result));
        dispatch(setAllPaging(paging));
        dispatch(setAllLoading(false));
    } catch (e) {
        dispatch(setAllLoading(false));
        throw e;
    }
}
export const loadBays = (serviceCenterId: number): AppThunk => async (dispatch, getState) => {
    // const {pageData} = getState().
}