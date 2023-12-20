import {EDay, IUnplannedDemand, IUnplannedDemandBySlot} from "../../../store/reducers/demandSegments/types";
import moment from "moment/moment";
import {timeSpanString} from "../../../config/constants";

export const remapSegments = (sl: IUnplannedDemand[]): IUnplannedDemand[] => {
    const blankDemand: IUnplannedDemand = {
        day: EDay.Sunday,
        historicalWalkInScheduleBlocks: 0,
        optimizerSetting: 0,
        serviceCenterId: 0
    }

    return moment.weekdays().map((d, idx) => {
        return sl.find(s => s.day === idx as EDay) || {...blankDemand};
    })
}

export const sortSlots = (slots: IUnplannedDemandBySlot[]): IUnplannedDemandBySlot[] => {
    return slots.sort((a, b) => {
        return moment(a.start, timeSpanString).diff(moment(b.start, timeSpanString)) > 0 ? 1 : -1
    })
}