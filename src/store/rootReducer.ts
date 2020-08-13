import {combineReducers} from "@reduxjs/toolkit";
import {usersReducer} from "./reducers/user";
import {dealershipGroupsReducer} from "./reducers/dealershipGroups/reducer";
import {employeesReducer} from "./reducers/employees/reducer";
import {serviceCenterReducer} from "./reducers/serviceCenters/reducer";

export const rootReducer = combineReducers({
    users: usersReducer,
    dealershipGroups: dealershipGroupsReducer,
    employees: employeesReducer,
    serviceCenters: serviceCenterReducer,
});
export type RootState = ReturnType<typeof rootReducer>;