import {Action, ActionCreator} from "redux";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../../rootReducer";
import {changePagingGeneric} from "../utils";
import {loading} from "../dealershipGroups/actions";
import {Api} from "../../../config/requests";
import {PaginatedAPIResponse} from "../../../types/types";
import {IEmployee, TEmployeeActions} from "./types";

export const getAll = (payload: IEmployee[]): TEmployeeActions => ({
   type: "Employees/GetAll", payload
});

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