import {createAction} from "@reduxjs/toolkit";
import {EReviewStatus, IGlobalMake, IGlobalModel, TReviewOption, TUpdatedMake, TVehicleStatistic} from "./types";
import {
    AppThunk,
    IOrder,
    IPageRequest,
    IPagingResponse,
    PaginatedAPIResponse,
    TArgCallback,
    TCallback
} from "../../../types/types";
import {Api} from "../../../api/ApiEndpoints/ApiEndpoints";
import {ReviewStatusMap} from "./utils";

export const getMakes = createAction<IGlobalMake[]>("GlobalVehicles/GetMakes")
export const getAllMakes = createAction<IGlobalMake[]>("GlobalVehicles/GetAllMakes")
export const getModels = createAction<IGlobalModel[]>("GlobalVehicles/GetModels")
export const getAllModels = createAction<IGlobalModel[]>("GlobalVehicles/GetAllModels")
export const setLoading = createAction<boolean>("GlobalVehicles/Loading")
export const setPaging = createAction<IPagingResponse>("GlobalVehicles/SetMakesPaging");
export const setModelsPaging = createAction<IPagingResponse>("GlobalVehicles/SetModelsPaging");
export const getMakesStatistics = createAction<TVehicleStatistic>("GlobalVehicles/GetMakesStatistics");
export const getModelsStatistics = createAction<TVehicleStatistic>("GlobalVehicles/GetModelsStatistics");

export const loadGlobalMakes = (pageData: IPageRequest, order: IOrder<IGlobalMake>, reviewStatus: TReviewOption|null, makeIds: number[]): AppThunk => (dispatch) => {
    dispatch(setLoading(true))
    const {pageIndex, pageSize} = pageData;
    Api.call<PaginatedAPIResponse<IGlobalMake>>(Api.endpoints.GlobalVehicles.GetMakes, {
        data: {
            pageIndex,
            pageSize,
            reviewStatus: reviewStatus ? ReviewStatusMap[reviewStatus] : null,
            orderBy: order.orderBy,
            isAscending: order.isAscending,
            makeIds
        }
    })
        .then(res => {
            if (res?.data?.result) dispatch(getMakes(res.data.result.map((el, idx) => ({
                ...el,
                localId: idx,
                status: el.accepted
                    ? el.parent
                        ? EReviewStatus.Override
                        : EReviewStatus.Confirmed
                    : EReviewStatus.NotReviewed
            }))))
            if (res?.data?.paging) dispatch(setPaging(res.data.paging))
        })
        .catch(err => {
            console.log(err)
        })
        .finally(() => dispatch(setLoading(false)))
}

export const loadAllGlobalMakes = (): AppThunk => (dispatch) => {
    dispatch(setLoading(true))
    Api.call<PaginatedAPIResponse<IGlobalMake>>(Api.endpoints.GlobalVehicles.GetMakes, {data: {pageIndex: 0, pageSize: 0, isAscending: true}})
        .then(res => {
            if (res?.data?.result) {
                dispatch(getAllMakes(res.data.result))
            }
        })
        .catch(err => {
            console.log(err)
        })
        .finally(() => dispatch(setLoading(false)))
}

export const loadMakeStatistic = (): AppThunk => dispatch => {
    dispatch(setLoading(true))
    Api.call(Api.endpoints.GlobalVehicles.GetMakesStatistic)
        .then(res => {
            if (res?.data) {
                dispatch(getMakesStatistics(res.data))
            }
        })
        .catch(err => {
            console.log(err)
        })
        .finally(() => {
            dispatch(setLoading(false))
        })
}

export const updateMakes = (
    items: TUpdatedMake[],
    pageData: IPageRequest,
    order: IOrder<IGlobalMake>,
    reviewStatus: TReviewOption|null,
    makeIds: number[],
    onError: TArgCallback<any>,
    onSuccess: TCallback
): AppThunk => dispatch => {
    dispatch(setLoading(true))
    Api.call(Api.endpoints.GlobalVehicles.UpdateMakes, {data: {items}})
        .then(res => {
            if (res) {
                dispatch(loadGlobalMakes(pageData, order, reviewStatus, makeIds))
                dispatch(loadMakeStatistic())
            }
            onSuccess()
        })
        .catch(err => {
            dispatch(setLoading(false))
            onError(err)
            console.log(err)
        })
}

export const loadGlobalModels = (pageData: IPageRequest, order: IOrder<IGlobalModel>, reviewStatus: TReviewOption|null, makeIds?: number[], modelIds?: number[]): AppThunk => (dispatch) => {
    dispatch(setLoading(true))
    const {pageIndex, pageSize} = pageData;
    Api.call<PaginatedAPIResponse<IGlobalModel>>(Api.endpoints.GlobalVehicles.GetModels, {
        data: {
            pageIndex,
            pageSize,
            reviewStatus: reviewStatus ? ReviewStatusMap[reviewStatus] : null,
            orderBy: order.orderBy,
            isAscending: order.isAscending,
            makeIds: makeIds,
            modelIds,
        }
    })
        .then(res => {
            if (res?.data?.result) dispatch(getModels(res.data.result.map((el, idx) => ({
                ...el,
                localId: idx,
                status: el.accepted
                    ? el.parent
                        ? EReviewStatus.Override
                        : EReviewStatus.Confirmed
                    : EReviewStatus.NotReviewed
            }))))
            if (res?.data?.paging) dispatch(setModelsPaging(res.data.paging))
        })
        .catch(err => {
            console.log(err)
        })
        .finally(() => dispatch(setLoading(false)))
}

export const loadAllGlobalModels = (): AppThunk => (dispatch) => {
    dispatch(setLoading(true))
    Api.call<PaginatedAPIResponse<IGlobalModel>>(Api.endpoints.GlobalVehicles.GetModels, {data: {pageIndex: 0, pageSize: 0, isAscending: true}})
        .then(res => {
            if (res?.data?.result) {
                dispatch(getAllModels(res.data.result))
            }
        })
        .catch(err => {
            console.log(err)
        })
        .finally(() => dispatch(setLoading(false)))
}

export const loadModelStatistic = (): AppThunk => dispatch => {
    dispatch(setLoading(true))
    Api.call(Api.endpoints.GlobalVehicles.GetModelsStatistic)
        .then(res => {
            if (res?.data) {
                dispatch(getModelsStatistics(res.data))
            }
        })
        .catch(err => {
            console.log(err)
        })
        .finally(() => {
            dispatch(setLoading(false))
        })
}

export const updateModels = (
    items: TUpdatedMake[],
    pageData: IPageRequest,
    order: IOrder<IGlobalModel>,
    reviewStatus: TReviewOption|null,
    makeIds: number[],
    modelIds: number[],
    onError: TArgCallback<any>,
    onSuccess: TCallback
): AppThunk => dispatch => {
    dispatch(setLoading(true))
    Api.call(Api.endpoints.GlobalVehicles.UpdateModels, {data: {items}})
        .then(res => {
            if (res) {
                dispatch(loadGlobalModels(pageData, order, reviewStatus, makeIds, modelIds))
                dispatch(loadModelStatistic())
            }
            onSuccess()
        })
        .catch(err => {
            dispatch(setLoading(false))
            onError(err)
            console.log(err)
        })
}