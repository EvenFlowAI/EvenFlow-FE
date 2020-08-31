import {IEmployee, TEmployeeActions} from "./types";
import {IPageRequest, IPagingResponse} from "../../../types/types";
import {defaultPageData, defaultPaging} from "../defaultInitials";

export type TEmployeesState = {
    employeesList: IEmployee[];
    dealershipEmployeesList: IEmployee[];
    techniciansList: IEmployee[];
    loadingTechnicians: boolean;
    loadingDealership: boolean;
    loading: boolean;
    saving: boolean;
    dealershipPaging: IPagingResponse;
    paging: IPagingResponse;
    pageData: IPageRequest;
}

const initialState: TEmployeesState = {
    employeesList: [],
    techniciansList: [],
    dealershipEmployeesList: [],
    dealershipPaging: {...defaultPaging},
    loadingTechnicians: false,
    loadingDealership: false,
    loading: false,
    saving: false,
    paging: {...defaultPaging},
    pageData: {...defaultPageData}
}

export const employeesReducer = (state=initialState, action: TEmployeeActions): TEmployeesState => {
    switch (action.type) {
        case "Employees/GetAll":
            return {...state, employeesList: action.payload};
        case "Employees/GetTechnicians":
            return {...state, techniciansList: action.payload};
        case "Employees/GetDealershipEmployees":
            return {...state, dealershipEmployeesList: action.payload};
        case "Employees/ChangeDPaging":
            return {...state, dealershipPaging: action.payload};
        case "Employees/LoadingDealership":
            return {...state, loadingDealership: action.payload};
        case "Employees/LoadingTechnicians":
            return {...state, loadingTechnicians: action.payload};
        case "Employees/ChangePaging":
            return {...state, paging: action.payload};
        case "Employees/ChangePageData":
            return {...state, pageData: {...state.pageData, ...action.payload}};
        case "Employees/Loading":
            return {...state, loading: action.payload};
        case "Employees/Saving":
            return {...state, saving: action.payload};
        default:
            return state;
    }
}