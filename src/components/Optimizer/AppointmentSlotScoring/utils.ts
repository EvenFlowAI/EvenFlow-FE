import moment from "moment";
import {EDesirabilityState, ETimeSlotType} from "../../../store/reducers/slotScoring/types";

const inpFormat: string = "HH:mm:ss";
const start = moment("8:00:00", inpFormat);
const end = moment("18:00:00", inpFormat);
const gapToMin = (gap: ETimeSlotType): number => {
    switch (gap) {
        case ETimeSlotType.TenMinutes:
            return 10;
        case ETimeSlotType.FifteenMinutes:
            return 15;
        case ETimeSlotType.ThirtyMinutes:
            return 30;
        default:
            return 30;
    }
}
export type TSlot = {
    idx: number;
    id?: number;
    desirability: EDesirabilityState;
    start: moment.Moment;
    end: moment.Moment;
}
export const generateSlots = (gap: ETimeSlotType): TSlot[] => {
    const gapMinutes: number = gapToMin(gap);
    const slotsCount = end.diff(start, 'minutes') / gapMinutes;
    const slots: TSlot[] = [];
    let st = moment(start);
    let nd = moment(st).add(gapMinutes, "minutes");
    for (let i=1; i <= slotsCount; i++) {
        slots.push({
            idx: i-1,
            desirability: EDesirabilityState.Neutral,
            start: moment(st),
            end: moment(nd)
        });
        st = st.add(gapMinutes, "minutes");
        nd = nd.add(gapMinutes, "minutes");
    }
    return slots;
}