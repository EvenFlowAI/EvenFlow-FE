import moment from "moment";
import {EDesirabilityState, ETimeSlotType, IDesirability} from "../../../store/reducers/slotScoring/types";

const inpFormat: string = "HH:mm:ss";

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
export const generateSlots = (gap: ETimeSlotType,
                              items: IDesirability[],
                              org?: ETimeSlotType,
                              startTime?: string,
                              endTime?: string,
                              ): TSlot[] => {
    if (org === undefined) {
        org = gap;
    }
    // TODO change form hardcode when time slots will be tied to desirability on the back and front
    const start = moment(startTime ?? "8:00:00", inpFormat);
    const end = moment(endTime ?? "18:00:00", inpFormat);
    // const start = moment("8:00:00", inpFormat);
    // const end = moment("18:00:00", inpFormat);
    const gapMinutes: number = gapToMin(gap);
    const gapOrg: number = gapToMin(org);
    const mappedItems = items.reduce((acc, i) => {
        acc[i.index] = i;
        return acc;
    }, [] as IDesirability[]);

    const slotsCount = end.diff(start, 'minutes') / gapMinutes;
    const orgSlotsCount = end.diff(start, "minutes") / gapOrg;

    const idxMod = orgSlotsCount / (slotsCount ? slotsCount : 1);
    const slots: TSlot[] = [];
    let st = moment(start);
    let nd = moment(st).add(gapMinutes, "minutes");
    for (let i=1; i <= slotsCount; i++) {
        const idx = i-1;
        const idxToLook = Math.floor(idx * idxMod);
        slots.push({
            idx,
            id: idxMod === 1 ? mappedItems[idxToLook]?.id : undefined,
            desirability: mappedItems[idxToLook]
                ? items[idxToLook].desirability : EDesirabilityState.Neutral,
            start: moment(st),
            end: moment(nd)
        });
        st = st.add(gapMinutes, "minutes");
        nd = nd.add(gapMinutes, "minutes");
    }
    return slots;
}