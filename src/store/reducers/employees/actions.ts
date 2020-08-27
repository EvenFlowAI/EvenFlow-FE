import {Action, ActionCreator} from "redux";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../../rootReducer";
import {changePageDataGeneric, changePagingGeneric} from "../utils";
import {Api} from "../../../config/requests";
import {IPageRequest, PaginatedAPIResponse} from "../../../types/types";
import {IEmployee, IEmployeeForm, TEmployeeActions} from "./types";

export const getAll = (payload: IEmployee[]): TEmployeeActions => ({
   type: "Employees/GetAll", payload
});
export const _changePageData = changePageDataGeneric("Employees/ChangePageData");


export const changePageData: ActionCreator<ThunkAction<
    void,
    RootState,
    void,
    Action
    >> = (payload: Partial<IPageRequest>) => {
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

export const loadAll: ActionCreator<ThunkAction<
        void, RootState, void, Action
    >> = () =>
    async (dispatch, getState) => {

    dispatch(loading(true));
    const state = getState();
    try {
        const {data: {result: employees, paging}} = await Api.call<PaginatedAPIResponse<IEmployee>>(
            Api.endpoints.Users.GetAll,
            {data: state.employees.pageData}
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
export const loadTechnicians: ActionCreator<ThunkAction<
        void, RootState, void, Action
    >> = () =>
    async (dispatch) => {

    dispatch(loadingTechnicians(true));
    try {
        const {data: {result: employees}} = await Api.call<PaginatedAPIResponse<IEmployee>>(
            Api.endpoints.Employees.GetAll,
            {
                data: {
                    serviceCenterId: 1,
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

export const createEmployee: ActionCreator<
    ThunkAction<void, RootState, void, TEmployeeActions
>> = (payload: IEmployeeForm) => async dispatch => {
    dispatch(saving(true));
    try {
        await Api.call<IEmployee>(Api.endpoints.Employees.Create, {data: payload});
        dispatch(saving(false));
        dispatch(loadAll());
    } catch (e) {
        dispatch(saving(false));
        throw e;
    }
}

export const changePaging = changePagingGeneric("Employees/ChangePaging");