import React, { useEffect, useMemo, useState } from 'react';
import { AppointmentConfirmationTitle } from '../../../../../../components/wrappers/AppointmentConfirmationTitle/AppointmentConfirmationTitle';
import { Edit } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../../store/rootReducer';
import { TCallback } from '../../../../../../types/types';
import { useTranslation } from 'react-i18next';
import { EServiceType } from '../../../../../../store/reducers/appointmentFrameReducer/types';
import {
  loadActiveTransportations,
  setCurrentFrameScreen,
  setEditingPosition,
  setServiceOptionChanged,
} from '../../../../../../store/reducers/appointmentFrameReducer/actions';
import { TServiceValetSlot } from '../../../../../../api/types';
import { TitleWrapper } from './styles';
import dayjs from 'dayjs';
import { ConfirmationItemWrapper } from '../../../../../../components/styled/ConfirmationItemWrapper';
import { setSlotsWarningOpen } from '../../../../../../store/reducers/modals/actions';
import { useModal } from '../../../../../../hooks/useModal/useModal';
import MileageModal from '../../../../../../components/modals/booking/MileageModal/MileageModal';
import { setHasRedirectFromAppointmentDateSelection } from '../../../../../../store/reducers/appointment/actions';
import { decodeSCID } from '../../../../../../utils/utils';
import { useParams } from 'react-router-dom';

type TProps = {
  onChangeSlot: TCallback;
};

