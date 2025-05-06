import { TableRowDataType } from '../../../types/types';
import { ICapacitySetting } from '../../../store/reducers/capacityManagement/types';
import dayjs from 'dayjs';
import { timeSpanString } from '../../../utils/constants';
import { ETimeSlotType } from '../../../store/reducers/slotScoring/types';

export const SlotGapMap = {
  [ETimeSlotType.TenMinutes]: '10-minutes',
  [ETimeSlotType.FifteenMinutes]: '15-minutes',
  [ETimeSlotType.ThirtyMinutes]: '30-minutes',
  [ETimeSlotType.SixtyMinutes]: '60-minutes',
};

export const RowData: TableRowDataType<ICapacitySetting>[] = [
  {
    header: 'ID',
    val: el => (el.serviceBookId ? el.serviceBookId?.toString() : '-'),
    align: 'center',
  },
  {
    header: 'Service Book Name',
    val: el => el.serviceBookName,
    width: 128,
    align: 'left',
  },
  {
    header: 'Appointment Gap Slots',
    val: el => SlotGapMap[el.gapSlotsType],
    align: 'left',
    width: 120,
  },
  {
    header: 'Appointments Per Slot',
    val: el => el.appointmentsPerSlot?.toString(),
    align: 'left',
    width: 120,
  },
  {
    header: 'Appointment Lead Time',
    val: el => el.appointmentLeadTime?.toString(),
    align: 'left',
    width: 120,
  },
  {
    header: `Appointment Cut Off`,
    val: el => (el.cutOffTime ? dayjs(el.cutOffTime, timeSpanString).format('h:mm a') : '-'),
    align: 'left',
    width: 120,
  },
  {
    header: 'Technician Efficiency',
    val: el => `${el.technicianEfficiency?.toString()}%`,
    align: 'left',
  },
  {
    header: 'Average RO Hours',
    val: el => el.avarageBillHoursPerRO?.toString(),
    align: 'left',
  },
  {
    header: 'Advisor Staffing Factor',
    val: el => (el.isAdvisorStaffingFactor ? 'On' : 'Off'),
    align: 'left',
    width: 135,
  },
];
