import {EDayDemand} from "../../../../store/reducers/pricingSettings/types";
import {Mark} from "@material-ui/core";
import {ESliderRange, TForm} from "./types";

export const sliderRange: {[k in EDayDemand]: ESliderRange} = {
    [EDayDemand.Low]: {Min: -10, Max: 0, Default: 0, Step: .1, Inverted: true, Zones: [["-2", "orange", -2], ["-4", "red", -4]]},
    [EDayDemand.High]: {Min: 0, Max: 10, Default: 0, Step: .1, Inverted: false, Zones: [["2", "orange", 2], ["4", "red", 4]]},
}

export const sliderMarks = (t: EDayDemand): Mark[] => [
    {label: sliderRange[t].Min, value: sliderRange[t].Min},
    ...sliderRange[t].Zones.map(z => ({label: z[0], value: z[2]})),
    {label: sliderRange[t].Max, value: sliderRange[t].Max},
];

export const initialForm: TForm = {
    [EDayDemand.Low]: 0,
    [EDayDemand.High]: 0,
}