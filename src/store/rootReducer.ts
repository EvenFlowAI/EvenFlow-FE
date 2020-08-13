import {combineReducers} from "@reduxjs/toolkit";
import {usersReducer} from "./reducers/user";
import {dealershipGroupsReducer} from "./reducers/dealershipGroups/reducer";
import {employeesReducer} from "./reducers/employees/reducer";

export const rootReducer = combineReducers({
    users: usersReducer,
    dealershipGroups: dealershipGroupsReducer,
    employees: employeesReducer
});
export type RootState = ReturnType<typeof rootReducer>;