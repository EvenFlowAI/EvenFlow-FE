import {ICurrentUser, TUserActions} from "./types";
import {ActionCreator} from "redux";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../../rootReducer";
import {Api} from "../../../config/requests";

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