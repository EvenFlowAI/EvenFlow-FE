import {ETimeSlotType} from "../../../store/reducers/slotScoring/types";
import {TGap} from "./types";

export const gaps: TGap[] = [
    {label: "10-minutes Gap Slots", type: ETimeSlotType.TenMinutes},
    {label: "15-minutes Gap Slots", type: ETimeSlotType.FifteenMinutes},
    {label: "30-minutes Gap Slots", type: ETimeSlotType.ThirtyMinutes},
    {label: "60-minutes Gap Slots", type: ETimeSlotType.SixtyMinutes}
];