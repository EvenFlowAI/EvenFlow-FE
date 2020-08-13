import {Action, ActionCreator} from "redux";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../../rootReducer";
import {changePageDataGeneric, changePagingGeneric} from "../utils";
import {Api} from "../../../config/requests";
import {IPageRequest, PaginatedAPIResponse} from "../../../types/types";
import {IEmployee, TEmployeeActions} from "./types";

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

export const changePaging = changePagingGeneric("Employees/ChangePaging");