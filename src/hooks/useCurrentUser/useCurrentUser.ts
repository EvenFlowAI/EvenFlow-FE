import { ICurrentUser } from '../../store/reducers/users/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';

export const useCurrentUser = (): ICurrentUser | undefined => {
  return useSelector((state: RootState) => state.users.currentUser);
};
