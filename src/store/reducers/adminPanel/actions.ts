import { createAction } from '@reduxjs/toolkit';

export const setAllocationTab = createAction<string>('AdminPanel/SetAllocationTab');
export const setVehicleServicesTab = createAction<string>('AdminPanel/SetVehicleServicesTab');
export const setTimeDifferentiationTab = createAction<string>(
  'AdminPanel/SetTimeDifferentiationTab'
);
