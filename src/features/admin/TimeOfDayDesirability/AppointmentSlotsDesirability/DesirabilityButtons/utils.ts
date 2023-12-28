import {EDesirabilityState} from "../../../../../store/reducers/slotScoring/types";

export const getColor = (ds: EDesirabilityState, cds: EDesirabilityState): "primary" | "default" => {
    return ds === cds ? "primary" : "default";
}