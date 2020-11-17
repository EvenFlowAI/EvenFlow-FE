import {createReducer} from "@reduxjs/toolkit";
import {IPricingLevel, ITimeWindowEl} from "./types";
import {getPricingLevels, getTimeWindows} from "./actions";

type TState = {
    pricingLevels: IPricingLevel[];
    timeWindows: ITimeWindowEl[];
}
const initialState: TState = {
    pricingLevels: [],
    timeWindows: []
};
export const pricingSettingsReducer = createReducer<TState>(initialState, builder => builder
    .addCase(getPricingLevels, (state, {payload}) => {
        return {...state, pricingLevels: payload};
    })
    .addCase(getTimeWindows, (state, {payload}) => {
        return {...state, timeWindows: payload};
    })
);