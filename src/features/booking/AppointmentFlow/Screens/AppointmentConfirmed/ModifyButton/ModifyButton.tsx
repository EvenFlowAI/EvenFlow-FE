import React from 'react';
import { setCustomerLoadedData } from '../../../../../../store/reducers/appointment/actions';
import {
  clearAppointmentData,
  setCurrentFrameScreen,
  setServiceOptionChanged,
  setUserType,
} from '../../../../../../store/reducers/appointmentFrameReducer/actions';
import { EUserType } from '../../../../../../store/reducers/appointmentFrameReducer/types';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { TArgCallback } from '../../../../../../types/types';
import { ILoadedVehicle } from '../../../../../../api/types';
import { RootState } from '../../../../../../store/rootReducer';
import { useHistory, useParams } from 'react-router-dom';

type TProps = {
  onUpdateAppointment: TArgCallback<ILoadedVehicle>;
};

const ModifyButton: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({
  onUpdateAppointment,
}) => {
  const { isAppointmentSaving, selectedVehicle } = useSelector(
    (state: RootState) => state.appointmentFrame
  );
  const { customerLoadedData } = useSelector((state: RootState) => state.appointment);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const onModify = async () => {
    if (selectedVehicle) {
      if (customerLoadedData) {
        await dispatch(setCustomerLoadedData({ ...customerLoadedData, isUpdating: true }));
        await dispatch(clearAppointmentData(true));
        await dispatch(setServiceOptionChanged(false));
        await dispatch(setUserType(EUserType.Existing));
      }
      await onUpdateAppointment(selectedVehicle);
      await dispatch(setCurrentFrameScreen('manageAppointment'));
      history.push('/f/appointment-manage/' + id);
    }
  };

  return (
    <Button
      color="primary"
      fullWidth
      variant="outlined"
      onClick={onModify}
      disabled={isAppointmentSaving}
    >
      {t('Modify Appointment')}
    </Button>
  );
};

export default ModifyButton;
