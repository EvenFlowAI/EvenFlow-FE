import {createReducer} from "@reduxjs/toolkit";
import {IPricingLevel, ITimeWindowEl} from "./types";
import {getPricingLevels, getSrList, getTimeWindows} from "./actions";
import {IAssignedServiceRequest} from "../serviceRequests/types";

type TState = {
    pricingLevels: IPricingLevel[];
    timeWindows: ITimeWindowEl[];
    srList: IAssignedServiceRequest[];
}
const initialState: TState = {
    pricingLevels: [],
    timeWindows: [],
    srList: [],
};
export const pricingSettingsReducer = createReducer<TState>(initialState, builder => builder
    .addCase(getPricingLevels, (state, {payload}) => {
        return {...state, pricingLevels: payload};
    })
    .addCase(getTimeWindows, (state, {payload}) => {
        return {...state, timeWindows: payload};
    })
    .addCase(getSrList, (state, {payload}) => {
        return {...state, srList: payload};
    })
);