import {createAction} from "@reduxjs/toolkit";
import {AppThunk, IPageRequest, IPagingResponse, PaginatedAPIResponse} from "../../../types/types";
import {Api} from "../../../config/requests";
import {IBay, IBayForm, IBayShort} from "./types";

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
    const {pageData} = getState().bays;
    dispatch(loading(true));
    try {
        const {data: {result, paging}} = await Api.call<PaginatedAPIResponse<IBay>>(
            Api.endpoints.Bays.GetAll,
            {data: {...pageData, serviceCenterId}}
        )
        dispatch(setPaging(paging));
        dispatch(loading(false));
        dispatch(getFilteredBays(result));
    } catch (e) {
        dispatch(loading(false));
        throw e;
    }
}

export const createBay = (data: IBayForm): AppThunk => async dispatch => {
    dispatch(saving(true));
    try {
        await Api.call(Api.endpoints.Bays.Create, {data});
        dispatch(saving(false));
        dispatch(loadBays(data.serviceCenterId));
    } catch (e) {
        dispatch(saving(false));
        throw e;
    }
}

export const updateBay = (data: IBayForm, id: number): AppThunk => async dispatch => {
    dispatch(saving(true));
    try {
        await Api.call(Api.endpoints.Bays.Update, {data, urlParams: {id}});
        dispatch(saving(false));
        dispatch(loadBays(data.serviceCenterId));
    } catch (e) {
        dispatch(saving(false));
        throw e;
    }
}
export const removeBay = (data: IBay): AppThunk => async dispatch => {
    await Api.call(Api.endpoints.Bays.Remove, {urlParams: {id: data.id}});
    dispatch(loadBays(data.serviceCenterId));
}
export const getBaysShort = createAction<IBayShort[]>("Bays/Short");
export const loadBaysShort = (serviceCenterId: number): AppThunk => async dispatch => {
    const {data: {result}} = await Api.call<PaginatedAPIResponse<IBayShort>>(
        Api.endpoints.Bays.GetShort,
        {data: {pageSize: 0, serviceCenterId}}
    );
    dispatch(getBaysShort(result))
}