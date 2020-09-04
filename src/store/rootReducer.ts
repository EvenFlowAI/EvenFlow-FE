import {combineReducers} from "@reduxjs/toolkit";
import {usersReducer} from "./reducers/users/user";
import {dealershipGroupsReducer} from "./reducers/dealershipGroups/reducer";
import {employeesReducer} from "./reducers/employees/reducer";
import {serviceCenterReducer} from "./reducers/serviceCenters/reducer";
import {modalsReducer} from "./reducers/modals/reducer";
import {holidaysReducer} from "./reducers/holidays/reducer";

export const rootReducer = combineReducers({
    users: usersReducer,
    dealershipGroups: dealershipGroupsReducer,
    employees: employeesReducer,
    serviceCenters: serviceCenterReducer,
    modals: modalsReducer,
    holidays: holidaysReducer,
});
export type RootState = ReturnType<typeof rootReducer>;