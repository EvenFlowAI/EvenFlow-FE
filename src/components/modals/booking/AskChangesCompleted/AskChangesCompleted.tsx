import React, { useMemo } from 'react';
import { BaseModal, DialogTitle } from '../../BaseModal/BaseModal';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import {
  setChangesCompletedOpen,
  setSlotsWarningOpen,
} from '../../../../store/reducers/modals/actions';
import {
  createOrUpdateAppointment,
  searchForCustomerConsents,
  setCurrentFrameScreen,
} from '../../../../store/reducers/appointmentFrameReducer/actions';
import { decodeSCID } from '../../../../utils/utils';
import { useHistory, useParams } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { setAppointmentWasChanged } from '../../../../store/reducers/appointment/actions';
import { useStyles } from './styles';
import { LoadingButton } from '../../../buttons/LoadingButton/LoadingButton';
import { useException } from '../../../../hooks/useException/useException';
import { useCurrentUser } from '../../../../hooks/useCurrentUser/useCurrentUser';
import CustomerConsents from '../CustomerConsents/CustomerConsents';

const AskChangesCompleted = () => {
  const {
    isAppointmentSaving,
    isUsualFlowNeeded,
    currentScreen,
    appointmentByKey,
    serviceTypeOption,
    editingPosition,
    isConsentsLoading,
  } = useSelector((state: RootState) => state.appointmentFrame);
  const { isCloneMode } = useSelector((state: RootState) => state.appointment);
  const { isChangesCompletedOpen } = useSelector((state: RootState) => state.modals);
  const currentUser = useCurrentUser();
  const dispatch = useDispatch();
  const { classes } = useStyles();
  const showError = useException();
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const isNewServiceOption = useMemo(() => {
    return (
      editingPosition === 'serviceOption' &&
      serviceTypeOption?.id !== appointmentByKey?.serviceTypeOption?.id
    );
  }, [editingPosition, serviceTypeOption, appointmentByKey]);

  const onClose = () => {
    dispatch(setChangesCompletedOpen(false));
  };

  const redirectToAppointmentFrame = () => {
    console.log('test');
    if (history.location.pathname.includes('welcome')) {
      history.push('/f/appointment-manage/' + id);
    }
  };

  const onAdditionalChanges = () => {
    dispatch(setAppointmentWasChanged(true));
    dispatch(setChangesCompletedOpen(false));
    dispatch(setCurrentFrameScreen('manageAppointment'));
    redirectToAppointmentFrame();
  };

  const onSuccessAppointmentUpdate = () => {
    dispatch(setCurrentFrameScreen('appointmentConfirmed'));
    redirectToAppointmentFrame();
    dispatch(setChangesCompletedOpen(false));
  };

  const handleError = (e: any) => {
    const timeSlotUnavailable = e.response?.data?.message?.toLowerCase().includes('time slot');
    const transportationUnavailable = e.response?.data?.message
      ?.toLowerCase()
      .includes('transportation option');
    const dateForZoneUnavailable = e.response?.data?.message
      ?.toLowerCase()
      .includes('is not available for this geographic zone or for the date');
    const internalError = e.response?.data?.message?.toLowerCase().includes('internal server');
    if (timeSlotUnavailable || dateForZoneUnavailable) {
      dispatch(setChangesCompletedOpen(false));
      currentScreen !== 'appointmentSelection' && dispatch(setSlotsWarningOpen(true));
    } else if (transportationUnavailable) {
      dispatch(setChangesCompletedOpen(false));
      currentScreen !== 'transportationNeeds' && dispatch(setSlotsWarningOpen(true));
    } else if (internalError) {
      showError(
        `We’re sorry. Something went wrong on our end. Please try again shortly. Error identifier: ${e.response?.data?.id ?? 'unknown'}`
      );
    } else {
      showError(e);
    }
  };

  const handleChangesCompleted = () => {
    dispatch(
      createOrUpdateAppointment(
        decodeSCID(id),
        onSuccessAppointmentUpdate,
        handleError,
        isMobile,
        Boolean(currentUser)
      )
    );
  };

  const handleConsents = () => {
    dispatch(searchForCustomerConsents(handleChangesCompleted));
  };

  return (
    <BaseModal width={600} open={isChangesCompletedOpen} onClose={onClose}>
      <DialogTitle onClose={onClose} style={{ padding: 16 }}>
        {t('Are you satisfied with the appointment changes?')}
      </DialogTitle>
      <div className={classes.wrapper}>
        {isUsualFlowNeeded || isNewServiceOption || isCloneMode ? null : (
          <Button variant="text" className={classes.textButton} onClick={onAdditionalChanges}>
            {t('I’d like to make additional changes')}
          </Button>
        )}
        <LoadingButton
          fullWidth
          loading={isAppointmentSaving || isConsentsLoading}
          onClick={handleConsents}
          color="primary"
          variant="contained"
        >
          {t('Yes')}
        </LoadingButton>
        <LoadingButton
          loading={isAppointmentSaving || isConsentsLoading}
          fullWidth
          onClick={onClose}
          variant="outlined"
          color="primary"
        >
          {t('Cancel')}
        </LoadingButton>
      </div>
      <CustomerConsents onNext={handleChangesCompleted} />
    </BaseModal>
  );
};

export default AskChangesCompleted;
