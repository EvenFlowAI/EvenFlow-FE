import {createAction} from "@reduxjs/toolkit";
import {IProximity} from "./types";
import {AppThunk} from "../../../types/types";
import {Api} from "../../../config/requests";

export const getProximity = createAction<IProximity[]>("SlotScoring/GetProximity");
export const loadProximity = (serviceCenterId?: number, podId?: number): AppThunk => async dispatch => {
    const {data} = await Api.call<IProximity[]>(
        Api.endpoints.SlotScoring.GetProximity,
        {params: {serviceCenterId, podId}}
    );
    dispatch(getProximity(data));
}
export const createProximity = (data: IProximity): AppThunk => async dispatch => {
    await Api.call(
        Api.endpoints.SlotScoring.SetProximity,
        {data}
    );
    dispatch(loadProximity(data.serviceCenterId, data.podId));
}