import { combineReducers } from '@reduxjs/toolkit';
import { usersReducer } from './reducers/users/reducer';
import { dealershipGroupsReducer } from './reducers/dealershipGroups/reducer';
import { employeesReducer, scEmployees } from './reducers/employees/reducer';
import { serviceCenterReducer } from './reducers/serviceCenters/reducer';
import { modalsReducer } from './reducers/modals/reducer';
import { holidaysReducer } from './reducers/holidays/reducer';
import { valueSettingsReducer } from './reducers/valueSettings/reducer';
import { serviceRequestsReducer } from './reducers/serviceRequests/reducers';
import { podsReducer } from './reducers/pods/reducer';
import { slotScoringReducer } from './reducers/slotScoring/reducer';
import { demandSegmentsReducer } from './reducers/demandSegments/reducer';
import { optimizationWindowsReducer } from './reducers/optimizationWindows/reducer';
import { schedulesReducer } from './reducers/schedules/reducer';
import { offersReducer } from './reducers/offers/reducer';
import { appointmentReducer } from './reducers/appointment/reducer';
import { pricingSettingsReducer } from './reducers/pricingSettings/reducer';
import { appointmentFrameReducer } from './reducers/appointmentFrameReducer/reducer';
import { packagesReducer } from './reducers/packages/reducer';
import { vehicleDetailsReducer } from './reducers/vehicleDetails/reducer';
import { transportationOptionsReducer } from './reducers/transportationNeeds/reducer';
import { categoriesReducer } from './reducers/categories/reducer';
import { appointmentsReducer } from './reducers/appointments/reducer';
import { bookingFlowConfigReducer } from './reducers/bookingFlowConfig/reducer';
import { mobileServiceReducer } from './reducers/mobileService/reducer';
import { serviceValetReducer } from './reducers/serviceValet/reducer';
import { recallsReducer } from './reducers/recall/reducer';
import { firstScreenOptionsReducer } from './reducers/serviceTypes/reducer';
import { capacityServiceValetReducer } from './reducers/capacityServiceValet/reducer';
import { customerReducer } from './reducers/enhancedCustomerSearch/reducer';
import { screenSettingsReducer } from './reducers/screenSettings/reducer';
import { notificationsReducer } from './reducers/notifications/reducer';
import { capacityManagementReducer } from './reducers/capacityManagement/reducer';
import { employeesCapacity } from './reducers/employeeCapacity/reducer';
import { demandManagementReducer } from './reducers/demandManagement/reducer';
import { adminPanelReducer } from './reducers/adminPanel/reducer';
import { generalSettingsReducer } from './reducers/generalSettings/reducer';
import { globalVehiclesReducer } from './reducers/globalVehicles/reducer';
import { dealerOperationsReducer } from './reducers/dealerOperations/reducer';

export const rootReducer = combineReducers({
  appointment: appointmentReducer,
  appointmentFrame: appointmentFrameReducer,
  users: usersReducer,
  dealershipGroups: dealershipGroupsReducer,
  demandSegments: demandSegmentsReducer,
  employees: employeesReducer,
  employeesCapacity: employeesCapacity,
  employeesSchedule: schedulesReducer,
  appointments: appointmentsReducer,
  optimizationWindows: optimizationWindowsReducer,
  offers: offersReducer,
  scEmployees: scEmployees,
  pods: podsReducer,
  pricingSettings: pricingSettingsReducer,
  serviceCenters: serviceCenterReducer,
  slotScoring: slotScoringReducer,
  modals: modalsReducer,
  holidays: holidaysReducer,
  valueSettings: valueSettingsReducer,
  serviceRequests: serviceRequestsReducer,
  packages: packagesReducer,
  vehicleDetails: vehicleDetailsReducer,
  transportation: transportationOptionsReducer,
  categories: categoriesReducer,
  bookingFlowConfig: bookingFlowConfigReducer,
  mobileService: mobileServiceReducer,
  dealerOperations: dealerOperationsReducer,
  serviceValet: serviceValetReducer,
  recalls: recallsReducer,
  serviceTypes: firstScreenOptionsReducer,
  capacityServiceValet: capacityServiceValetReducer,
  customers: customerReducer,
  screenSettingsBooking: screenSettingsReducer,
  notifications: notificationsReducer,
  capacityManagement: capacityManagementReducer,
  demandManagement: demandManagementReducer,
  adminPanel: adminPanelReducer,
  generalSettings: generalSettingsReducer,
  globalVehicles: globalVehiclesReducer,
});
export type RootState = ReturnType<typeof rootReducer>;
