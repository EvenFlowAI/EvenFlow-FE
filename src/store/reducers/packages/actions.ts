import {createAction} from "@reduxjs/toolkit";
import {IPackageById, IPackageByQuery, IMake} from "../../../api/types";
import {AppThunk, IPageRequest, IPagingResponse} from "../../../types/types";
import {Api} from "../../../config/requests";
import {
    IComplimentaryServiceByQuery,
    INewPackage,
    IPackageOption,
    IUpdatedPackage
} from "./types";

export const setPackageLoading = createAction<boolean>('Optimizer/SetPackageLoading');
export const getPackageById = createAction<IPackageById>('Optimizer/GetPackageById');
export const getPackagesByQuery = createAction<IPackageByQuery[]>('Optimizer/GetPackages');
export const getMakes = createAction<IMake[]>('Optimizer/GetVehicles');
export const getComplimentary = createAction<IComplimentaryServiceByQuery[]>('Optimizer/GetComplimentary');
export const setComplimentaryLoading = createAction<boolean>('Optimizer/SetComplimentaryLoading');
export const setComplimentaryPagingResponse  = createAction<IPagingResponse>('Optimizer/setComplimentaryRecordsNumber');
export const setComplimentaryPageData  = createAction<Partial<IPageRequest>>('Optimizer/setComplimentaryPagesNumber');

export const loadPackageById = (id: number): AppThunk => async dispatch => {
    dispatch(setPackageLoading(true));
    Api.call(Api.endpoints.MaintenancePackages.Retrieve, {urlParams: {id}})
        .then(result => {
            if (result?.data) dispatch(getPackageById(result.data));
        }).catch(err => {
        console.log(err);
    }).finally(() => dispatch(setPackageLoading(false)))
}

export const removePackageById = (packageId: number): AppThunk => async (dispatch, getState) => {
    dispatch(setPackageLoading(true));
    const {scProfile} = getState().appointment;
    Api.call(Api.endpoints.MaintenancePackages.Remove, {urlParams: {id: packageId}})
        .then(result => {
            if (result?.data && scProfile?.id) dispatch(loadPackages(scProfile.id));
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

export const updatePackageOptions = (id: number, data: IPackageOption[]): AppThunk => async dispatch => {
    dispatch(setPackageLoading(true));
    Api.call(Api.endpoints.MaintenancePackages.PackageOptions, {urlParams: {id}, data: {items: data}})
        .then(result => {
            if (result) dispatch(loadPackageById(id))
        })
        .catch(err => {
        console.log(err)
    })
        .finally(() => dispatch(setPackageLoading(false)))
}

export const updatePackage = (id: number, data: IUpdatedPackage): AppThunk => async dispatch => {
    dispatch(setPackageLoading(true));
    Api.call(Api.endpoints.MaintenancePackages.Update, {urlParams: {id}, data})
        .then(result => {
            if (result) dispatch(loadPackageById(id))
        })
        .catch(err => {
            console.log(err)
        })
        .finally(() => dispatch(setPackageLoading(false)))
}

export const loadMakes = (serviceCenterId: number): AppThunk  => async dispatch => {
    Api.call(Api.endpoints.Vehicles.Makes, {params: {serviceCenterId}})
        .then(result => {
            if (result) dispatch(getMakes(result.data))
        })
        .catch(err => {
            console.log(err);
        })
}

export const createPackage = (id: number, data: INewPackage, callback: () => void): AppThunk => async dispatch => {
    Api.call(Api.endpoints.MaintenancePackages.Create, {urlParams: {id}, data})
        .then(result => {
            if (result) {
                callback();
                dispatch(loadPackages(id));
            }
        })
        .catch(err => {
        console.log(err)
    })
}

export const loadComplimentary = (serviceCenterId: number): AppThunk => async (dispatch, getState) => {
    dispatch(setComplimentaryLoading(true))
    const { complimentaryPageData } = getState().packages;
    const data = {
        serviceCenterId,
        pageIndex: complimentaryPageData.pageIndex,
        pageSize: complimentaryPageData.pageSize,
    }

    Api.call(Api.endpoints.ComplimentaryServices.GetByQuery, {data})
        .then(result => {
            dispatch(getComplimentary(result.data.result))
            dispatch(setComplimentaryPagingResponse(result.data.paging))
        })
        .catch(err => {
            console.log(err)
        })
        .finally(() => dispatch(setComplimentaryLoading(false)));
}