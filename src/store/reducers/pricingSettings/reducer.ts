import {createReducer} from "@reduxjs/toolkit";
import {
    IDayOfWeekSetting,
    IPricingDemand,
    IPricingLevel,
    IPricingSetting, IRequestPricingLevel,
    ITimeOfYearSetting,
    ITimeWindowEl
} from "./types";
import {
    getDayOfWeekPricing,
    getPricingCalculations,
    getPricingDemand,
    getPricingLevels, getRequestsPricingLevels,
    getSrList, getSRPricingSettings, getTimeOfYearPricing,
    getTimeWindows
} from "./actions";
import {IAssignedServiceRequest} from "../serviceRequests/types";

type TState = {
    pricingLevels: IPricingLevel[];
    timeWindows: ITimeWindowEl[];
    srList: IAssignedServiceRequest[];
    calculations: IPricingSetting[];
    pricingDemands: IPricingDemand[];
    dWeekPricing: IDayOfWeekSetting[];
    tYearPricing: ITimeOfYearSetting[];
    srPricingLevels: IRequestPricingLevel[];
    srPricingSettings: IRequestPricingLevel[];
}
const initialState: TState = {
    pricingLevels: [],
    timeWindows: [],
    srList: [],
    calculations: [],
    pricingDemands: [],
    dWeekPricing: [],
    tYearPricing: [],
    srPricingLevels: [],
    srPricingSettings: [],
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
    .addCase(getDayOfWeekPricing, (state, {payload}) => {
        return {...state, dWeekPricing: payload};
    })
    .addCase(getTimeOfYearPricing, (state, {payload}) => {
        return {...state, tYearPricing: payload};
    })
    .addCase(getRequestsPricingLevels, (state, {payload}) => {
        return {...state, srPricingLevels: payload};
    })
    .addCase(getSRPricingSettings, (state, {payload}) => {
        return {...state, srPricingSettings: payload};
    })
);