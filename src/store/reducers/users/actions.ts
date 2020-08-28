import {ICurrentUser, IUserForm, TUserActions} from "./types";
import {Action, ActionCreator} from "redux";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../../rootReducer";
import {Api} from "../../../config/requests";
import {AppThunk} from "../../../types/types";

const _getCurrentUser = (payload: ICurrentUser): TUserActions => ({
    type: "User/GetCurrentUser", payload
});
export const getCurrentUser: ActionCreator<ThunkAction<
    void,
    RootState,
    void,
    TUserActions
    >> = () => async dispatch => {
    try {
        const {data} = await Api.call<ICurrentUser>(Api.endpoints.Accounts.Profile);
        dispatch(_getCurrentUser(data));
    } catch (e) {
        console.error(e);
    }
}

const saving = (payload: boolean): TUserActions => ({type: "User/Saving", payload});
export const createUser = (payload: IUserForm): AppThunk => async dispatch => {
    dispatch(saving(true));
    try {
        await Api.call(Api.endpoints.Users.Create, {data: payload})
        dispatch(saving(false))
    } catch (e) {
        dispatch(saving(false));
        throw e;
    }
};