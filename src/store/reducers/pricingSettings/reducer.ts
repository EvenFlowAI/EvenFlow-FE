import {createReducer} from "@reduxjs/toolkit";
import {IPricingLevel} from "./types";
import {getPricingLevels} from "./actions";

type TState = {
    pricingLevels: IPricingLevel[];
}
const initialState: TState = {
    pricingLevels: []
};
export const pricingSettingsReducer = createReducer(initialState, builder => builder
    .addCase(getPricingLevels, (state, {payload}) => {
        return {state, pricingLevels: payload};
    })
);