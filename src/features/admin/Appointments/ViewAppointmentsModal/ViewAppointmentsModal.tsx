import React, { useEffect } from 'react';
import {
  BaseModal,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '../../../../components/modals/BaseModal/BaseModal';
import { Button, CircularProgress } from '@mui/material';
import { DialogProps } from '../../../../components/modals/BaseModal/types';
import { AppointmentStatus, IAppointment } from '../../../../api/types';
import { AppointmentDetails } from './AppointmentDetails/AppointmentDetails';
import { VehicleDetails } from './VehicleDetails/VehicleDetails';
import { CustomerInfo } from './CustomerInfo/CustomerInfo';
import { OperationalDetails } from './OperationalDetails/OperationalDetails';
import { LoaderWrapper, Wrapper } from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { RootState } from '../../../../store/rootReducer';
import { TCallback } from '../../../../types/types';
import { loadMileage } from '../../../../store/reducers/vehicleDetails/actions';

type TCallbackProps = {
  onEditAppointment: TCallback;
  onCloneAppointment: TCallback;
  onCancelAppointment: TCallback;
  refresh?: TCallback;
};

export const ViewAppointmentsModal: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<DialogProps<IAppointment> & TCallbackProps>>
> = ({
  onAction,
  refresh,
  onEditAppointment,
  onCloneAppointment,
  onCancelAppointment,
  payload,
  ...props
}) => {
  const { isAppointmentLoading } = useSelector((state: RootState) => state.appointments);
  const { isAppointmentSlotsLoading } = useSelector((state: RootState) => state.appointment);

  const { selectedSC } = useSCs();
  const dispatch = useDispatch();

  useEffect(() => {
    selectedSC && dispatch(loadMileage(selectedSC.id));
  }, [selectedSC]);

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
          onClick={onCloneAppointment}
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
      ={' '}
    </BaseModal>
  );
};
