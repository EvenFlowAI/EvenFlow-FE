import {createReducer} from "@reduxjs/toolkit";
import {
    setCurrentZone,
    setLoading,
    setMobileServicePrisingByDistance,
    setMobileServicePrisingByZones,
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
}

const initialState: TState = {
    isLoading: false,
    currentZone: null,
    zones: [],
    pricingByZones: [],
    pricingByDistance: [],
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
)