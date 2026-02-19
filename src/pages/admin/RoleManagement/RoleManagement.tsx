import React, { useEffect, useState } from 'react';
import { TitleContainer } from '../../../components/wrappers/TitleContainer/TitleContainer';
import { Titles } from '../../../types/types';
import { applicationRoot } from '../../../utils/constants';
import { Button } from '@mui/material';
import { useStyles } from './styles';
import Filters from './Filters';
import { useModal } from '../../../hooks/useModal/useModal';
import { AddUserAccount } from '../../../components/modals/admin/AddUserAccount/AddUserAccount';
import { loadAll as loadDealershipsGroup } from '../../../store/reducers/dealershipGroups/actions';
import { loadAll as loadServiceCentersGroup } from '../../../store/reducers/serviceCenters/actions';
import { useDispatch, useSelector } from 'react-redux';
import { IUserAccount } from './types';
import UsersTable from './UsersTable';
import { loadRoleUsers } from '../../../store/reducers/roleManagement/actions';
import { RootState } from '../../../store/rootReducer';

const RoleManagement = () => {
  const { classes } = useStyles();
  const { onOpen, isOpen, onClose } = useModal();
  const { users } = useSelector((state: RootState) => state.roleManagement);

  const [visibleData, serVisibleDate] = useState<IUserAccount[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useDispatch();
  const onClick = () => onOpen();

  const onSuccess = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    dispatch(loadDealershipsGroup(true));
    dispatch(loadServiceCentersGroup(true));
    setIsLoading(true);
    dispatch(loadRoleUsers(onSuccess));
  }, []);

  useEffect(() => {
    if (users.length) {
      serVisibleDate(users);
    }
  }, [users]);

  return (
    <div className={classes.root}>
      <TitleContainer title={Titles.RoleManagement} parent={applicationRoot} pad />
      <div className={classes.buttonWrapper}>
        <Button variant="contained" onClick={onClick} color="primary">
          Add user account
        </Button>
      </div>
      <Filters setData={serVisibleDate} />
      <UsersTable data={visibleData} isLoading={isLoading} />
      <AddUserAccount open={isOpen} onClose={onClose} />
    </div>
  );
};

export default RoleManagement;
