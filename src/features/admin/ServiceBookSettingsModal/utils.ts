import { SlotGapMap } from '../CapacitySettingsTable/constants';
import { ETimeSlotType } from '../../../store/reducers/slotScoring/types';
import { TOption } from '../../../utils/types';
import { TDayTime, TForm } from './types';
import {
  ICapacitySetting,
  ICapacitySettingRequestData,
} from '../../../store/reducers/capacityManagement/types';

export const getGapSlotOptions = (): TOption[] => {
  return Object.keys(ETimeSlotType)
    .filter(key => !Number.isNaN(+key))
    .map(el => ({ value: +el, name: SlotGapMap[+el as ETimeSlotType] }));
};

export function validateGapSlotsType(form: TForm, showError: (msg: string) => void): boolean {
  if (!form.gapSlotsType) {
    showError('"Appointment Gap Slots" must not be empty');
    return false;
  }
  return true;
}

export function validateServiceBookName(
  form: TForm,
  editingItem: ICapacitySetting | null,
  showError: (msg: string) => void
): boolean {
  if (!form.serviceBookName && editingItem?.serviceBookId) {
    showError('"Service Book Name" must not be empty');
    return false;
  }
  return true;
}

export function validateNumbers(form: TForm, showError: (msg: string) => void): boolean {
  let isValid = true;

  if (form.averageBillHoursPerRO !== null && form.averageBillHoursPerRO < 0) {
    showError('"Average Bill Per RO" must be equal or more than 0');
    isValid = false;
  }
  if (form.appointmentLeadTime !== null && form.appointmentLeadTime < 0) {
    showError('"Appointment Lead Time" must be equal or more than 0');
    isValid = false;
  }
  if (form.appointmentsPerSlot !== null && form.appointmentsPerSlot < 0) {
    showError('"Appointments Per Slots" must be equal or more than 0');
    isValid = false;
  }

  return isValid;
}

export function validateTechnicianEfficiency(
  form: TForm,
  showError: (msg: string) => void
): boolean {
  if (form.technicianEfficiency === null || form.technicianEfficiency === undefined) return true;

  if (form.technicianEfficiency < 25) {
    showError('"Technician Efficiency" must be equal or more than 25');
    return false;
  }
  if (form.technicianEfficiency > 999) {
    showError('"Technician Efficiency" must be more than 999');
    return false;
  }
  if (!Number.isInteger(form.technicianEfficiency)) {
    showError('"Technician Efficiency" must be a whole number');
    return false;
  }
  return true;
}

export function validateCutOffTime(
  cutOffTime: TDayTime[],
  checkTimeItemIsValid: (el: TDayTime) => boolean,
  showError: (msg: string) => void
): boolean {
  if (cutOffTime.length && !cutOffTime.filter(el => el.time).find(el => checkTimeItemIsValid(el))) {
    showError('"Appointment Cut Off" should be inside of the working hours');
    return false;
  }
  return true;
}

export function buildCapacityData(
  form: TForm,
  selectedSCId: number,
  editingItem?: ICapacitySetting | null
): ICapacitySettingRequestData {
  const data: ICapacitySettingRequestData = {
    serviceCenterId: selectedSCId,
    gapSlotsType: form.gapSlotsType?.value ?? null,
    cutOffTime: form.cutOffTime.map(el => ({ day: el.day, value: el.time })),
    serviceBookName: form.serviceBookName,
  };
  if (typeof form.isAdvisorStaffingFactor !== 'undefined') {
    data.isAdvisorStaffingFactor = form.isAdvisorStaffingFactor;
  }
  if (editingItem?.serviceBookId) {
    data.serviceBookId = editingItem.serviceBookId;
    if (form.serviceBookName) {
      data.serviceBookName = form.serviceBookName;
    }
  }
  if (form.technicianEfficiency !== null && form.technicianEfficiency >= 0) {
    data.technicianEfficiency = form.technicianEfficiency;
  }
  if (form.averageBillHoursPerRO !== null && form.averageBillHoursPerRO >= 0) {
    data.averageBillHoursPerRO = form.averageBillHoursPerRO;
  }
  if (form.appointmentLeadTime !== null && form.appointmentLeadTime >= 0) {
    data.appointmentLeadTime = form.appointmentLeadTime;
  }
  if (form.appointmentsPerSlot !== null && form.appointmentsPerSlot >= 0) {
    data.appointmentsPerSlot = form.appointmentsPerSlot;
  }
  return data;
}
