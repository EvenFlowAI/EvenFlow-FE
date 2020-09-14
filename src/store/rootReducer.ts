import {combineReducers} from "@reduxjs/toolkit";
import {usersReducer} from "./reducers/users/user";
import {dealershipGroupsReducer} from "./reducers/dealershipGroups/reducer";
import {employeesReducer} from "./reducers/employees/reducer";
import {serviceCenterReducer} from "./reducers/serviceCenters/reducer";
import {modalsReducer} from "./reducers/modals/reducer";
import {holidaysReducer} from "./reducers/holidays/reducer";
import {baysReducer} from "./reducers/bays/reducer";
import {valueSettingsReducer} from "./reducers/valueSettings/reducer";
import {serviceRequestsReducer} from "./reducers/serviceRequests/reducers";

export const rootReducer = combineReducers({
    users: usersReducer,
    dealershipGroups: dealershipGroupsReducer,
    employees: employeesReducer,
    serviceCenters: serviceCenterReducer,
    modals: modalsReducer,
    holidays: holidaysReducer,
    bays: baysReducer,
    valueSettings: valueSettingsReducer,
    serviceRequests: serviceRequestsReducer,
});
export type RootState = ReturnType<typeof rootReducer>;