import { DialogProps } from '../../../components/modals/BaseModal/types';
import { ICapacitySetting } from '../../../store/reducers/capacityManagement/types';
import { TOption } from '../ServiceBookModal/types';
import { EDayOfWeek } from '../../../store/reducers/offers/types';

export type TProps = DialogProps & { editingItem: ICapacitySetting | null };

export type TDayTime = {
  day: EDayOfWeek;
  time: string;
};

export interface TForm {
  serviceBookName: string;
  gapSlotsType: TOption | null;
  appointmentsPerSlot: number | null;
  appointmentLeadTime: number | null;
  technicianEfficiency: number | null;
  averageBillHoursPerRO: number | null;
  cutOffTime: TDayTime[];
  isAdvisorStaffingFactor?: boolean;
}
