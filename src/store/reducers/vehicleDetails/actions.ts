import {createAction} from "@reduxjs/toolkit";
import {AppThunk} from "../../../types/types";
import {Api} from "../../../config/requests";
import {IMake, IMakeExtended} from "../../../api/types";
import {ICreateMake, IMileage, TCreateMileage} from "./types";

export const getMakes = createAction<IMake[]>('VehicleDetails/GetMakes');
export const setCurrentMake = createAction<IMake | null>('VehicleDetails/SetCurrentMake');
export const setLoading = createAction<boolean>('VehicleDetails/SetLoading');
export const getMileage = createAction<IMileage[]>('VehicleDetails/GetMileage');
export const setPodsMakes = createAction<IMakeExtended[]>("VehicleDetails/MakesModels");

export const loadMakes = (serviceCenterId: number): AppThunk => async dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.Vehicles.Makes, {params: {serviceCenterId}})
        .then(result => {
            if (result?.data) {
                dispatch(getMakes(result.data))
            }
        })
        .catch(err => {
            console.log('load makes error', err)
        })
        .finally(() => dispatch(setLoading(false)))
}

export const deleteMake = (makeId: number): AppThunk => async (dispatch, getState) => {
    const {selectedSC} = getState().serviceCenters;
    if (selectedSC) {
        Api.call(Api.endpoints.Vehicles.RemoveMake, {urlParams: {id: makeId}})
            .then(result => {
                if (result) dispatch(loadMakes(selectedSC.id))
            })
            .catch(err => {
                console.log('remove make error', err)
            })
    }
}

export const updateMake = (makeId: number, data: IMake): AppThunk => async (dispatch, getState) => {
    const {selectedSC} = getState().serviceCenters;
    if (selectedSC) {
        Api.call(Api.endpoints.Vehicles.UpdateMake, {urlParams: {id: makeId}, data})
            .then(result => {
                if (result) dispatch(loadMakes(selectedSC.id))
            })
            .catch(err => {
                console.log('update make error', err)
            })
    }
}

export const createMake = (data: ICreateMake): AppThunk => async dispatch => {
        Api.call(Api.endpoints.Vehicles.CreateMake, {data})
            .then(result => {
                if (result) dispatch(loadMakes(data.serviceCenterId))
            })
            .catch(err => {
                console.log('update make error', err)
            })
}

export const loadMileage = (serviceCenterId: number): AppThunk => async dispatch => {
    dispatch(setLoading(true));
    Api.call(Api.endpoints.Vehicles.GetMileage, {params: {serviceCenterId}})
        .then(result => {
            if (result?.data) {
                dispatch(getMileage(result.data));
            }
        })
        .catch(err => {
            console.log('load mileage error', err);
        })
        .finally(() => dispatch(setLoading(false)));
}

export const createMileage = (data: TCreateMileage): AppThunk => async dispatch => {
    Api.call(Api.endpoints.Vehicles.CreateMileage, {data})
        .then(result => {
            if (result?.data) {
                dispatch(loadMileage(data.serviceCenterId));
            }
        })
        .catch(err => {
            console.log('create mileage error', err);
        })
}


export const removeMileage = (id: number, serviceCenterId: number): AppThunk => async dispatch => {
    Api.call(Api.endpoints.Vehicles.RemoveMileage, {urlParams: {id}})
        .then(result => {
            if (result?.data) {
                dispatch(loadMileage(serviceCenterId));
            }
        })
        .catch(err => {
            console.log('remove mileage error', err);
        })
}

export const loadMakesForPods = (id: number): AppThunk => dispatch => {
    Api.call<IMakeExtended[]>(Api.endpoints.Vehicles.MakesModels, {params: {id}})
        .then(result => {
            dispatch(setPodsMakes(result.data))
        })
        .catch(err => {
            console.log('get makes for pods error', err)
        })
}