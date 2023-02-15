import {createAction} from "@reduxjs/toolkit";
import {AppThunk} from "../../../types/types";
import {Api} from "../../../config/requests";
import {IFirstScreenOption, TNewFirstScreenOption, TUpdateFirstScreenOption} from "./types";

export const setFirstScreenOptionsLoading = createAction<boolean>("ServiceTypes/SetLoading");
export const getFirstScreenOptionsByQuery = createAction<IFirstScreenOption[]>("ServiceTypes/GetServiceTypesByQuery");

export const loadFirstScreenOptionsByQuery = (id: number): AppThunk => dispatch => {
    dispatch(setFirstScreenOptionsLoading(true));
    Api.call(Api.endpoints.ServiceTypes.GetByQuery, {data: { serviceCenterId: id, pageSize: 0, pageIndex: 0}})
        .then(result => {
            if (result?.data) {
                dispatch(getFirstScreenOptionsByQuery(result.data.result))
            }
        })
        .catch(err => {
            console.log('get service types by query', err)
        })
        .finally(() => dispatch(setFirstScreenOptionsLoading(false)))
}

export const deleteFirstScreenOptionById = (id: number, serviceCenterId: number): AppThunk => dispatch => {
    Api.call(Api.endpoints.ServiceTypes.Remove, {urlParams: {id}})
        .then(result => {
            if (result) {
                dispatch(loadFirstScreenOptionsByQuery(serviceCenterId))
            }
        })
        .catch(err => {
            console.log('delete service type error', err)
        })
}

export const updateFirstScreenOption = (id: number, serviceCenterId: number, data: TUpdateFirstScreenOption, onSuccess: (id: number) => void, onError: (err: string) => void): AppThunk => dispatch => {
    Api.call(Api.endpoints.ServiceTypes.Update, {urlParams: {id}, data})
        .then(result => {
            if (result) {
                dispatch(loadFirstScreenOptionsByQuery(serviceCenterId))
                onSuccess(id);
            }
        })
        .catch(err => {
            onError(err)
            console.log('update service type error', err)
        })
}

export const createFirstScreenOption = (data: TNewFirstScreenOption, serviceCenterId: number, onSuccess: (id: number) => void, onError: (err: string) => void): AppThunk => dispatch => {
    Api.call(Api.endpoints.ServiceTypes.Create, {data})
        .then(result => {
            if (result) {
                dispatch(loadFirstScreenOptionsByQuery(serviceCenterId))
                if (result.data?.id) onSuccess(result.data.id);
            }
        })
        .catch(err => {
            onError(err)
            console.log('create service type error', err)
        })
}

export const updateFirstScreenOptionIcon = (id: number, serviceCenterId: number, file: File): AppThunk => dispatch => {
    const data = new FormData();
    data.append("file", file, file.name);
    Api.call(Api.endpoints.ServiceTypes.UpdateIcon, {urlParams: {id}, data})
        .then(result => {
            if (result) {
                dispatch(loadFirstScreenOptionsByQuery(serviceCenterId))
            }
        })
        .catch(err => {
            console.log('update service type icon error', err)
        })
}