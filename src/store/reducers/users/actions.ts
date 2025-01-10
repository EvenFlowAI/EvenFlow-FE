import { ICurrentUser, IUserForm, TUserActions } from "./types";
import { AppThunk, TArgCallback, TCallback } from "../../../types/types";
import { IEmployee } from "../employees/types";
import { loadByFilters } from "../employees/actions";
import {
  setShowServiceCentersList,
  setWelcomeScreenView,
} from "../appointmentFrameReducer/actions";
import { Api } from "../../../api/ApiEndpoints/ApiEndpoints";

const _getCurrentUser = (payload: ICurrentUser): TUserActions => ({
  type: "User/GetCurrentUser",
  payload,
});
const loading = (payload: boolean): TUserActions => ({
  type: "User/Loading",
  payload,
});
export const getCurrentUser =
  (keepWelcomeScreen?: boolean): AppThunk =>
  async (dispatch, getState) => {
    const { welcomeScreenView, shouldShowServiceCentersList } =
      getState().appointmentFrame;
    const { customerLoadedData, scProfile } = getState().appointment;
    try {
      dispatch(loading(true));
      const result = await Api.call<ICurrentUser>(
        Api.endpoints.Accounts.Profile,
      );
      if (result.data) {
        dispatch(_getCurrentUser(result.data));
        const isAuthorized = scProfile
          ? result.data.dealershipId === scProfile?.dealershipId
          : true;
        if (
          welcomeScreenView !== "serviceCenterSelect" &&
          !keepWelcomeScreen &&
          !customerLoadedData?.isUpdating &&
          isAuthorized
        ) {
          if (shouldShowServiceCentersList) {
            dispatch(setWelcomeScreenView("serviceCenterSelect"));
          } else {
            dispatch(setShowServiceCentersList(true));
          }
        }
      }
    } catch (e) {
    } finally {
      dispatch(loading(false));
    }
  };
export const saveEmployeeAvatar =
  (
    avatar: File,
    id: string,
    onError?: TArgCallback<any>,
    onSuccess?: TCallback,
  ): AppThunk =>
  async (dispatch) => {
    try {
      const fd = new FormData();
      fd.append("file", avatar, avatar.name);
      await Api.call(Api.endpoints.Users.Avatar, {
        urlParams: { id },
        data: fd,
      });
      dispatch(getCurrentUser());
      onSuccess && onSuccess();
    } catch (err) {
      onError && onError(err);
      console.log("save employee avatar err", err);
    }
  };
const saving = (payload: boolean): TUserActions => ({
  type: "User/Saving",
  payload,
});
export const createUser =
  (
    payload: IUserForm,
    onSuccess: () => void,
    onError: (err: any) => void,
    avatar?: File,
  ): AppThunk =>
  async (dispatch) => {
    dispatch(saving(true));
    try {
      const { data } = await Api.call<IEmployee | string>(
        Api.endpoints.Users.Create,
        { data: payload },
      );
      if (avatar) {
        await dispatch(
          saveEmployeeAvatar(
            avatar,
            typeof data === "string" ? data : data.id,
            onError,
          ),
        );
      }
      dispatch(loadByFilters());
      dispatch(saving(false));
      onSuccess();
    } catch (e) {
      dispatch(saving(false));
      onError(e);
      console.log("createUser", e);
    }
  };
export const updateUser =
  (
    payload: IUserForm,
    id: string,
    onSuccess: () => void,
    onError: (err: any) => void,
    avatar?: File,
  ): AppThunk =>
  async (dispatch) => {
    dispatch(saving(true));
    try {
      await Api.call(Api.endpoints.Users.Update, {
        urlParams: { id },
        data: payload,
      });
      if (avatar) {
        await dispatch(saveEmployeeAvatar(avatar, id, onError));
      }
      dispatch(saving(false));
      dispatch(getCurrentUser());
      dispatch(loadByFilters());
      onSuccess();
    } catch (e) {
      dispatch(saving(false));
      onError(e);
      console.log("updateUser", e);
    }
  };
