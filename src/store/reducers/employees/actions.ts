import {ActionCreator} from "redux";
import {changePageDataGeneric, changePagingGeneric} from "../utils";
import {
    AppThunk,
    IOrder,
    IPageRequest,
    PaginatedAPIResponse,
    Roles,
    TArgCallback,
    TCallback
} from "../../../types/types";
import {
    IBaseScheduleByEmployee,
    IBaseSummary,
    IEmployee, IEmployeeAssignmentSetting,
    IEmployeeFilters,
    IEmployeeForm,
    IEmployeeRoleHours,
    IEmployeeSchedule,
    TBaseScheduleRequest,
    TEmployeeActions,
    TScheduleByEmployeeRequestData,
    TSetScheduleData, TUpdateAssignmentSettingsData
} from "./types";
import {saveEmployeeAvatar} from "../users/actions";
import {createAction} from "@reduxjs/toolkit";
import {IAdvisorShort} from "../users/types";
import {Api} from "../../../api/ApiEndpoints/ApiEndpoints";
import {TServiceConsultant} from "../appointments/types";

export const getAll = (payload: IEmployee[]): TEmployeeActions => ({
   type: "Employees/GetAll", payload
});
export const _changePageData = changePageDataGeneric("Employees/ChangePageData");


export const changePageData: ActionCreator<AppThunk> = (payload: Partial<IPageRequest>) => {
    return async dispatch => {
        dispatch(_changePageData(payload));
        dispatch(loadByFilters());
    }
}
export const loading = (payload: boolean): TEmployeeActions => ({
    payload, type: "Employees/Loading"
});
export const saving = (payload: boolean): TEmployeeActions => ({
    payload, type: "Employees/Saving"
})

export const loadAll: ActionCreator<AppThunk> = () => async (dispatch, getState) => {
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
        console.log('loadAll', e)
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
        console.log('loadTechnicians', e)
    }
};
export const createEmployee = (payload: IEmployeeForm, onSuccess: () => void, onError: (err: any) => void, avatar?: File): AppThunk => async dispatch => {
    dispatch(saving(true));
    try {
        const {data} = await Api.call<IEmployee|string>(Api.endpoints.Employees.Create, {data: payload});
        if (avatar) {
            await dispatch(saveEmployeeAvatar(avatar, typeof data === 'string' ? data : data.id));
        }
        dispatch(saving(false));
        dispatch(loadByFilters())
        onSuccess()
    } catch (e) {
        dispatch(saving(false));
        onError(e)
        console.log('createEmployee', e)
    }
}

export const changePaging = changePagingGeneric("Employees/ChangePaging");

export const removeEmployee = (id: string): AppThunk => async (dispatch) => {
    try {
        await Api.call(Api.endpoints.Users.Remove, {urlParams: {id}});
        dispatch(loadByFilters())
    } catch (err) {
        console.log('remove employee err', err)
    }
}
export const updateEmployee = (data: IEmployeeForm, id: string, onSuccess: () => void, onError: (err: any) => void, avatar?: File): AppThunk => async dispatch => {
    dispatch(saving(true));
    try {
        await Api.call(Api.endpoints.Employees.Update, {urlParams: {id}, data});
        if (avatar) {
            await dispatch(saveEmployeeAvatar(avatar, id));
        }
        dispatch(saving(false));
        dispatch(loadByFilters())
        onSuccess()
    } catch (e) {
        dispatch(saving(false));
        onError(e)
        console.log('updateEmployee', e)
    }
}

const changeDPaging = changePagingGeneric("Employees/ChangeDPaging");
const loadDealership = (payload: boolean): TEmployeeActions => ({type: "Employees/LoadingDealership", payload});
const _loadDealership = (payload: IEmployee[]): TEmployeeActions => ({type: "Employees/GetDealershipEmployees", payload});
export const loadDealershipEmployees = (dealershipId: string, pageData: IPageRequest): AppThunk => async (dispatch) => {
    dispatch(loadDealership(true));
    try {
        const {data: {result, paging}} = await Api.call<PaginatedAPIResponse<IEmployee>>(Api.endpoints.Users.GetAll, {data: {...pageData, dealershipId}});
        dispatch(changeDPaging(paging));
        dispatch(_loadDealership(result));
        dispatch(loadDealership(false));
    } catch (e) {
        dispatch(loadDealership(false));
        console.log('loadDealershipEmployees', e)
    }
}

export const getSCAdvisors = createAction<IAdvisorShort[]>("SCEmployees/GetAdvisors");
export const getSCEmployees = createAction<IAdvisorShort[]>("SCEmployees/GetEmployees");
export const loadSCAdvisors = (serviceCenterId: number): AppThunk => async dispatch => {
    try {
        const {data: {result}} = await Api.call<PaginatedAPIResponse<IAdvisorShort>>(
            Api.endpoints.Users.GetShort,
            {data: {pageSize: 0, serviceCenterId, roles: [Roles.Advisor]}}
        );
        dispatch(getSCAdvisors(result));
    } catch (err) {
        console.log(err)
    }
}
export const loadSCEmployees = (serviceCenterId: number): AppThunk => async dispatch => {
    try {
        const {data: {result}} = await Api.call<PaginatedAPIResponse<IAdvisorShort>>(
            Api.endpoints.Users.GetShort,
            {data: {pageSize: 0, serviceCenterId, roles: [Roles.Technician]}}
        );
        dispatch(getSCEmployees(result));
    } catch (err) {
        console.log(err)
    }
}
export const setEmplSearch = createAction<string>("SCEmployees/SetSearch");
export const setEmplOrder = createAction<IOrder<IEmployee>>("SCEmployees/SetOrder")

