import {RootState} from "../../rootReducer";
import {createSelector} from "@reduxjs/toolkit";
import {EDay, IPricingSetting} from "./types";
type TMappedCalculations = {
    [k in EDay]: IPricingSetting
}
export const calculationsSelector = (state: RootState) => state.pricingSettings.calculations;
export const mappedCalculationsSelector = createSelector(
    calculationsSelector,
    items => items.reduce((acc, item) => {
        acc[item.day] = item;
        return acc;
    }, {} as TMappedCalculations)
);