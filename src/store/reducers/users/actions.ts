import {ICurrentUser, IUserForm, TUserActions} from "./types";
import {Api} from "../../../config/requests";
import {AppThunk} from "../../../types/types";
import {IEmployee} from "../employees/types";
import {loadByFilters} from "../employees/actions";

const _getCurrentUser = (payload: ICurrentUser): TUserActions => ({
    type: "User/GetCurrentUser", payload
});
const loading = (payload: boolean): TUserActions => ({type: "User/Loading", payload});
export const getCurrentUser = (): AppThunk => async dispatch => {
    try {
        dispatch(loading(true));
        const {data} = await Api.call<ICurrentUser>(Api.endpoints.Accounts.Profile);
        dispatch(_getCurrentUser(data));
    } catch (e) {
        console.error(e);
    } finally {
        dispatch(loading(false));
    }
}
export const saveEmployeeAvatar = (avatar: File, id: string): AppThunk => async dispatch => {
    const fd = new FormData();
    fd.append("file", avatar, avatar.name);
    await Api.call(Api.endpoints.Users.Avatar, {urlParams: {id}, data: fd});
    dispatch(getCurrentUser());
}
const saving = (payload: boolean): TUserActions => ({type: "User/Saving", payload});
export const createUser = (payload: IUserForm, avatar?: File): AppThunk => async dispatch => {
    dispatch(saving(true));
    try {
        const {data} = await Api.call<IEmployee|string>(Api.endpoints.Users.Create, {data: payload})
        if (avatar) {
            await dispatch(saveEmployeeAvatar(avatar, typeof data === "string" ? data : data.id));
        }
        dispatch(loadByFilters())
        dispatch(saving(false))
    } catch (e) {
        dispatch(saving(false));
        throw e;
    }
};
export const updateUser = (payload: IUserForm, id: string, avatar?: File): AppThunk => async dispatch => {
    dispatch(saving(true));
    try {
        await Api.call(Api.endpoints.Users.Update, {urlParams: {id}, data: payload});
        if (avatar) {
            await dispatch(saveEmployeeAvatar(avatar, id));
        }
        dispatch(saving(false));
        dispatch(getCurrentUser());
        dispatch(loadByFilters())
    } catch (e) {
        dispatch(saving(false));
        throw e;
    }
}