import {createReducer} from "@reduxjs/toolkit";
import {
    IDayOfWeekSetting,
    IPricingDemand,
    IPricingLevel,
    IPricingSetting, IRequestPricingSettings,
    ITimeOfYearSetting,
    ITimeWindowEl
} from "./types";
import {
    getDayOfWeekPricing, getMPList,
    getPricingCalculations,
    getPricingDemand,
    getPricingLevels, getRequestsPricingLevels,
    getSrList, getSRPricingSettings, getTimeOfYearPricing,
    getTimeWindows, setLoading
} from "./actions";
import {IAssignedServiceRequest} from "../serviceRequests/types";
import {IPackageShort} from "../packages/types";

type TState = {
    pricingLevels: IPricingLevel[];
    timeWindows: ITimeWindowEl[];
    srList: IAssignedServiceRequest[];
    calculations: IPricingSetting[];
    pricingDemands: IPricingDemand[];
    dWeekPricing: IDayOfWeekSetting[];
    tYearPricing: ITimeOfYearSetting[];
    srPricingLevels: IRequestPricingSettings[];
    srPricingSettings: IRequestPricingSettings[];
    mpList: IPackageShort[];
    isLoading: boolean;
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
    mpList: [],
    isLoading: false,
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
    .addCase(setLoading, (state, {payload}) => {
        return {...state, isLoading: payload};
    })
    .addCase(getMPList, (state, {payload}) => {
        return {...state, mpList: payload};
    })
);