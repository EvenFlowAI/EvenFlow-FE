import {combineReducers} from "@reduxjs/toolkit";
import {usersReducer} from "./reducers/users/user";
import {dealershipGroupsReducer} from "./reducers/dealershipGroups/reducer";
import {employeesReducer, scEmployees} from "./reducers/employees/reducer";
import {serviceCenterReducer} from "./reducers/serviceCenters/reducer";
import {modalsReducer} from "./reducers/modals/reducer";
import {holidaysReducer} from "./reducers/holidays/reducer";
import {baysReducer} from "./reducers/bays/reducer";
import {valueSettingsReducer} from "./reducers/valueSettings/reducer";
import {serviceRequestsReducer} from "./reducers/serviceRequests/reducers";
import {podsReducer} from "./reducers/pods/reducer";
import {slotScoringReducer} from "./reducers/slotScoring/reducer";
import {demandSegmentsReducer} from "./reducers/demandSegments/reducer";
import {optimizationWindowsReducer} from "./reducers/optimizationWindows/reducer";
import {schedulesReducer} from "./reducers/schedules/reducer";
import {offersReducer} from "./reducers/offers/reducer";
import {appointmentReducer} from "./reducers/appointment/reducer";
import {pricingSettingsReducer} from "./reducers/pricingSettings/reducer";
import {appointmentFrameReducer} from "./reducers/appointmentFrameReducer/reducer";
import {packagesReducer} from "./reducers/packages/reducer";
import {vehicleDetailsReducer} from "./reducers/vehicleDetails/reducer";
import {transportationOptionsReducer} from "./reducers/transportationNeeds/reducer";
import {categoriesReducer} from "./reducers/categories/reducer";
import {appointmentsReducer} from "./reducers/appointments/reducer";
import {bookingFlowConfigReducer} from "./reducers/bookingFlowConfig/reducer";
import {mobileServiceReducer} from "./reducers/mobileService/reducer";
import {serviceValetReducer} from "./reducers/serviceValet/reducer";

export const rootReducer = combineReducers({
    appointment: appointmentReducer,
    appointmentFrame: appointmentFrameReducer,
    users: usersReducer,
    dealershipGroups: dealershipGroupsReducer,
    demandSegments: demandSegmentsReducer,
    employees: employeesReducer,
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
    bays: baysReducer,
    valueSettings: valueSettingsReducer,
    serviceRequests: serviceRequestsReducer,
    packages: packagesReducer,
    vehicleDetails: vehicleDetailsReducer,
    transportation: transportationOptionsReducer,
    categories: categoriesReducer,
    bookingFlowConfig: bookingFlowConfigReducer,
    mobileService: mobileServiceReducer,
    serviceValet: serviceValetReducer,
});
export type RootState = ReturnType<typeof rootReducer>;