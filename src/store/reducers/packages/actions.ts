import {createAction} from "@reduxjs/toolkit";
import {IPackageById, IPackageByQuery, IMake, IPackageOptionDetailed} from "../../../api/types";
import {AppThunk, IOrder, IPageRequest, IPagingResponse} from "../../../types/types";
import {Api} from "../../../config/requests";
import {
    IComplimentaryServiceByQuery,
    INewPackage,
    IUpdatedPackage, TOrderIndex
} from "./types";

export const setPackageLoading = createAction<boolean>('Optimizer/SetPackageLoading');
export const getPackageById = createAction<IPackageById | null>('Optimizer/GetPackageById');
export const getPackagesByQuery = createAction<IPackageByQuery[]>('Optimizer/GetPackages');
export const getMakes = createAction<IMake[]>('Optimizer/GetVehicles');
export const getComplimentary = createAction<IComplimentaryServiceByQuery[]>('Optimizer/GetComplimentary');
export const getAllComplimentary = createAction<IComplimentaryServiceByQuery[]>('Optimizer/GetAllComplimentary');
export const setComplimentaryLoading = createAction<boolean>('Optimizer/SetComplimentaryLoading');
export const setComplimentaryPagingResponse  = createAction<IPagingResponse>('Optimizer/SetComplimentaryRecordsNumber');
export const setComplimentaryPageData  = createAction<Partial<IPageRequest>>('Optimizer/SetComplimentaryPageData');
export const setComplimentarySort = createAction<IOrder<IComplimentaryServiceByQuery>>('Optimizer/SetComplimentarySort');
export const setComplimentarySearchTerm = createAction<string>('Optimizer/SetComplimentarySearchTerm');

export const changeComplimentaryPageData = (data: Partial<IPageRequest>): AppThunk => async (dispatch, getState) => {
    await dispatch(setComplimentaryPageData(data));
    const {selectedSC} = getState().serviceCenters;
    if (selectedSC) await dispatch(loadComplimentary(selectedSC.id));
}

export const loadPackageById = (id: number): AppThunk => async dispatch => {
    dispatch(setPackageLoading(true));
    Api.call(Api.endpoints.MaintenancePackages.Retrieve, {urlParams: {id}})
        .then(result => {
            if (result?.data) dispatch(getPackageById(result.data));
        }).catch(err => {
        console.log(err);
    }).finally(() => dispatch(setPackageLoading(false)))
}

