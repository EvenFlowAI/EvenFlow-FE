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

export const rootReducer = combineReducers({
    users: usersReducer,
    dealershipGroups: dealershipGroupsReducer,
    demandSegments: demandSegmentsReducer,
    employees: employeesReducer,
    employeesSchedule: schedulesReducer,
    optimizationWindows: optimizationWindowsReducer,
    scEmployees: scEmployees,
    pods: podsReducer,
    serviceCenters: serviceCenterReducer,
    slotScoring: slotScoringReducer,
    modals: modalsReducer,
    holidays: holidaysReducer,
    bays: baysReducer,
    valueSettings: valueSettingsReducer,
    serviceRequests: serviceRequestsReducer,
});
export type RootState = ReturnType<typeof rootReducer>;