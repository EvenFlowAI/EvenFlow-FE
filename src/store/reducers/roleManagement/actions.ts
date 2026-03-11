import { createAction } from '@reduxjs/toolkit';
import { IUserAccount } from '../../../pages/admin/RoleManagement/types';
import { AppThunk } from '../../../types/types';
import { Api } from '../../../api/ApiEndpoints/ApiEndpoints';

export const getRoleUsers = createAction<IUserAccount[]>('Users/GetRoles');
export const setLoading = createAction<boolean>('Users/setLoading');

export const loadRoleUsers =
  (onSuccess: () => void): AppThunk =>
  dispatch => {
    Api.call(Api.endpoints.Users.Get)
      .then(result => {
        if (result.data.data) {
          dispatch(getRoleUsers(result.data.data));
          onSuccess();
          dispatch(setLoading(false));
        }
      })
      .catch(err => {
        console.log('get load role users err', err);
        dispatch(setLoading(false));
      });
  };

export const removeUser =
  (id: string, onSuccess: (message: string) => void): AppThunk =>
  async dispatch => {
    try {
      await Api.call(Api.endpoints.Users.Remove, { urlParams: { id } });
      dispatch(loadRoleUsers(() => {}));
      onSuccess('Remove user successfully');
    } catch (err) {
      dispatch(setLoading(false));
      console.log('remove employee err', err);
    }
  };

export const restoreUser =
  (id: string, onSuccess: (message: string) => void): AppThunk =>
  async (dispatch, getState) => {
    try {
      const { users } = getState().roleManagement;
      await Api.call(Api.endpoints.Users.Restore, { urlParams: { id } });
      dispatch(getRoleUsers(users.map(user => (user.id === id ? { ...user, status: 0 } : user))));
      onSuccess('Restore user successfully');
    } catch (err) {
      dispatch(setLoading(false));
      console.log('restore employee err', err);
    }
  };
