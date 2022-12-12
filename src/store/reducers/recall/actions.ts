import {createAction} from "@reduxjs/toolkit";
import {ICreateUpdateRecall, IRecall, IRecallResponse} from "./types";
import {AppThunk, IPageRequest} from "../../../types/types";
import {Api} from "../../../config/requests";

export const getRecalls  = createAction<IRecall[]>('Recall/GetRecalls');
export const setLoading  = createAction<boolean>('Recall/SetLoading');
export const setRecallPageData = createAction<Partial<IPageRequest>>("Recall/SetRecallPageData");
export const setRecallsCount = createAction<number>("Recall/SetRecallsCount");

export const loadRecalls = (serviceCenterId: number): AppThunk => (dispatch, getState) => {
    dispatch(setLoading(true));
    const {pageSize, pageIndex} = getState().recalls.recallPageData;
    Api.call<IRecallResponse>(Api.endpoints.Recalls.GetAll, {data: {serviceCenterId, pageSize, pageIndex}})
        .then(result => {
            if (result.data?.result) {
                dispatch(getRecalls(result.data.result))
                dispatch(setRecallsCount(result.data.paging.numberOfRecords))
            }
        })
        .catch(err => {
            console.log('get recalls err', err)
        })
        .finally(() => dispatch(setLoading(false)));
}

export const createRecall = (data: ICreateUpdateRecall, onError: (err: string) => void, onSuccess: () => void): AppThunk => dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.Recalls.Create, {data})
        .then(result => {
            if (result) {
                dispatch(loadRecalls(data.serviceCenterId))
                onSuccess()
            }
        })
        .catch(err => {
            console.log('create recall err', err)
            onError(err)
            dispatch(setLoading(false));
        })
}

export const updateRecall = (data: ICreateUpdateRecall, id: number, onError: (err: string) => void, onSuccess: () => void): AppThunk => dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.Recalls.Update, {urlParams: {id}, data})
        .then(result => {
            if (result) {
                dispatch(loadRecalls(data.serviceCenterId))
                onSuccess()
            }
        })
        .catch(err => {
        console.log('update recall err', err)
        onError(err)
        dispatch(setLoading(false));
    })
}

export const deleteRecall = (id: number, serviceCenterId: number,onError: (err: string) => void): AppThunk => dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.Recalls.Remove, {urlParams: {id}})
        .then(result => {
            if (result) dispatch(loadRecalls(serviceCenterId))
        })
        .catch(err => {
            console.log('delete recall err', err)
            onError(err)
            dispatch(setLoading(false));
        })
}