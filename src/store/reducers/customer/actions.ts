import {createAction} from "@reduxjs/toolkit";
import {ICustomerWithVehicles} from "./types";

export const getCustomersByName = createAction<ICustomerWithVehicles[]>("Customer/GetCustomers");