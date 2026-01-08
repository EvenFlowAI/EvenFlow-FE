import React, { useEffect } from 'react';
import { BaseModal, DialogTitle } from '../../BaseModal/BaseModal';
import { useTranslation } from 'react-i18next';
import { setSlotsWarningOpen } from '../../../../store/reducers/modals/actions';
import {
  setCurrentFrameScreen,
  setTransportation,
} from '../../../../store/reducers/appointmentFrameReducer/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { useHistory, useParams } from 'react-router-dom';
import { useStyles } from './styles';
import { LoadingButton } from '../../../buttons/LoadingButton/LoadingButton';
import { TScreen } from '../../../../types/screens';

const SlotImpactedWarning = () => {
  const { isSlotsWarningOpen } = useSelector((state: RootState) => state.modals);
  const { isAppointmentTimingAvailable, isTransportationAvailable } = useSelector(
    (state: RootState) => state.bookingFlowConfig
  );
  const { customerLoadedData, isCloneMode } = useSelector((state: RootState) => state.appointment);
  const { currentScreen, appointmentByKey, transportations } = useSelector(
    (state: RootState) => state.appointmentFrame
  );
  const dispatch = useDispatch();
  const { classes } = useStyles();
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const redirect = () => {
    if (customerLoadedData?.isUpdating) {
      history.push('/f/appointment-manage/' + id);
    } else {
      history.push('/f/appointment/' + id);
    }
  };

  const onNext = () => {
    dispatch(setSlotsWarningOpen(false));

    if (appointmentByKey?.transportationOption && transportations.length) {
      const transportationAvailable = transportations.some(
        el => el.id === appointmentByKey?.transportationOption?.id
      );
      if (!transportationAvailable) {
        dispatch(setTransportation(null));
      }
    }

    const nextScreen: TScreen =
      isTransportationAvailable && currentScreen !== 'transportationNeeds'
        ? 'transportationNeeds'
        : isAppointmentTimingAvailable
          ? 'appointmentTiming'
          : 'appointmentSelection';
    dispatch(setCurrentFrameScreen(nextScreen));
    if (history.location.pathname.includes('welcome')) {
      redirect();
    }
  };

  useEffect(() => {
    if (isCloneMode) {
      onNext();
    }
  }, []);

  const onCancel = () => {
    dispatch(setSlotsWarningOpen(false));
  };

  return (
    <BaseModal width={450} open={isSlotsWarningOpen} onClose={onCancel}>
      <DialogTitle onClose={onCancel}>
        {t('Appointment availability depends on your selections. Please continue to see options.')}
      </DialogTitle>
      <div className={classes.wrapper}>
        <LoadingButton
          loading={false}
          fullWidth
          onClick={onCancel}
          variant="outlined"
          color="primary"
        >
          {t('Cancel')}
        </LoadingButton>
        <LoadingButton
          loading={false}
          fullWidth
          onClick={onNext}
          variant="contained"
          color="primary"
        >
          {t('Next')}
        </LoadingButton>
      </div>
    </BaseModal>
  );
};

export default SlotImpactedWarning;
