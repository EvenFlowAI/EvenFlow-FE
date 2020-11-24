import {createReducer} from "@reduxjs/toolkit";
import {IPricingDemand, IPricingLevel, IPricingSetting, ITimeWindowEl} from "./types";
import {getPricingCalculations, getPricingDemand, getPricingLevels, getSrList, getTimeWindows} from "./actions";
import {IAssignedServiceRequest} from "../serviceRequests/types";

type TState = {
    pricingLevels: IPricingLevel[];
    timeWindows: ITimeWindowEl[];
    srList: IAssignedServiceRequest[];
    calculations: IPricingSetting[];
    pricingDemands: IPricingDemand[];
}
const initialState: TState = {
    pricingLevels: [],
    timeWindows: [],
    srList: [],
    calculations: [],
    pricingDemands: []
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
    .addCase(getPricingDemand, (state, {payload}) => {
        return {...state, pricingDemands: payload};
    })
);