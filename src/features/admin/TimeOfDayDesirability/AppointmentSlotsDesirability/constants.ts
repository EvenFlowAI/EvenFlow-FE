import {ETimeSlotType} from "../../../../store/reducers/slotScoring/types";
import {EDesirabilityDays} from "./types";

export const initialForm = {
    timeSlotType: ETimeSlotType.ThirtyMinutes,
    items: []
};
export const days = Object.keys(EDesirabilityDays).filter(key => Number.isNaN(+key));