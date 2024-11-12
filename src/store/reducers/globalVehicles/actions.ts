import {createAction} from "@reduxjs/toolkit";
import {IGlobalMake, TOption, TReviewOption} from "./types";
import {AppThunk, IOrder, IPageRequest, PaginatedAPIResponse} from "../../../types/types";
import {Api} from "../../../api/ApiEndpoints/ApiEndpoints";
import {ReviewStatusMap} from "./utils";

export const getMakes = createAction<IGlobalMake[]>("GlobalVehicles/GetMakes")
export const getAllMakesOptions = createAction<TOption[]>("GlobalVehicles/GetAllMakesOptions")
export const setLoading = createAction<boolean>("GlobalVehicles/Loading")

export const loadGlobalMakes = (pageData: IPageRequest, order: IOrder<IGlobalMake>, reviewStatus: TReviewOption|null): AppThunk => (dispatch) => {
    dispatch(setLoading(true))
    const {pageIndex, pageSize} = pageData;
    Api.call(Api.endpoints.GlobalVehicles.GetMakes, {
        data: {
            pageIndex,
            pageSize,
            reviewStatus: reviewStatus ? ReviewStatusMap[reviewStatus] : null}
    })
        .then(res => {
            if (res?.data?.result) dispatch(getMakes(res.data.result))
        })
        .catch(err => {
            console.log(err)
        })
        .finally(() => dispatch(setLoading(false)))
}

export const loadAllGlobalMakes = (): AppThunk => (dispatch) => {
    dispatch(setLoading(true))
    Api.call<PaginatedAPIResponse<IGlobalMake>>(Api.endpoints.GlobalVehicles.GetMakes, {data: {pageIndex: 0, pageSize: 0}})
        .then(res => {
            if (res?.data?.result) {
                dispatch(getAllMakesOptions(res.data.result.map(({id, vinMake}) => ({id, name: vinMake}))))
            }
        })
        .catch(err => {
            console.log(err)
        })
        .finally(() => dispatch(setLoading(false)))
}