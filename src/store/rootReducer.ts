import {combineReducers} from "@reduxjs/toolkit";
import {usersReducer} from "./reducers/user";

export const rootReducer = combineReducers({
    users: usersReducer
});
export type RootState = ReturnType<typeof rootReducer>;