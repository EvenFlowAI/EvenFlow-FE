import {EDesirabilityState, ETimeSlotType, IDesirability} from "../../../store/reducers/slotScoring/types";
import {TParsableDate} from "../../../types/types";
import dayjs from "dayjs";

const inpFormat: string = "HH:mm:ss";

const gapToMin = (gap: ETimeSlotType): number => {
    switch (gap) {
        case ETimeSlotType.TenMinutes:
            return 10;
        case ETimeSlotType.FifteenMinutes:
            return 15;
        case ETimeSlotType.ThirtyMinutes:
            return 30;
        case ETimeSlotType.SixtyMinutes:
            return 60;
        default:
            return 30;
    }
}
export type TSlot = {
    idx: number;
    id?: number;
    desirability: EDesirabilityState;
    start: TParsableDate;
    end: TParsableDate;
}
export const generateSlots = (gap: ETimeSlotType,
                              items: IDesirability[],
                              org?: ETimeSlotType,
                              startTime?: string,
                              endTime?: string,
                              createNewSlots?: boolean,
                              ): TSlot[] => {
    if (org === undefined) {
        org = gap;
    }
    const start = dayjs(startTime ?? "8:00:00", inpFormat);
    const end = dayjs(endTime ?? "18:00:00", inpFormat);
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
    let st = dayjs(start);

    let nd = dayjs(st).add(gapMinutes, "minutes");
    if (startTime && endTime && items.length) {
        for (let i=1; i <= slotsCount; i++) {
            const idx = i-1;
            const idxToLook = Math.floor(idx * idxMod);
            slots.push({
                idx,
                id: idxMod === 1 ? mappedItems[idxToLook]?.id : undefined,
                desirability: mappedItems[idxToLook]
                    ? items[idxToLook].desirability : EDesirabilityState.Neutral,
                start: items[idx]?.start && !createNewSlots ? dayjs(items[idx].start, 'HH:mm:SS') : dayjs(st),
                end: items[idx]?.end && !createNewSlots ? dayjs(items[idx].end, 'HH:mm:SS') : dayjs(nd)
            });
            st = st.add(gapMinutes, "minutes");
            nd = nd.add(gapMinutes, "minutes");
        }
    }
    return slots;
}