import {createReducer} from "@reduxjs/toolkit";
import {IServiceCenterProfile} from "./types";
import {getServiceCenterProfile} from "./actions";

type TState = {
    scProfile?: IServiceCenterProfile
}
const initialState: TState = {

}
export const appointmentReducer = createReducer(initialState, builder => builder
    .addCase(getServiceCenterProfile, (state, {payload}) => {
        return {...state, scProfile: payload};
    })
);