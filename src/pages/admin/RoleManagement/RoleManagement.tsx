import React, { useEffect } from 'react';
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
import { useDispatch } from 'react-redux';

const RoleManagement = () => {
  const { classes } = useStyles();
  const { onOpen, isOpen, onClose } = useModal();
  const dispatch = useDispatch();
  const onClick = () => {
    onOpen();
  };

  useEffect(() => {
    dispatch(loadDealershipsGroup(true));
    dispatch(loadServiceCentersGroup(true));
  }, []);

  return (
    <div className={classes.root}>
      <TitleContainer title={Titles.RoleManagement} parent={applicationRoot} pad />
      <div className={classes.buttonWrapper}>
        <Button variant="contained" onClick={onClick} color="primary">
          Add user account
        </Button>
      </div>
      <Filters />
      <AddUserAccount open={isOpen} onClose={onClose} />
    </div>
  );
};

export default RoleManagement;
