import {ETimeSlotType} from "../../../../store/reducers/slotScoring/types";
import {EDesirabilityDays} from "./types";
import {getOptions} from "../../../../utils/utils";
import {TOption} from "../../../../utils/types";

export const initialForm = {
    timeSlotType: ETimeSlotType.ThirtyMinutes,
    items: []
};
export const days = Object.keys(EDesirabilityDays).filter(key => Number.isNaN(+key));
export const allDaysOption: TOption = {name: "All Days", value: 8};
export const dayOfWeekOptions = [allDaysOption].concat(...getOptions(days).slice(1).concat({name: "Sunday", value: 0}));