export const getDMSAdvisors = createAction<TServiceConsultant[]>("SCEmployees/GetDMSAdvisors");
export const loadingDMSAdvisors = createAction<boolean>("SCEmployees/LoadingDMSAdvisors");
export const loadDMSAdvisors = (serviceCenterId: number): AppThunk => dispatch => {
    dispatch(loadingDMSAdvisors(true));
    Api.call(Api.endpoints.ServiceConsultants.GetByRole, {params: {serviceCenterId, showActive: true}})
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

export const loadByFilters: ActionCreator<AppThunk> = () =>
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
                        roles: state.employees.filters.role ?  [state.employees.filters.role] : [],
                        serviceCenterId: state.employees.filters.serviceCenterId,
                    }}
            );
            dispatch(loading(false));
            dispatch(changePaging(paging));
            dispatch(getAll(employees));
        } catch (e) {
            dispatch(loading(false));
            console.log('loadByFilters', e)
        }
    };

export const setEmployeeFilters = createAction<Partial<IEmployeeFilters>>("Employees/ChangeFilters")

export const getUsersShort = createAction<IAdvisorShort[]>("Employees/GetUsersShort");
export const loadUsersShort = (serviceCenterId: number): AppThunk => dispatch => {
    dispatch(loading(true))
    Api.call(Api.endpoints.Users.GetShort, {data: {pageSize: 0, serviceCenterId}})
        .then(result => {
            if (result) {
                dispatch(getUsersShort(result.data?.result))
            }
        })
        .catch(err => {
            console.log('load users short error', err)
        })
        .finally(() => dispatch(loading(false)))
}

export const getBaseSummary = createAction<IBaseSummary>("Employees/GetBaseSummary");
export const loadBaseSummary = (serviceCenterId: number, orderBy: string, isAscending = true): AppThunk => dispatch => {
    dispatch(loading(true))
    Api.call<IBaseSummary>(Api.endpoints.EmployeeSchedule.GetBaseSummary, {data: {serviceCenterId, isAscending, orderBy}})
        .then(result => {
            if (result) {
               dispatch(getBaseSummary(result.data))
            }
        })
        .catch(err => {
            console.log('load base summary error', err)
        })
        .finally(() => setTimeout(() => dispatch(loading(false)), 500))
}

export const getBaseSummaryByEmployee = createAction<IEmployeeRoleHours[]>("Employees/GetBaseScheduleByEmployee");
export const loadBaseSummaryByEmployee = (data: TScheduleByEmployeeRequestData): AppThunk => dispatch => {
    dispatch(loading(true))
    Api.call<IBaseScheduleByEmployee>(Api.endpoints.EmployeeSchedule.GetSummaryByEmployee, {data})
        .then(result => {
            if (result) {
                dispatch(getBaseSummaryByEmployee(result.data.roleHours))
            }
        })
        .catch(err => {
            console.log('load base summary error', err)
        })
        .finally(() => dispatch(loading(false)))
}

export const getBaseEmployeeSchedule = createAction<IEmployeeSchedule>("Employees/GetScheduleTimeByEmployee");
export const loadBaseEmployeeSchedule = (serviceCenterId: number, employeeId: string): AppThunk => dispatch => {
    const data: TBaseScheduleRequest = {serviceCenterId, employeeId}
    dispatch(loading(true))
    Api.call<IEmployeeSchedule>(Api.endpoints.EmployeeSchedule.GetTimeScheduleByEmployee, {params: data})
        .then(res => {
            if (res.data) dispatch(getBaseEmployeeSchedule(res.data))
        })
        .catch(err => {
            console.log('load base employee schedule error', err)
        })
        .finally(() => dispatch(loading(false)))
}

export const updateBaseEmployeeSchedule = (data: TSetScheduleData, onSuccess: () => void, onError: (err: any) => void): AppThunk => dispatch => {
    dispatch(loading(true))
    Api.call(Api.endpoints.EmployeeSchedule.SetTimeScheduleByEmployee, {data})
        .then(() => {
            dispatch(loadBaseEmployeeSchedule(data.serviceCenterId, data.employeeId))
            onSuccess()
        })
        .catch(err => {
            onError(err)
            console.log('load base employee schedule error', err)
        })
        .finally(() => dispatch(loading(false)))
}

export const getAssignmentSettings = createAction<IEmployeeAssignmentSetting[]>("Employees/GetAssignmentSettings");
export const loadAssignmentSettings = (serviceCenterId: number): AppThunk => dispatch => {
    dispatch(loading(true))
    Api.call(Api.endpoints.Employees.GetAssignmentSettings, {urlParams: {serviceCenterId}})
        .then(result => {
            if (result.data) dispatch(getAssignmentSettings(result.data));
        })
        .catch(err => {
            console.log('load employee assignment settings error', err)
        })
        .finally(() => dispatch(loading(false)))
}

export const updateAssignmentSettings = (data: TUpdateAssignmentSettingsData, onError: TArgCallback<any>, onSuccess: TCallback): AppThunk => dispatch => {
    dispatch(loading(true))
    Api.call(Api.endpoints.Employees.UpdateAssignmentSettings, {data})
        .then(() => {
            onSuccess()
        })
        .catch(err => {
            console.log('update employee assignment settings error', err)
            onError(err)
        })
        .finally(() => dispatch(loading(false)))
}