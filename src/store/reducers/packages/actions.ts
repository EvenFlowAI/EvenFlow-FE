import {createAction} from "@reduxjs/toolkit";
import {IPackageById, IPackageByQuery} from "../../../api/types";
import {AppThunk} from "../../../types/types";
import {Api} from "../../../config/requests";

export const setPackageLoading = createAction<boolean>('Optimizer/SetPackageLoading');
export const getPackageById = createAction<IPackageById>('Optimizer/GetPackageById');
export const getPackagesByQuery = createAction<IPackageByQuery[]>('Optimizer/GetPackages');

export const loadPackageById = (serviceCenterId: number): AppThunk => async dispatch => {
    dispatch(setPackageLoading(true));
    Api.call(Api.endpoints.MaintenancePackages.Retrieve, {urlParams: {id: serviceCenterId}})
        .then(result => {
            if (result?.data) dispatch(getPackageById(result.data));
        }).catch(err => {
        console.log(err);
    }).finally(() => dispatch(setPackageLoading(false)))
}

export const removePackageById = (serviceCenterId: number): AppThunk => async dispatch => {
    dispatch(setPackageLoading(true));
    Api.call(Api.endpoints.MaintenancePackages.Remove, {urlParams: {id: serviceCenterId}})
        .then(result => {
            if (result?.data) dispatch(getPackageById(result.data));
        }).catch(err => {
        console.log(err);
    }).finally(() => dispatch(setPackageLoading(false)))
}

export const loadPackages = (serviceCenterId: number): AppThunk => async dispatch => {
    const data = {
        podId: null,
        serviceCenterId,
        pageIndex: 0,
        pageSize: 0,
    }
    Api.call(Api.endpoints.MaintenancePackages.GetByQuery, {data})
        .then(result => {
            if (result?.data?.result) {
                dispatch(getPackagesByQuery(result.data.result));
            }
        }).catch(err => {
        console.log(err);
    })
}