import {ActionCreator} from "redux";
import {
    AppThunk,
    TArgCallback,
    TCallback
} from "../../../types/types";
import {Api} from "../../../api/ApiEndpoints/ApiEndpoints";
import {createAction} from "@reduxjs/toolkit";

export const setLoading = createAction<boolean>("EmployeeCapacity/SetLoading");