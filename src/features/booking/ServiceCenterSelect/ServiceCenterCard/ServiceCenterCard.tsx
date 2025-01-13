import React from 'react';
import { IServiceCenter } from '../../../../store/reducers/serviceCenters/types';
import { useStyles } from '../styles';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  loadSCProfile,
  setCustomerEnteredEmail,
  setCustomerLoadedData,
} from '../../../../store/reducers/appointment/actions';
import {
  clearAppointmentData,
  setAddress,
  setServiceOptionChanged,
  setServiceTypeOption,
  setSideBarSteps,
  setVehicle,
  setWelcomeScreenView,
  setZipCode,
} from '../../../../store/reducers/appointmentFrameReducer/actions';
import { setCustomerSearchData } from '../../../../store/reducers/enhancedCustomerSearch/actions';
import { encodeSCID } from '../../../../utils/utils';
import { Button } from '@mui/material';
import { Routes } from '../../../../routes/constants';
import { initialCustomerSearch } from '../../../../store/reducers/constants';

export const ServiceCenterCard: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<{ sc: IServiceCenter }>>
> = ({ sc }) => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const onClick = () => {
    dispatch(loadSCProfile(sc.id));
    dispatch(clearAppointmentData());
    dispatch(setServiceOptionChanged(false));
    dispatch(setCustomerEnteredEmail(''));
    dispatch(setCustomerSearchData(initialCustomerSearch));
    dispatch(setAddress(null));
    dispatch(setZipCode(''));
    dispatch(setSideBarSteps([]));
    dispatch(setVehicle(null));
    dispatch(setCustomerLoadedData(null));
    dispatch(setServiceTypeOption(null));
    dispatch(setWelcomeScreenView('select'));
    const encoded = encodeSCID(sc.id);
    history.push(`${Routes.EndUser.Welcome}/${encoded}?frame=1`);
  };

  return (
    <div className={classes.card}>
      <div className={classes.text}>{sc.name}</div>
      <Button onClick={onClick} variant="contained" className={classes.button}>
        Schedule Appointment
      </Button>
    </div>
  );
};