export const AppointmentSelectedDate: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TProps>>
> = ({ onChangeSlot }) => {
  const {
    appointment,
    serviceValetAppointment,
    waitListSettings,
    dropOffSettings,
    customerLoadedData,
    isCloneMode,
    hasRedirectFromAppointmentDateSelection,
  } = useSelector((state: RootState) => state.appointment);
  const { isTransportationAvailable } = useSelector((state: RootState) => state.bookingFlowConfig);
  const { wasWarningShowed } = useSelector((state: RootState) => state.modals);
  const { id } = useParams<{ id: string }>();
  const {
    serviceTypeOption,
    isAppointmentSaving,
    appointmentByKey,
    transportation,
    transportations,
    selectedVehicle,
  } = useSelector((state: RootState) => state.appointmentFrame);
  const { onOpen, isOpen, onClose } = useModal();
  const [serviceValetTime, setServiceValetTime] = useState<TServiceValetSlot | null>(null);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const serviceType = useMemo(
    () => (serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter),
    [serviceTypeOption]
  );

  const isWaitList = appointment
    ? appointment?.isOverbookingApplied &&
      waitListSettings?.isEnabled &&
      serviceType === EServiceType.VisitCenter
    : appointmentByKey?.isWaitlist &&
      appointmentByKey?.waitlistTextSettings?.isEnabled &&
      serviceType === EServiceType.VisitCenter;

  const waitListData = appointment ? waitListSettings : appointmentByKey?.waitlistTextSettings;

  useEffect(() => {
    if (serviceValetAppointment) {
      setServiceValetTime({
        pickUpMin: serviceValetAppointment.pickUpMin,
        pickUpMax: serviceValetAppointment.pickUpMax,
        dropOffMin: serviceValetAppointment.dropOffMin,
        dropOffMax: serviceValetAppointment.dropOffMax,
      });
    } else if (appointmentByKey?.serviceValetTime) {
      const { serviceValetTime } = appointmentByKey;
      setServiceValetTime({
        pickUpMin: serviceValetTime.pickUpMin,
        pickUpMax: serviceValetTime.pickUpMax,
        dropOffMin: serviceValetTime.dropOffMin,
        dropOffMax: serviceValetTime.dropOffMax,
      });
    }
  }, [serviceValetAppointment, appointmentByKey]);

  const getDateForUpdate = (): string => {
    if (customerLoadedData?.isUpdating && appointmentByKey) {
      if (appointmentByKey?.serviceTypeOption?.type === EServiceType.PickUpDropOff) {
        return dayjs.utc(appointmentByKey.dateInUtc).format('ddd, MMMM D');
      } else {
        const [hh, mm] = appointmentByKey.timeSlot.split(':');
        return dayjs
          .utc(appointmentByKey.dateInUtc)
          .set('hour', +hh)
          .set('minute', +mm)
          .format('ddd, MMMM D, hh:mm A');
      }
    }
    return '';
  };

  const date =
    serviceTypeOption?.type === EServiceType.PickUpDropOff && serviceValetAppointment
      ? dayjs.utc(serviceValetAppointment?.date).format('ddd, MMMM D')
      : customerLoadedData?.isUpdating && appointmentByKey
        ? appointment?.date
          ? dayjs.utc(appointment?.date).format('ddd, MMMM D, hh:mm A')
          : getDateForUpdate()
        : dayjs.utc(appointment?.date).format('ddd, MMMM D, hh:mm A');

  const handleChangeSlot = () => {
    if (customerLoadedData?.isUpdating) {
      dispatch(setEditingPosition('slot'));
      dispatch(setServiceOptionChanged(false));
    }
    if (!isAppointmentSaving) {
      if (isTransportationAvailable && !transportation && !wasWarningShowed) {
        dispatch(setSlotsWarningOpen(true));
      } else {
        onChangeSlot();
      }
    }
  };

  useEffect(() => {
    if (isCloneMode && !hasRedirectFromAppointmentDateSelection) {
      dispatch(loadActiveTransportations(decodeSCID(id)));
      onOpen();
    }
  }, []);

  const handleCloseMileageModal = () => {
    onClose();
    if (!hasRedirectFromAppointmentDateSelection) {
      dispatch(setHasRedirectFromAppointmentDateSelection(true));

      const transportationAvailable = transportations.some(
        transportation => transportation.id === appointmentByKey?.transportationOption?.id
      );

      if (transportationAvailable) {
        handleChangeSlot();
      } else {
        dispatch(setCurrentFrameScreen('transportationNeeds'));
      }
    }
  };

  return (
    <ConfirmationItemWrapper>
      <TitleWrapper>
        <AppointmentConfirmationTitle>{t('Selected Date & Time')}</AppointmentConfirmationTitle>
        <Edit
          htmlColor="#142EA1"
          fontSize="small"
          onClick={handleChangeSlot}
          style={{ cursor: 'pointer' }}
        />
      </TitleWrapper>
      {serviceTypeOption?.type === EServiceType.PickUpDropOff && serviceValetAppointment ? (
        <div>
          <span style={{ fontWeight: 'bold' }}>{t('Date')}</span>: {date}
        </div>
      ) : (
        date
      )}
      {serviceTypeOption?.type === EServiceType.PickUpDropOff &&
      (serviceValetAppointment || appointmentByKey?.serviceValetTime) ? (
        <div>
          <div>
            <span style={{ fontWeight: 'bold' }}>{t('Pick Up Time')}: </span>
            <span> {dayjs.utc(serviceValetTime?.pickUpMin, 'HH:mm:ss').format('hh:mm A')}</span>
            <span> {t('to')} </span>
            <span> {dayjs.utc(serviceValetTime?.pickUpMax, 'HH:mm:ss').format('hh:mm A')}</span>
          </div>
          {dropOffSettings?.showDropOffTime &&
          serviceValetTime?.dropOffMin &&
          serviceValetTime?.dropOffMax ? (
            <div>
              <span style={{ fontWeight: 'bold' }}>{t('Drop Off Time')}: </span>
              <span> {dayjs.utc(serviceValetTime?.dropOffMin, 'HH:mm:ss').format('hh:mm A')}</span>
              <span> {t('to')} </span>
              <span> {dayjs.utc(serviceValetTime?.dropOffMax, 'HH:mm:ss').format('hh:mm A')}</span>
            </div>
          ) : null}
        </div>
      ) : null}
      {isWaitList ? (
        <div
          style={{
            color: waitListData?.textHex ? `#${waitListData?.textHex}` : '#CE690B',
            marginTop: 8,
          }}
        >
          {waitListData?.text ?? t('Waitlist only')}
        </div>
      ) : null}
      <MileageModal open={isOpen} onClose={onClose} onSave={handleCloseMileageModal} blockClosing />
    </ConfirmationItemWrapper>
  );
};
