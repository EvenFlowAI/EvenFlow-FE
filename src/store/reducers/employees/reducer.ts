import {IEmployee, TEmployeeActions} from "./types";
import {IPageRequest, IPagingResponse} from "../../../types/types";
import {defaultPageData, defaultPaging} from "../defaultInitials";

export type TEmployeesState = {
    employeesList: IEmployee[];
    loading: boolean;
    saving: boolean;
    paging: IPagingResponse;
    pageData: IPageRequest;
}

const initialState: TEmployeesState = {
    employeesList: [],
    loading: false,
    saving: false,
    paging: {...defaultPaging},
    pageData: {...defaultPageData}
}

export const employeesReducer = (state=initialState, action: TEmployeeActions): TEmployeesState => {
    switch (action.type) {
        case "Employees/GetAll":
            return {...state, employeesList: action.payload};
        case "Employees/ChangePaging":
            return {...state, paging: action.payload};
        default:
            return state;
    }
}