export const removePackageById = (packageId: number, serviceCenterId: number): AppThunk => async dispatch => {
    dispatch(setPackageLoading(true));
    Api.call(Api.endpoints.MaintenancePackages.Remove, {urlParams: {id: packageId}})
        .then(result => {
            if (result?.data) dispatch(loadPackages(serviceCenterId));
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

export const updatePackageOptions = (id: number, data: IPackageOptionDetailed[], showError: (err: string) => void): AppThunk => async dispatch => {
    dispatch(setPackageLoading(true));
    Api.call(Api.endpoints.MaintenancePackages.PackageOptions, {urlParams: {id}, data: {items: data}})
        .then(result => {
            if (result) dispatch(loadPackageById(id));
        })
        .catch(err => {
            showError(err)
        console.log(err)
    })
        .finally(() => dispatch(setPackageLoading(false)))
}

export const updatePackage = (id: number, data: IUpdatedPackage, serviceCenterId: number, callback?: () => void, errCallback?: (err: {errorCode: number; message: string}) => void): AppThunk => async dispatch => {
    dispatch(setPackageLoading(true));
    Api.call(Api.endpoints.MaintenancePackages.Update, {urlParams: {id}, data})
        .then(result => {
            if (result) {
                callback && callback();
                dispatch(loadPackages(serviceCenterId))
                dispatch(loadPackageById(id))
            }
        })
        .catch(err => {
            console.log(err)
            errCallback && errCallback(err);
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

export const createPackage = (id: number, data: INewPackage, callback: () => void, errCallback?: (err: {errorCode: number; message: string}) => void): AppThunk => async dispatch => {
    dispatch(setPackageLoading(true))
    Api.call(Api.endpoints.MaintenancePackages.Create, {urlParams: {id}, data})
        .then(result => {
            if (result) {
                callback();
                dispatch(loadPackages(id));
            }
        })
        .catch(err => {
        console.log(err)
            errCallback && errCallback(err)
    })
        .finally(() => dispatch(setPackageLoading(false)))
}

export const loadAllComplimentary = (serviceCenterId: number): AppThunk => dispatch => {
    const data = {
        serviceCenterId,
        pageIndex: 0,
        pageSize: 0,
    }
    Api.call(Api.endpoints.ComplimentaryServices.GetByQuery, {data})
        .then(result => {
            dispatch(getAllComplimentary(result.data.result))
        })
        .catch(err => {
            console.log(err)
        })
}

export const loadComplimentary = (serviceCenterId: number): AppThunk => async (dispatch, getState) => {
    dispatch(setComplimentaryLoading(true))
    const { complimentaryPageData, complimentarySortOrder, complimentarySearchTerm } = getState().packages;
    const data = {
        serviceCenterId,
        searchTerm: complimentarySearchTerm,
        pageIndex: complimentaryPageData.pageIndex,
        pageSize: complimentaryPageData.pageSize,
        orderBy: complimentarySortOrder.orderBy,
        isAscending: complimentarySortOrder.isAscending,
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

export const updatePackageSRDescription = (
    id: number,
    serviceRequestId: number,
    description: string|null,
    onError: (err: string) => void,
    onSuccess?: () => void
): AppThunk => dispatch => {
    dispatch(setPackageLoading(true));
    Api.call(Api.endpoints.MaintenancePackages.UpdateSRDescription, {urlParams: {id}, data: {serviceRequestId, description}})
        .then(result => {
            if (result) {
                dispatch(loadPackageById(id))
                onSuccess && onSuccess()
            }
        })
        .catch(err => {
            console.log('update package SR description err', err)
            onError(err)
        })
        .finally(() => dispatch(setPackageLoading(false)))
}

export const updatePackageComplimentaryDescription = (
    id: number,
    complimentaryServiceId: number,
    description: string|null,
    onError: (err: string) => void,
    onSuccess?: () => void
): AppThunk => dispatch => {
    dispatch(setPackageLoading(true));
    Api.call(Api.endpoints.MaintenancePackages.UpdateComplimentaryDescription, {urlParams: {id}, data: {complimentaryServiceId, description}})
        .then(result => {
            if (result) {
                dispatch(loadPackageById(id))
                onSuccess && onSuccess()
            }
        })
        .catch(err => {
            console.log('update package complimentary description err', err)
            onError(err)
        })
        .finally(() => dispatch(setPackageLoading(false)))
}

export const updateSROrderIndex = (id: number, items: TOrderIndex[], onError: (err: string) => void): AppThunk => dispatch => {
    dispatch(setPackageLoading(true))
    Api.call(Api.endpoints.MaintenancePackages.UpdateSROrder, {urlParams: {id}, data: {items}})
        .then(result => {
            if (result) dispatch(loadPackageById(id))
        })
        .catch(err => {
            console.log('update package service requests order index err', err)
            onError(err)
        })
    dispatch(setPackageLoading(false))
}

export const updateComplimentaryOrderIndex = (id: number, items: TOrderIndex[], onError: (err: string) => void): AppThunk => dispatch => {
    dispatch(setPackageLoading(true))
    Api.call(Api.endpoints.MaintenancePackages.UpdateComplimentaryOrder, {urlParams: {id}, data: {items}})
        .then(result => {
            if (result) dispatch(loadPackageById(id))
        })
        .catch(err => {
            console.log('update package complimentary order index err', err)
            onError(err)
        })
    dispatch(setPackageLoading(false))
}