import {createReducer} from "@reduxjs/toolkit";
import {TState} from "./types";
import {
    getDayOfWeekPricing,
    getMPList,
    getMPPricingSettings,
    getPackageOptionsList,
    getPackagePricingLevels,
    getPricingCalculations,
    getPricingDemand,
    getPricingLevels,
    getRequestsPricingLevels,
    getRoundPriceSetting,
    getSrList,
    getSRPricingSettings,
    getTimeOfYearPricing,
    getTimeWindows,
    setLoading,
    setRoundPriceLoading
} from "./actions";

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
    mpPricingSettings: [],
    mpOptionsList: [],
    isLoading: false,
    isRoundPriceLoading: false,
    roundPrice: false,
    mpPricingLevels: [],
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
    .addCase(setRoundPriceLoading, (state, { payload }) => {
        return {...state, isRoundPriceLoading: payload};
    })
    .addCase(getRoundPriceSetting, (state, { payload }) => {
        return {...state, roundPrice: payload};
    })
    .addCase(getMPPricingSettings, (state, { payload }) => {
        return {...state, mpPricingSettings: payload};
    })
    .addCase(getPackagePricingLevels, (state, { payload }) => {
        return {...state, mpPricingLevels: payload}
    })
    .addCase(getPackageOptionsList, (state, { payload }) => {
        return {...state, mpOptionsList: payload}
    })
);