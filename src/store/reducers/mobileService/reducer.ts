import {createReducer} from "@reduxjs/toolkit";
import {
    setCurrentZone,
    setLoading,
    setMobileServicePrisingByDistance,
    setMobileServicePrisingByZones, setMobileServicePrisingOption, setPricingOptionLoading,
    setZones
} from "./actions";
import {TZone} from "./types";
import {IDistancePriceSettings, IZonePriceSettings} from "../serviceValet/types";

type TState = {
    isLoading: boolean;
    currentZone: any;
    zones: TZone[];
    pricingByZones: IZonePriceSettings[];
    pricingByDistance: IDistancePriceSettings[];
    isPricingByZoneLoading: boolean;
    pricingCountByZone: boolean;
}

const initialState: TState = {
    isLoading: false,
    currentZone: null,
    zones: [],
    pricingByZones: [],
    pricingByDistance: [],
    isPricingByZoneLoading: false,
    pricingCountByZone: true,
}

export const mobileServiceReducer = createReducer<TState>(initialState, builder => builder
    .addCase(setCurrentZone, (state, {payload}) => {
        return {...state, currentZone: payload};
    })
    .addCase(setLoading, (state, {payload}) => {
        return {...state, isLoading: payload}
    })
    .addCase(setZones, (state, {payload}) => {
        return {...state, zones: payload}
    })
    .addCase(setMobileServicePrisingByZones, (state, {payload}) => {
        return {...state, pricingByZones: payload}
    })
    .addCase(setMobileServicePrisingByDistance, (state, {payload}) => {
        return {...state, pricingByDistance: payload}
    })
    .addCase(setMobileServicePrisingOption, (state, {payload}) => {
        return {...state, pricingCountByZone: payload}
    })
    .addCase(setPricingOptionLoading, (state, {payload}) => {
        return {...state, isPricingByZoneLoading: payload}
    })
)