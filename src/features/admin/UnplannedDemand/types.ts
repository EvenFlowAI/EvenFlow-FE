import { EDay } from '../../../store/reducers/demandSegments/types';

export type DForm = {
  [D in EDay]: DemandCapacityI;
};

export interface DemandCapacityI {
  dayOfWeek: EDay;
  appointmentCapacity: number;
  productionCapacity: number;
}
