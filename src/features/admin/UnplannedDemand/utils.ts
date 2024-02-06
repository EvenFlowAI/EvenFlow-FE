import {EDay, IUnplannedDemand, IUnplannedDemandBySlot} from "../../../store/reducers/demandSegments/types";
import {timeSpanString} from "../../../utils/constants";
import dayjs from "dayjs";

export const remapSegments = (sl: IUnplannedDemand[]): IUnplannedDemand[] => {
    const blankDemand: IUnplannedDemand = {
        day: EDay.Sunday,
        historicalWalkInScheduleBlocks: 0,
        optimizerSetting: 0,
        serviceCenterId: 0
    }

    return dayjs.weekdays().map((d, idx) => {
        return sl.find(s => s.day === idx as EDay) || {...blankDemand};
    })
}

export const sortSlots = (slots: IUnplannedDemandBySlot[]): IUnplannedDemandBySlot[] => {
    return slots.sort((a, b) => {
        return dayjs(a.start, timeSpanString).diff(dayjs(b.start, timeSpanString)) > 0 ? 1 : -1
    })
}