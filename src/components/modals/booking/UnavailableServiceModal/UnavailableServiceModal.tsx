import React, { Dispatch, SetStateAction, useMemo } from 'react';
import { DialogContent, DialogTitle } from '../../BaseModal/BaseModal';
import { Button, Dialog } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { useDialogStyles } from '../../../../hooks/styling/useDialogStyles';
import { useTranslation } from 'react-i18next';
import { EServiceType } from '../../../../store/reducers/appointmentFrameReducer/types';
import {
  setAddress,
  setCurrentFrameScreen,
  setZipCode,
} from '../../../../store/reducers/appointmentFrameReducer/actions';
import { TCallback } from '../../../../types/types';
import { useStyles } from './styles';
import { setUnavailableServiceOpen } from '../../../../store/reducers/modals/actions';
import { ETransportationType } from '../../../../store/reducers/transportationNeeds/types';

type TUnavailableServiceProps = {
  setFormChecked: Dispatch<SetStateAction<boolean>>;
  onBackToServiceOption: TCallback;
  onVisitCenter: TCallback;
  onBackToSelectSlotsForVisitCenter: TCallback;
  clearAnotherLocation?: () => void;
};

const UnavailableServiceModal: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TUnavailableServiceProps>>
> = ({
  setFormChecked,
  onBackToSelectSlotsForVisitCenter,
  onBackToServiceOption,
  onVisitCenter,
  clearAnotherLocation,
}) => {
  const { serviceTypeOption, appointmentByKey, serviceOptionChangedFromSlotPage, transportation } =
    useSelector((state: RootState) => state.appointmentFrame);
  const { customerLoadedData } = useSelector((state: RootState) => state.appointment);
  const { isUnavailableServiceOpen } = useSelector((state: RootState) => state.modals);
  const { classes: dialogClasses } = useDialogStyles();
  const { classes } = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const serviceType = useMemo(() => {
    if (serviceTypeOption) {
      return serviceTypeOption.type;
    }

    return transportation?.type === ETransportationType.PickUpDelivery
      ? EServiceType.PickUpDropOff
      : EServiceType.VisitCenter;
  }, [serviceTypeOption, transportation]);

  const isSameServiceTypeOption = useMemo(() => {
    return appointmentByKey?.serviceTypeOption?.id === serviceTypeOption?.id;
  }, [appointmentByKey, serviceTypeOption]);
  const serviceString =
    serviceType === EServiceType.MobileService
      ? t('Mobile Service')
      : t('Pick Up / Drop Off Service');

  const backLabel = serviceOptionChangedFromSlotPage
    ? t('Back to Visit Center')
    : customerLoadedData?.isUpdating
      ? isSameServiceTypeOption
        ? t('Keep Original Location')
        : t('Back')
      : t('Visit Center');

  const onClose = () => dispatch(setUnavailableServiceOpen(false));

  const clearLocation = () => {
    if (clearAnotherLocation) {
      clearAnotherLocation();
      onClose();
      return;
    }
    setFormChecked(false);
    dispatch(setAddress(null));
    dispatch(setZipCode(''));
    onClose();
  };

  const keepOriginalLocation = () => {
    dispatch(setAddress(appointmentByKey?.address?.fullAddress ?? null));
    dispatch(setZipCode(appointmentByKey?.address?.zipCode ?? ''));
    onClose();
    dispatch(setCurrentFrameScreen('manageAppointment'));
  };

  const onVisitCenterClick = () => {
    if (serviceOptionChangedFromSlotPage) {
      onBackToSelectSlotsForVisitCenter();
    } else {
      if (customerLoadedData?.isUpdating) {
        if (isSameServiceTypeOption) {
          keepOriginalLocation();
        } else {
          onBackToServiceOption();
          clearLocation();
        }
      } else {
        onVisitCenter();
        clearLocation();
      }
    }
  };

  return (
    <Dialog
      open={isUnavailableServiceOpen}
      fullWidth
      onClose={onClose}
      classes={{ root: dialogClasses.root, paper: dialogClasses.dialogPaper }}
    >
      <DialogTitle onClose={onClose} />
      <DialogContent>
        <div style={{ marginBottom: 0 }} className={classes.info}>
          {serviceOptionChangedFromSlotPage
            ? `${t('We’re sorry but we do not offer')} ${serviceString} ${t('for your area')}`
            : `${t('We’re sorry but we do not offer')} ${serviceString} ${t('for your area')}. ${t('Would you like to try another address or visit our service center?')}`}
        </div>
      </DialogContent>
      <div style={{ gap: '14px' }} className={classes.buttonWrapper}>
        <Button
          style={{ width: '166px' }}
          onClick={clearLocation}
          color={'primary'}
          variant="outlined"
        >
          {'Another Address'}
        </Button>
        <Button
          style={{ width: 'fit-content' }}
          onClick={onVisitCenterClick}
          color={'primary'}
          variant="contained"
        >
          {backLabel}
        </Button>
      </div>
    </Dialog>
  );
};

export default UnavailableServiceModal;
