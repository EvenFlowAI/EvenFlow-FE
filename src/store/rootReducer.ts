import {combineReducers} from "@reduxjs/toolkit";
import {usersReducer} from "./reducers/user";
import {dealershipGroupsReducer} from "./reducers/dealershipGroups/reducer";

export const rootReducer = combineReducers({
    users: usersReducer,
    dealershipGroups: dealershipGroupsReducer,
});
export type RootState = ReturnType<typeof rootReducer>;