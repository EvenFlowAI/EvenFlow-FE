import {createAction} from "@reduxjs/toolkit";
import {AppThunk} from "../../../types/types";
import {Api} from "../../../config/requests";
import {IServiceType, TUpdateServiceTypeData} from "./types";

export const setServiceTypesLoading = createAction<boolean>("ServiceTypes/SetLoading");
export const getServiceTypesByQuery = createAction<IServiceType[]>("ServiceTypes/GetServiceTypesByQuery");

export const deleteServiceTypeById = (id: number, serviceCenterId: number): AppThunk => dispatch => {
    Api.call(Api.endpoints.ServiceTypes.Remove, {urlParams: {id}})
        .then(result => {
            if (result) {
                dispatch(loadServiceTypesByQuery(serviceCenterId))
            }
        })
        .catch(err => {
            console.log('delete service type error', err)
        })
}

export const updateServiceType = (id: number, serviceCenterId: number, data: IServiceType): AppThunk => dispatch => {
    Api.call(Api.endpoints.ServiceTypes.Update, {urlParams: {id}, data})
        .then(result => {
            if (result) {
                dispatch(loadServiceTypesByQuery(serviceCenterId))
            }
        })
        .catch(err => {
            console.log('update service type error', err)
        })
}

export const createCategory = (data: TUpdateServiceTypeData, serviceCenterId: number, callback: () => void): AppThunk => dispatch => {
    Api.call(Api.endpoints.ServiceTypes.Create, {data})
        .then(result => {
            if (result) {
                dispatch(loadServiceTypesByQuery(serviceCenterId))
                if (result.data?.id) callback();
            }
        })
        .catch(err => {
            console.log('create service type error', err)
        })
}

export const updateServiceTypeIcon = (id: number, serviceCenterId: number, file: File): AppThunk => dispatch => {
    const data = new FormData();
    data.append("file", file, file.name);
    Api.call(Api.endpoints.ServiceTypes.UpdateIcon, {urlParams: {id}, data})
        .then(result => {
            if (result) {
                dispatch(loadServiceTypesByQuery(serviceCenterId))
            }
        })
        .catch(err => {
            console.log('update service type icon error', err)
        })
}

export const loadServiceTypesByQuery = (id: number): AppThunk => dispatch => {
    dispatch(setServiceTypesLoading(true));
    Api.call(Api.endpoints.ServiceTypes.GetByQuery, {data: { serviceCenterId: id, pageSize: 0, pageIndex: 0}})
        .then(result => {
            if (result?.data) {
                dispatch(getServiceTypesByQuery(result.data.result))
            }
        })
        .catch(err => {
            console.log('get service types by query', err)
        })
        .finally(() => dispatch(setServiceTypesLoading(false)))
}