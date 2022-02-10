import {createReducer} from "@reduxjs/toolkit";
import {
    IDayOfWeekSetting,
    IPackagePricingLevels,
    IPackagePricingSettings,
    IPricingDemand,
    IPricingLevel,
    IPricingSetting, IRequestPricingSettings,
    ITimeOfYearSetting,
    ITimeWindowEl
} from "./types";
import {
    getMPPricingSettings,
    getDayOfWeekPricing,
    getMPList,
    getPackagePricingLevels,
    getPricingCalculations,
    getPricingDemand,
    getPricingLevels, getRequestsPricingLevels, getRoundPriceSetting,
    getSrList, getSRPricingSettings, getTimeOfYearPricing,
    getTimeWindows, setLoading, setRoundPriceLoading
} from "./actions";
import {IAssignedServiceRequest} from "../serviceRequests/types";
import {IPackageOptionShort, IPackageShort} from "../packages/types";

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
    mpPricingSettings: IPackagePricingSettings[];
    mpOptionsList: IPackageOptionShort[];
    isLoading: boolean;
    isRoundPriceLoading: boolean;
    roundPrice: boolean;
    mpPricingLevels: IPackagePricingLevels[];
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
);