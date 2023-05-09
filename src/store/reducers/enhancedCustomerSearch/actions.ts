import {createAction} from "@reduxjs/toolkit";
import {ICustomerByName} from "./types";

export const getCustomers = createAction<ICustomerByName[]>("CustomerSearch/GetCustomers");
export const setCurrentCustomer = createAction<ICustomerByName|null>("CustomerSearch/SetCurrentCustomer");
export const setLoading = createAction<boolean>("CustomerSearch/SetLoading");