import {createAction} from "@reduxjs/toolkit";
import {IGlobalMake} from "./types";
import {AppThunk} from "../../../types/types";
import {Api} from "../../../api/ApiEndpoints/ApiEndpoints";

export const getMakes = createAction<IGlobalMake[]>("GlobalVehicles/GetMakes")

export const loadGlobalMakes = (): AppThunk => (dispatch) => {
    Api.call(Api.endpoints.GlobalVehicles.GetMakes, {data: {pageIndex: 0, pageSize: 10}})
        .then(res => {
            console.log(res)
        }).catch(err => {
        console.log(err)
    })
}