import {createAction} from "@reduxjs/toolkit";
import {ICustomer} from "../../../api/types";
import {ICustomerWithVehicles} from "./types";

export const getCustomersByName = createAction<ICustomerWithVehicles[]>("Customer/GetCustomers");