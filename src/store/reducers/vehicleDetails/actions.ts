import {createAction} from "@reduxjs/toolkit";
import {AppThunk} from "../../../types/types";
import {Api} from "../../../config/requests";
import {IMake} from "../../../api/types";
import {ICreateMake} from "./types";

export const getMakes = createAction<IMake[]>('VehicleDetails/GetMakes');
export const setCurrentMake = createAction<IMake | null>('VehicleDetails/SetCurrentMake');

export const loadMakes = (serviceCenterId: number): AppThunk => async dispatch => {
    Api.call(Api.endpoints.Vehicles.Makes, {params: {serviceCenterId}})
        .then(result => {
            if (result?.data) {
                dispatch(getMakes(result.data))
            }
        })
        .catch(err => {
            console.log('load makes error', err)
        })
}

export const deleteMake = (makeId: number): AppThunk => async (dispatch, getState) => {
    const {selectedSC} = getState().serviceCenters;
    if (selectedSC) {
        Api.call(Api.endpoints.Vehicles.Remove, {urlParams: {id: makeId}})
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
        Api.call(Api.endpoints.Vehicles.Update, {urlParams: {id: makeId}, data})
            .then(result => {
                if (result) dispatch(loadMakes(selectedSC.id))
            })
            .catch(err => {
                console.log('update make error', err)
            })
    }
}

export const createMake = (data: ICreateMake): AppThunk => async dispatch => {
        Api.call(Api.endpoints.Vehicles.Create, {data})
            .then(result => {
                if (result) dispatch(loadMakes(data.serviceCenterId))
            })
            .catch(err => {
                console.log('update make error', err)
            })
}