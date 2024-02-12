import {EDesirabilityState} from "../../../../../store/reducers/slotScoring/types";

export const getColor = (ds: EDesirabilityState, cds: EDesirabilityState): "primary" | "inherit" => {
    return ds === cds ? "primary" : "inherit";
}