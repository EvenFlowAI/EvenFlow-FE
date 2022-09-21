import {IEmployee, IEmployeeFilters, TDmsAdvisor, TEmployeeActions} from "./types";
import {IOrder, IPageRequest, IPagingResponse} from "../../../types/types";
import {defaultPageData, defaultPaging} from "../defaultInitials";
import {createReducer} from "@reduxjs/toolkit";
import {IAdvisorShort} from "../users/types";
import {
    getDMSAdvisors,
    getSCAdvisors,
    getSCEmployees,
    setEmplOrder,
    setEmplSearch
} from "./actions";
import {defaultOrder} from "../../../config/config";

export type TEmployeesState = {
    employeesList: IEmployee[];
    dealershipEmployeesList: IEmployee[];
    techniciansList: IEmployee[];
    searchTerm: string;
    order: IOrder<IEmployee>;
    loadingTechnicians: boolean;
    loadingDealership: boolean;
    loading: boolean;
    loadingDMSAdvisors: boolean;
    saving: boolean;
    dealershipPaging: IPagingResponse;
    paging: IPagingResponse;
    pageData: IPageRequest;
    filters: IEmployeeFilters;
}

const initialState: TEmployeesState = {
    employeesList: [],
    techniciansList: [],
    dealershipEmployeesList: [],
    dealershipPaging: {...defaultPaging},
    loadingTechnicians: false,
    loadingDealership: false,
    loading: false,
    loadingDMSAdvisors: false,
    searchTerm: "",
    order: {...defaultOrder},
    saving: false,
    paging: {...defaultPaging},
    pageData: {...defaultPageData},
    filters: {},
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
        case "Employees/ChangeFilters":
            return {...state, filters: action.payload};
            case "SCEmployees/LoadingDMSAdvisors":
            return {...state, loadingDMSAdvisors: action.payload};
        case setEmplSearch.type:
            if (setEmplSearch.match(action)) {
                return {...state, searchTerm: action.payload, pageData: {...state.pageData, pageIndex: 0}};
            }
            return state;
        case setEmplOrder.type:
            if (setEmplOrder.match(action)) {
                return {...state, order: action.payload, pageData: {...state.pageData, pageIndex: 0}};
            }
            return state;
        default:
            return state;
    }
}

type TSCState = {
    advisorsList: IAdvisorShort[];
    techniciansList: IAdvisorShort[];
    DmsAdvisors: TDmsAdvisor[];
}
const scInitialState: TSCState = {
    advisorsList: [],
    techniciansList: [],
    DmsAdvisors: [],
}

export const scEmployees = createReducer(scInitialState, builder => builder
    .addCase(getSCAdvisors, (state, {payload}) => {
        return {...state, advisorsList: payload};
    })
    .addCase(getSCEmployees, (state, {payload}) => {
        return {...state, techniciansList: payload};
    })
    .addCase(getDMSAdvisors, (state, { payload }) => {
        return {...state, DmsAdvisors: payload};
    })
)