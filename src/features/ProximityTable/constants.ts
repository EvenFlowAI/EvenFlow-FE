import {SliderRange, TForm, TProximity, TRow} from "./types";
import {EProximityType} from "../../store/reducers/slotScoring/types";

export const blankSlider: TProximity = {point: SliderRange.Default};

export const initialForm: TForm = {
    [EProximityType.Closest]: {...blankSlider},
    [EProximityType.Earliest]: {...blankSlider},
}

export const rows: TRow[] = [
    {
        id: EProximityType.Closest,
        label: "Closest available"
    },
    {
        id: EProximityType.Earliest,
        label: "Earliest available"
    }
]