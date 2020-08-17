import {combineReducers} from "@reduxjs/toolkit";
import {usersReducer} from "./reducers/user";
import {dealershipGroupsReducer} from "./reducers/dealershipGroups/reducer";
import {employeesReducer} from "./reducers/employees/reducer";
import {serviceCenterReducer} from "./reducers/serviceCenters/reducer";
import {modalsReducer} from "./reducers/modals/reducer";

export const rootReducer = combineReducers({
    users: usersReducer,
    dealershipGroups: dealershipGroupsReducer,
    employees: employeesReducer,
    serviceCenters: serviceCenterReducer,
    modals: modalsReducer,
});
export type RootState = ReturnType<typeof rootReducer>;