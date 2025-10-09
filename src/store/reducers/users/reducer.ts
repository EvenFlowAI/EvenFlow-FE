import { ICurrentUser, IUsersState, TUserActions } from './types';
import { superUser } from '../../../config/config';
import { Roles } from '../../../types/types';

const initialState: IUsersState = {
  saving: false,
  loading: false,
  isSuperAdmin: false,
};

export function usersReducer(state = initialState, action: TUserActions): IUsersState {
  const additional: Partial<ICurrentUser> = {};
  switch (action.type) {
    case 'User/GetCurrentUser':
      if (action.payload.role === superUser) {
        if (action.payload.dealershipId) {
          additional.role = Roles.DealerOwner;
          additional.adminDealership = true;
        } else {
          additional.isSuperUser = true;
        }
      }
      return {
        ...state,
        isSuperAdmin: action.payload.role === superUser,
        currentUser: {
          ...action.payload,
          ...additional,
        },
      };
    case 'User/Saving':
      return { ...state, saving: action.payload };
    case 'User/Loading':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}
