import {EDayDemand} from "../../../store/reducers/pricingSettings/types";

export type TForm = {
    [k in EDayDemand]: number;
}

export type TZone = "orange" | "red";

export type ESliderRange = {
    Min: number;
    Zones: [string, TZone, number][]
    Max: number;
    Default: number;
    Step: number;
    Inverted: boolean;
}