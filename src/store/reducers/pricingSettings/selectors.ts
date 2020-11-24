import {RootState} from "../../rootReducer";
import {createSelector} from "@reduxjs/toolkit";
import {EDay, EDemandCategory, EDemandType, IPricingDemand, IPricingSetting} from "./types";
import {TEnumValueMap} from "../utils";

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
export const demandSelector = (state: RootState) => state.pricingSettings.pricingDemands;
export type TMappedDemands = TEnumValueMap<EDemandCategory, IPricingDemand>;
export const mappedPricingDemandsSelectorDWeek = createSelector(
    demandSelector,
    items => items
        .filter(i => i.type === EDemandType.DayOfWeek)
        .reduce((acc, item) => {
            acc[item.demandCategory] = item;
            return acc;
        }, {} as TMappedDemands)
);
export const mappedPricingDemandsSelectorDYear = createSelector(
    demandSelector,
    items => items
        .filter(i => i.type === EDemandType.TimeOfYear)
        .reduce((acc, item) => {
            acc[item.demandCategory] = item;
            return acc;
        }, {} as TMappedDemands)
);