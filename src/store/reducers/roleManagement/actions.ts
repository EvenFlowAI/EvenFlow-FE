import { createAction } from '@reduxjs/toolkit';
import { IUserAccount } from '../../../pages/admin/RoleManagement/types';
import { AppThunk } from '../../../types/types';
import { Api } from '../../../api/ApiEndpoints/ApiEndpoints';

export const getRoleUsers = createAction<IUserAccount[]>('Users/GetRoles');

export const loadRoleUsers =
  (onSuccess: () => void): AppThunk =>
  dispatch => {
    Api.call(Api.endpoints.Users.Get)
      .then(result => {
        if (result.data.data) {
          dispatch(getRoleUsers(result.data.data));
          onSuccess();
        }
      })
      .catch(err => {
        console.log('get load role users err', err);
        onSuccess();
      });
  };
