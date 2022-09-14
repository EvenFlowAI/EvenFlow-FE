import {ActionCreator} from "redux";
import {changePageDataGeneric, changePagingGeneric} from "../utils";
import {Api} from "../../../config/requests";
import {AppThunk, IOrder, IPageRequest, PaginatedAPIResponse} from "../../../types/types";
import {IEmployee, IEmployeeForm, TDmsAdvisor, TEmployeeActions} from "./types";
import {saveEmployeeAvatar} from "../users/actions";
import {createAction} from "@reduxjs/toolkit";
import {IAdvisorShort} from "../users/types";
import {Roles} from "../../../config/constants";

export const getAll = (payload: IEmployee[]): TEmployeeActions => ({
   type: "Employees/GetAll", payload
});
export const _changePageData = changePageDataGeneric("Employees/ChangePageData");


export const changePageData: ActionCreator<AppThunk> = (payload: Partial<IPageRequest>) => {
    return async dispatch => {
        dispatch(_changePageData(payload));
        dispatch(loadAll());
    }
}
export const loading = (payload: boolean): TEmployeeActions => ({
    payload, type: "Employees/Loading"
});
export const saving = (payload: boolean): TEmployeeActions => ({
    payload, type: "Employees/Saving"
})

export const loadAll: ActionCreator<AppThunk> = () =>
    async (dispatch, getState) => {

    dispatch(loading(true));
    const state = getState();
    try {
        const {data: {result: employees, paging}} = await Api.call<PaginatedAPIResponse<IEmployee>>(
            Api.endpoints.Users.GetAll,
            {data: {
                ...state.employees.pageData,
                ...state.employees.order,
                searchTerm: state.employees.searchTerm
            }}
        );
        dispatch(loading(false));
        dispatch(changePaging(paging));
        dispatch(getAll(employees));
    } catch (e) {
        dispatch(loading(false));
        throw e;
    }
};
const loadingTechnicians = (payload: boolean): TEmployeeActions => ({type: "Employees/LoadingTechnicians", payload});
const _loadTechnicians = (payload: IEmployee[]): TEmployeeActions => ({type: "Employees/GetTechnicians", payload});
export const loadTechnicians = (serviceCenterId: number): AppThunk =>
    async (dispatch) => {

    dispatch(loadingTechnicians(true));
    try {
        const {data: {result: employees}} = await Api.call<PaginatedAPIResponse<IEmployee>>(
            Api.endpoints.Employees.GetAll,
            {
                data: {
                    serviceCenterId,
                    pageIndex: 0,
                    pageSize: 0
                }
            }
        );
        dispatch(loadingTechnicians(false));
        dispatch(_loadTechnicians(employees));
    } catch (e) {
        dispatch(loadingTechnicians(false));
        throw e;
    }
};
export const createEmployee = (payload: IEmployeeForm, avatar?: File): AppThunk => async dispatch => {
    dispatch(saving(true));
    try {
        const {data} = await Api.call<IEmployee|string>(Api.endpoints.Employees.Create, {data: payload});
        if (avatar) {
            await dispatch(saveEmployeeAvatar(avatar, typeof data === 'string' ? data : data.id));
        }
        dispatch(saving(false));
        dispatch(loadAll());
    } catch (e) {
        dispatch(saving(false));
        throw e;
    }
}

export const changePaging = changePagingGeneric("Employees/ChangePaging");

export const removeEmployee = (id: string): AppThunk => async (dispatch) => {
    await Api.call(Api.endpoints.Users.Remove, {urlParams: {id}});
    dispatch(loadAll());
}
export const updateEmployee = (data: IEmployeeForm, id: string, avatar?: File): AppThunk => async dispatch => {
    dispatch(saving(true));
    try {
        await Api.call(Api.endpoints.Employees.Update, {urlParams: {id}, data});
        if (avatar) {
            await dispatch(saveEmployeeAvatar(avatar, id));
        }
        dispatch(saving(false));
        dispatch(loadAll());
    } catch (e) {
        dispatch(saving(false));
        throw e;
    }
}

const changeDPaging = changePagingGeneric("Employees/ChangeDPaging");
const loadDealership = (payload: boolean): TEmployeeActions => ({type: "Employees/LoadingDealership", payload});
const _loadDealership = (payload: IEmployee[]): TEmployeeActions => ({type: "Employees/GetDealershipEmployees", payload});
export const loadDealershipEmployees = (dealershipId: number, pageData: IPageRequest): AppThunk => async (dispatch) => {
    dispatch(loadDealership(true));
    try {
        const {data: {result, paging}} = await Api.call<PaginatedAPIResponse<IEmployee>>(Api.endpoints.Users.GetAll, {data: {...pageData, dealershipId}});
        dispatch(changeDPaging(paging));
        dispatch(_loadDealership(result));
        dispatch(loadDealership(false));
    } catch (e) {
        dispatch(loadDealership(false));
        throw e;
    }
}

export const getSCAdvisors = createAction<IAdvisorShort[]>("SCEmployees/GetAdvisors");
export const getSCEmployees = createAction<IAdvisorShort[]>("SCEmployees/GetEmployees");
export const loadSCAdvisors = (serviceCenterId: number): AppThunk => async dispatch => {
    const {data: {result}} = await Api.call<PaginatedAPIResponse<IAdvisorShort>>(
        Api.endpoints.Users.GetShort,
        {data: {pageSize: 0, serviceCenterId, roles: [Roles.Advisor]}}
    );
    dispatch(getSCAdvisors(result));
}
export const loadSCEmployees = (serviceCenterId: number): AppThunk => async dispatch => {
    const {data: {result}} = await Api.call<PaginatedAPIResponse<IAdvisorShort>>(
        Api.endpoints.Users.GetShort,
        {data: {pageSize: 0, serviceCenterId, roles: [Roles.Technician]}}
    );
    dispatch(getSCEmployees(result));
}
export const setEmplSearch = createAction<string>("SCEmployees/SetSearch");
export const setEmplOrder = createAction<IOrder<IEmployee>>("SCEmployees/SetOrder")

export const getDMSAdvisors = createAction<TDmsAdvisor[]>("SCEmployees/GetDMSAdvisors");
export const loadingDMSAdvisors = createAction<boolean>("SCEmployees/LoadingDMSAdvisors");
export const loadDMSAdvisors = (serviceCenterId: number): AppThunk => dispatch => {
    dispatch(loadingDMSAdvisors(true));
    Api.call(Api.endpoints.ServiceConsultants.GetDmsAdvisors, {urlParams: {id: serviceCenterId}})
        .then(result => {
            if (result?.data) {
                dispatch(getDMSAdvisors(result.data))
            }
        })
        .catch(err => {
            console.log('get DMS Advisors', err)
        })
        .finally(() => dispatch(loadingDMSAdvisors(false)))
}

export const loadByFilters: ActionCreator<AppThunk> = (selectedRole: string, serviceCenterId: number|null) =>
    async (dispatch, getState) => {

        dispatch(loading(true));
        const state = getState();
        try {
            const {data: {result: employees, paging}} = await Api.call<PaginatedAPIResponse<IEmployee>>(
                Api.endpoints.Users.GetAll,
                {data: {
                        ...state.employees.pageData,
                        ...state.employees.order,
                        searchTerm: state.employees.searchTerm,
                        roles: selectedRole ? [selectedRole] : [],
                        serviceCenterId,
                    }}
            );
            dispatch(loading(false));
            dispatch(changePaging(paging));
            dispatch(getAll(employees));
        } catch (e) {
            dispatch(loading(false));
            throw e;
        }
    };