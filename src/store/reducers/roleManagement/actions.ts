import { createAction } from '@reduxjs/toolkit';
import { IUserAccount } from '../../../pages/admin/RoleManagement/types';
import { AppThunk } from '../../../types/types';
import packageJson from '../../../../src/pages/admin/RoleManagement/data.json';

export const getRoleUsers = createAction<IUserAccount[]>('Users/GetRoles');

export const loadRoleUsers =
  (onSuccess: () => void): AppThunk =>
  dispatch => {
    // replace that to a real api call when it is ready, for now we just load data from JSON file with timeout to simulate loading time
    setTimeout(() => {
      try {
        const users = packageJson;

        console.log('Loaded users from package.json:', users);

        dispatch(getRoleUsers(users));
        onSuccess();
      } catch (err) {
        console.log('get load role users err', err);
        onSuccess();
      }
    }, 2000);
  };
