import { EDay } from '../../../store/reducers/demandSegments/types';
import { DemandCapacityI } from './types';

export const initialDayCapacity = {} as DemandCapacityI;

export const initialStateByCapacity = {
  [EDay.Sunday]: { ...initialDayCapacity, dayOfWeek: EDay.Sunday },
  [EDay.Monday]: { ...initialDayCapacity, dayOfWeek: EDay.Monday },
  [EDay.Tuesday]: { ...initialDayCapacity, dayOfWeek: EDay.Tuesday },
  [EDay.Wednesday]: { ...initialDayCapacity, dayOfWeek: EDay.Wednesday },
  [EDay.Thursday]: { ...initialDayCapacity, dayOfWeek: EDay.Thursday },
  [EDay.Friday]: { ...initialDayCapacity, dayOfWeek: EDay.Friday },
  [EDay.Saturday]: { ...initialDayCapacity, dayOfWeek: EDay.Saturday },
};
