import {createReducer} from "@reduxjs/toolkit";
import {IPricingLevel, IPricingSetting, ITimeWindowEl} from "./types";
import {getPricingCalculations, getPricingLevels, getSrList, getTimeWindows} from "./actions";
import {IAssignedServiceRequest} from "../serviceRequests/types";

type TState = {
    pricingLevels: IPricingLevel[];
    timeWindows: ITimeWindowEl[];
    srList: IAssignedServiceRequest[];
    calculations: IPricingSetting[];
}
const initialState: TState = {
    pricingLevels: [],
    timeWindows: [],
    srList: [],
    calculations: [],
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
    .addCase(getPricingCalculations, (state, {payload}) => {
        return {...state, calculations: payload};
    })
);