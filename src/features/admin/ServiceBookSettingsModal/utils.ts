import { SlotGapMap } from "../CapacitySettingsTable/constants";
import { ETimeSlotType } from "../../../store/reducers/slotScoring/types";
import { TOption } from "../../../utils/types";

export const getGapSlotOptions = (): TOption[] => {
  return Object.keys(ETimeSlotType)
    .filter((key) => !Number.isNaN(+key))
    .map((el) => ({ value: +el, name: SlotGapMap[+el as ETimeSlotType] }));
};
