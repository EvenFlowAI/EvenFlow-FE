import {EDayDemand} from "../../../../store/reducers/pricingSettings/types";
import * as React from "react";

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

export type TMark = {
    value: number;
    label?: React.ReactNode;
}