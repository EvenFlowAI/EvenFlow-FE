import {
  EDay,
  IUnplannedDemand,
  IUnplannedDemandBySlot,
} from "../../../store/reducers/demandSegments/types";
import { timeSpanString } from "../../../utils/constants";
import dayjs from "dayjs";

export const remapSegments = (sl: IUnplannedDemand[]): IUnplannedDemand[] => {
  const blankDemand: IUnplannedDemand = {
    day: EDay.Sunday,
    historicalWalkInScheduleBlocks: 0,
    optimizerSetting: 0,
    serviceCenterId: 0,
  };

  return dayjs.weekdays().map((d, idx) => {
    return sl.find((s) => s.day === (idx as EDay)) || { ...blankDemand };
  });
};

export const sortSlots = (
  a: IUnplannedDemandBySlot,
  b: IUnplannedDemandBySlot,
): number => {
  const startDiff = dayjs(a.start, timeSpanString).diff(
    dayjs(b.start, timeSpanString),
  );
  const endDiff = dayjs(a.end, timeSpanString).diff(
    dayjs(b.end, timeSpanString),
  );
  return startDiff > 0 || endDiff > 0 ? 1 : -1;
};
