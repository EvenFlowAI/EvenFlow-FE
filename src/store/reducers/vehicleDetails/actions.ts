import {createAction} from "@reduxjs/toolkit";
import {AppThunk} from "../../../types/types";
import {Api} from "../../../config/requests";
import {IMake} from "../../../api/types";

export const getMakes = createAction<IMake[]>('VehicleDetails/GetMakes');
export const setCurrentMake = createAction<IMake | null>('VehicleDetails/SetCurrentMake');

export const loadMakes = (serviceCenterId: number): AppThunk => async dispatch => {
    Api.call(Api.endpoints.Vehicles.Makes, {params: {serviceCenterId}})
        .then(result => {
            if (result?.data) {
                dispatch(getMakes(result.data))
            }
        })
}