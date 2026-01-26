import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { Loading } from '../../../components/wrappers/Loading/Loading';
import { useHistory } from 'react-router-dom';
import {
  setCustomerEnteredEmail,
  setCustomerLoadedData,
  setIsCloneMode,
} from '../../../store/reducers/appointment/actions';
import {
  clearAppointmentData,
  getActiveTransportations,
  setCurrentFrameScreen,
  setServiceOptionChanged,
  setServiceTypeOption,
  setSideBarSteps,
  setVehicle,
  setWelcomeScreenView,
} from '../../../store/reducers/appointmentFrameReducer/actions';
import { encodeSCID } from '../../../utils/utils';
import { setCustomerSearchData } from '../../../store/reducers/enhancedCustomerSearch/actions';
import { useStyles } from './styles';
import { useException } from '../../../hooks/useException/useException';
import { useCurrentUser } from '../../../hooks/useCurrentUser/useCurrentUser';
import { Routes } from '../../../routes/constants';
import { initialCustomerSearch } from '../../../store/reducers/constants';
import { useTranslation } from 'react-i18next';

export const ServiceCenterSwitcher = () => {
  const { scProfile, isCloneMode } = useSelector((state: RootState) => state.appointment);
  const { welcomeScreenView, isAppointmentSaving } = useSelector(
    (state: RootState) => state.appointmentFrame
  );
  const { shortLoading, shortSC } = useSelector((state: RootState) => state.serviceCenters);
  const currentUser = useCurrentUser();
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const showError = useException();
  const history = useHistory();
  const isWelcomePage = useMemo(() => history.location.pathname.includes('welcome'), [history]);
  const { t } = useTranslation();
  const isAuthorized = useMemo(
    () => currentUser && currentUser.dealershipId === scProfile?.dealershipId,
    [currentUser, scProfile]
  );

  const handleClick = () => {
    if (!isAppointmentSaving) {
      if (shortSC?.length) {
        dispatch(clearAppointmentData());
        dispatch(setServiceOptionChanged(false));
        dispatch(setCustomerEnteredEmail(''));
        dispatch(setCustomerSearchData(initialCustomerSearch));
        dispatch(setSideBarSteps([]));
        dispatch(setCurrentFrameScreen('serviceNeeds'));
        dispatch(setVehicle(null));
        dispatch(setCustomerLoadedData(null));
        dispatch(setWelcomeScreenView('serviceCenterSelect'));
        dispatch(setServiceTypeOption(null));
        dispatch(getActiveTransportations([]));
        if (scProfile) {
          const encoded = encodeSCID(scProfile.id);
          history.push(`${Routes.EndUser.Welcome}/${encoded}?frame=1`);
        }
      } else {
        showError(t('There are not Service Centers list of the current Dealership'));
      }
    }
    if (isCloneMode) {
      dispatch(setIsCloneMode(false));
    }
  };

  return isAuthorized && (welcomeScreenView !== 'serviceCenterSelect' || !isWelcomePage) ? (
    <div className={classes.selectWrapper}>
      {shortLoading ? (
        <div style={{ textAlign: 'right' }}>
          <Loading />
        </div>
      ) : (
        <div className={classes.textWrapper} onClick={handleClick}>
          {scProfile?.name}
        </div>
      )}
    </div>
  ) : null;
};
