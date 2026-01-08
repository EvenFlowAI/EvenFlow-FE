import { TOption, TTimeObject } from '../types';
import { ITransportationOptionFull } from '../../../../store/reducers/transportationNeeds/types';
import dayjs from 'dayjs';

export type TRuleState = {
  id?: number;
  name: string;
  daysOfWeek: TOption[];
  timeOfDay: TTimeObject | null;
  serviceRequests: TOption[];
  serviceRequestFilterMode: TOption | null;
  capacity?: number;
  expanded: boolean;
  state: number;
  orderIndex: number;
  dirty?: boolean;
};

export const transformTransportationRules = (
  editingElement: ITransportationOptionFull | null,
  dayOfWeekOptions: TOption[],
  filterModeOptions: TOption[]
): TRuleState[] => {
  if (!editingElement?.rules?.length) return [];

  const parseTime = (time?: string | null) => {
    if (!time) return null;
    const [h, m, s] = time.split(':').map(Number);
    if (isNaN(h) || isNaN(m) || isNaN(s)) return null;
    return dayjs().utc().hour(h).minute(m).second(s);
  };

  return [...editingElement.rules]
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
    .map(rule => {
      const days = dayOfWeekOptions.filter(item => rule.dayOfWeeks?.includes(item.value)) || [];
      const serviceRequestFilterMode = filterModeOptions.filter(
        item => rule.serviceRequestFilterMode == item.value
      )[0];
      const updatedServiceRequests =
        rule.serviceRequests?.map(item => ({
          value: item.id,
          name: item.code,
        })) || [];

      return {
        id: rule.id,
        name: rule.name,
        daysOfWeek: days,
        timeOfDay: {
          start: rule.timeOfDay?.start ? parseTime(rule.timeOfDay?.start) : null,
          end: rule.timeOfDay?.end ? parseTime(rule.timeOfDay?.end) : null,
        },
        serviceRequests: updatedServiceRequests,
        serviceRequestFilterMode: serviceRequestFilterMode,
        capacity: rule.capacity,
        expanded: false,
        state: rule.state,
        orderIndex: rule.orderIndex,
        dirty: false,
      };
    });
};

export const buildTransportationRulePayload = (
  rules: TRuleState[],
  ruleIndex: number,
  editingElement: ITransportationOptionFull
) => {
  const rule = rules[ruleIndex];
  if (!rule || !editingElement) return null;

  return {
    name: rule.name,
    transportationOptionId: editingElement.id,
    timeOfDay:
      rule.timeOfDay?.start != null || rule.timeOfDay?.end != null
        ? {
            start: rule.timeOfDay?.start ? dayjs(rule.timeOfDay.start).format('HH:mm:ss') : null,
            end: rule.timeOfDay?.end ? dayjs(rule.timeOfDay.end).format('HH:mm:ss') : null,
          }
        : undefined,
    serviceRequests: rule.serviceRequests.map(item => item.value),
    serviceRequestFilterMode: rule.serviceRequestFilterMode?.value,
    dayOfWeeks: rule.daysOfWeek.map(item => item.value),
    capacity: rule.capacity,
    state: rule.state,
    orderIndex: ruleIndex,
  };
};

export const buildTransportationRulePayloadById = (
  rules: TRuleState[],
  ruleId: number,
  editingElement: ITransportationOptionFull
) => {
  const ruleIndex = rules.findIndex(r => r.id === ruleId);
  const rule = rules[ruleIndex];
  if (!rule || !editingElement) return null;

  return {
    name: rule.name,
    transportationOptionId: editingElement.id,
    timeOfDay:
      rule.timeOfDay?.start != null || rule.timeOfDay?.end != null
        ? {
            start: rule.timeOfDay?.start ? dayjs(rule.timeOfDay.start).format('HH:mm:ss') : null,
            end: rule.timeOfDay?.end ? dayjs(rule.timeOfDay.end).format('HH:mm:ss') : null,
          }
        : undefined,
    serviceRequests: rule.serviceRequests.map(item => item.value),
    serviceRequestFilterMode: rule.serviceRequestFilterMode?.value,
    dayOfWeeks: rule.daysOfWeek.map(item => item.value),
    capacity: rule.capacity,
    state: rule.state,
    orderIndex: ruleIndex,
  };
};

export const getOriginalRuleState = (
  editingElement: ITransportationOptionFull,
  ruleIndex: number,
  dayOfWeekOptions: TOption[],
  filterModeOptions: TOption[]
): TRuleState | null => {
  const original = editingElement.rules?.[ruleIndex];
  if (!original) return null;

  const [startHours, startMinutes, startSeconds] = original.timeOfDay?.start?.split(':') || [];
  const [endHours, endMinutes, endSeconds] = original.timeOfDay?.end?.split(':') || [];

  const days = dayOfWeekOptions.filter(item => original.dayOfWeeks?.includes(item.value)) || [];
  const serviceRequestFilterMode = filterModeOptions.filter(
    item => original.serviceRequestFilterMode == item.value
  )[0];

  const updatedServiceRequests =
    original.serviceRequests?.map(item => ({
      value: item.id,
      name: item.code,
    })) || [];

  return {
    id: original.id,
    name: original.name,
    daysOfWeek: days,
    timeOfDay: {
      start: original?.timeOfDay?.start
        ? dayjs.utc().hour(+startHours).minute(+startMinutes).second(+startSeconds)
        : null,
      end: original?.timeOfDay?.end
        ? dayjs.utc().hour(+endHours).minute(+endMinutes).second(+endSeconds)
        : null,
    },
    serviceRequests: updatedServiceRequests,
    serviceRequestFilterMode: serviceRequestFilterMode,
    capacity: original.capacity,
    expanded: false,
    state: original.state,
    orderIndex: original.orderIndex,
    dirty: false,
  };
};

export const calculateMaxVisibleTags = (
  selectedValues: TOption[],
  containerWidth = 500
): number => {
  if (selectedValues.length === 0) return 0;

  const avgChipWidth =
    selectedValues.reduce((sum, item) => {
      return sum + (55 + item.name.length * 5); // 55px базово + ~5px за символ
    }, 0) / selectedValues.length;

  const availableWidth = containerWidth - 40; // padding
  const chipsPerRow = Math.floor(availableWidth / (avgChipWidth + 4)); // 4px margin

  if (selectedValues.length <= chipsPerRow) {
    return selectedValues.length;
  }

  const othersChipWidth = 100; // "+X others"
  const maxVisibleWithOthers = Math.floor((availableWidth - othersChipWidth) / (avgChipWidth + 8));

  return Math.max(1, maxVisibleWithOthers);
};
