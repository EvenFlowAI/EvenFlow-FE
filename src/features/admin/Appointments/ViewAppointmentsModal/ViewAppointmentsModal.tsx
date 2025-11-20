import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BaseModal,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '../../../../components/modals/BaseModal/BaseModal';
import { Button, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import { DialogProps } from '../../../../components/modals/BaseModal/types';
import { AppointmentStatus, IAppointment } from '../../../../api/types';
import { AppointmentDetails } from './AppointmentDetails/AppointmentDetails';
import { VehicleDetails } from './VehicleDetails/VehicleDetails';
import { CustomerInfo } from './CustomerInfo/CustomerInfo';
import { OperationalDetails } from './OperationalDetails/OperationalDetails';
import { LoaderWrapper, Wrapper } from './styles';
import { useDispatch, useSelector } from 'react-redux';
import {
  handleUpdatedMileageForCloning,
  loadAppointmentByKey,
  loadSCProfile,
} from '../../../../store/reducers/appointments/actions';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { encodeSCID } from '../../../../utils/utils';
import { useModal } from '../../../../hooks/useModal/useModal';
import Informing from '../../../../components/modals/common/Informing/Informing';
import CloneAppointmentModal from '../CloneAppointmentModal/CloneAppointmentModal';
import { ReactComponent as Warning } from '../../../../assets/img/warning_icon.svg';
import { RootState } from '../../../../store/rootReducer';
import { TCallback } from '../../../../types/types';
import { loadMileage } from '../../../../store/reducers/vehicleDetails/actions';
import MileageModal from '../../../../components/modals/booking/MileageModal/MileageModal';
import dayjs from 'dayjs';

type TCallbackProps = {
  onEditAppointment: TCallback;
  onCancelAppointment: TCallback;
  refresh?: TCallback;
  isClone: boolean;
  setIsClone: (isClone: boolean) => void;
};

export const ViewAppointmentsModal: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<DialogProps<IAppointment> & TCallbackProps>>
> = ({
  onAction,
  refresh,
  onEditAppointment,
  onCancelAppointment,
  isClone,
  setIsClone,
  payload,
  ...props
}) => {
  const { isAppointmentLoading } = useSelector((state: RootState) => state.appointments);
  const { selectedTime } = useSelector((state: RootState) => state.appointmentFrame);
  const { isAppointmentSlotsLoading } = useSelector((state: RootState) => state.appointment);
  const [messageText, setMessageText] = useState<string>('');

  const [currentApiStartDate, setCurrentApiStartDate] = useState<string | null>(null);
  const [currentApiEndDate, setCurrentApiEndDate] = useState<string | null>(null);

  const { selectedSC } = useSCs();
  const { onOpen, isOpen, onClose } = useModal();
  const { onOpen: onOpenClone, isOpen: isOpenClone, onClose: onCloseClone } = useModal();
  const { isOpen: isMileageOpen, onClose: onMileageClose, onOpen: onMileageOpen } = useModal();
  const apiDatesSetRef = useRef<boolean>(false);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.down('md'));
  const isXs = useMediaQuery(theme.breakpoints.down('xsm'));
  const isMds = useMediaQuery(theme.breakpoints.down('mds'));
  const daysPerScreen: number = useMemo(() => {
    return isXs ? 3 : isMd ? 4 : isMds ? 5 : 6;
  }, [isMd, isMds, isXs]);

  useEffect(() => {
    selectedSC && dispatch(loadMileage(selectedSC.id));
  }, [selectedSC]);

  useEffect(() => {
    if (isClone) {
      onClone().then(() => {
        window.history.replaceState(null, '', '/admin/appointments/');
        setIsClone(false);
      });
    }
  }, [isClone]);

  const handleNoSlots = () => {
    setMessageText(
      'We are sorry but the appointment cannot be cloned.  The original appointment has services that are not available in EvenFlow.'
    );
    onOpen();
  };

  const getApiDates = () => {
    const utcOffset = dayjs().utcOffset();
    const anchorTime = selectedTime ? dayjs(selectedTime) : dayjs().startOf('day');
    const idealStartDay = anchorTime.subtract(Math.floor(daysPerScreen / 3), 'day').startOf('day');
    const desiredStartDate = dayjs.max(dayjs().startOf('day'), idealStartDay);
    const desiredEndDate = desiredStartDate.add(daysPerScreen - 1, 'day');
    const apiStartDate = desiredStartDate.add(utcOffset, 'minute').toISOString();
    const apiEndDate = desiredEndDate.add(utcOffset, 'minute').toISOString();

    console.log('selectedTime', selectedTime);

    return { apiStartDate, apiEndDate };
  };

  const setApiDates = (newStartDate: string) => {
    // Only run once per session/component mount
    if (apiDatesSetRef.current) {
      return;
    }

    apiDatesSetRef.current = true;

    console.log('newStartDate', newStartDate);

    const utcOffset = dayjs().utcOffset();
    const anchorTime = dayjs(newStartDate);
    const idealStartDay = anchorTime.subtract(Math.floor(daysPerScreen / 3), 'day').startOf('day');
    const desiredStartDate = dayjs.max(dayjs().startOf('day'), idealStartDay);
    const desiredEndDate = desiredStartDate.add(daysPerScreen - 1, 'day');
    const apiStartDate = desiredStartDate.add(utcOffset, 'minute').toISOString();
    const apiEndDate = desiredEndDate.add(utcOffset, 'minute').toISOString();
    setCurrentApiStartDate(apiStartDate);
    setCurrentApiEndDate(apiEndDate);
    console.log('apiStartDate', apiStartDate);
    console.log('apiEndDate');
  };

  const handleExEvenFlowAppointments = () => {
    setMessageText(`We are sorry but this appointment \n 
            was made outside of EvenFlow \n 
            and is not able to be cloned.`);
    onOpen();
  };

  const onGetSlots = (isEmptyList: boolean) => {
    isEmptyList ? handleNoSlots() : onOpenClone();
  };

  const onClone = async () => {
    if (payload?.hashKey && selectedSC) {
      const { apiStartDate, apiEndDate } = getApiDates();

      console.log('on clone 1', apiStartDate, apiEndDate);

      dispatch(loadSCProfile(selectedSC.id));
      dispatch(
        loadAppointmentByKey(
          payload?.hashKey,
          encodeSCID(selectedSC.id),
          onGetSlots,
          apiStartDate,
          apiEndDate,
          onMileageOpen,
          setApiDates,
          setCurrentApiStartDate,
          setCurrentApiEndDate
        )
      );
    } else {
      handleExEvenFlowAppointments();
    }
  };

  const onAfterClone = () => {
    refresh && refresh();
    props.onClose();
  };

  const onMileageSave = () => {
    const { apiStartDate, apiEndDate } = getApiDates();
    selectedSC &&
      dispatch(
        handleUpdatedMileageForCloning(
          encodeSCID(selectedSC.id),
          onGetSlots,
          apiStartDate,
          apiEndDate
        )
      );
    onMileageClose();
  };

  const loadNextSlots = async () => {
    const { apiStartDate, apiEndDate } = getApiDates();
    const nextApiStartDate = dayjs(apiStartDate)
      .add(daysPerScreen, 'day')
      .startOf('day')
      .toISOString();
    const nextApiEndDate = dayjs(apiEndDate).add(daysPerScreen, 'day').endOf('day').toISOString();
    // loadData({ requestedStartDate: nextApiStartDate, requestedEndDate: nextApiEndDate }).finally();

    console.log('load next slots', apiStartDate, apiEndDate, nextApiStartDate, nextApiEndDate);

    if (payload?.hashKey && selectedSC) {
      await dispatch(
        loadAppointmentByKey(
          payload?.hashKey,
          encodeSCID(selectedSC.id),
          onGetSlots,
          nextApiStartDate,
          nextApiEndDate,
          onMileageOpen,
          setApiDates,
          setCurrentApiStartDate,
          setCurrentApiEndDate
        )
      );
    }
  };

  const loadPreviousSlots = async () => {
    const { apiStartDate, apiEndDate } = getApiDates();
    const previousApiStartDate = dayjs(apiStartDate)
      .subtract(daysPerScreen, 'day')
      .startOf('day')
      .toISOString();
    const previousApiEndDate = dayjs(apiEndDate)
      .subtract(daysPerScreen, 'day')
      .endOf('day')
      .toISOString();
    if (payload?.hashKey && selectedSC) {
      await dispatch(
        loadAppointmentByKey(
          payload?.hashKey,
          encodeSCID(selectedSC.id),
          onGetSlots,
          previousApiStartDate,
          previousApiEndDate,
          onMileageOpen,
          setApiDates,
          setCurrentApiStartDate,
          setCurrentApiEndDate
        )
      );
    }
  };

  return (
    <BaseModal {...props} width={940}>
      <DialogTitle onClose={props.onClose}>View Appointment</DialogTitle>
      <DialogContent>
        {!payload || isAppointmentLoading || isAppointmentSlotsLoading ? (
          <LoaderWrapper>
            <CircularProgress />
          </LoaderWrapper>
        ) : (
          <>
            <Wrapper>
              <AppointmentDetails payload={payload} />
              <div>
                <VehicleDetails payload={payload} />
                <CustomerInfo payload={payload} />
                <OperationalDetails payload={payload} />
              </div>
            </Wrapper>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onCancelAppointment}
          disabled={
            payload?.appointmentStatus === AppointmentStatus.Cancelled || !payload?.isEditable
          }
          color="secondary"
          variant="outlined"
        >
          Cancel Appointment
        </Button>
        <Button
          onClick={onEditAppointment}
          disabled={
            payload?.appointmentStatus === AppointmentStatus.Cancelled || !payload?.isEditable
          }
          color="primary"
          variant="outlined"
        >
          Edit
        </Button>
        <Button
          id="clone-appointment"
          onClick={onClone}
          variant="outlined"
          style={{ color: '#5FA077', borderColor: '#5FA077' }}
          aria-hidden={false}
        >
          Clone
        </Button>
        <Button onClick={props.onClose} color="info">
          Close
        </Button>
      </DialogActions>
      <Informing icon={<Warning />} open={isOpen} onClose={onClose} title={messageText} />
      <CloneAppointmentModal
        open={isOpenClone}
        onClose={onCloseClone}
        onViewClose={onAfterClone}
        loadNextSlots={loadNextSlots}
        loadPreviousSlots={loadPreviousSlots}
        currentApiStartDate={currentApiStartDate}
        currentApiEndDate={currentApiEndDate}
        setApiDates={setApiDates}
      />
      <MileageModal
        open={isMileageOpen}
        onSave={onMileageSave}
        onClose={onMileageClose}
        isAdminPanel
      />
    </BaseModal>
  );
};
