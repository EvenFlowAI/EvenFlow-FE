import React, { useState } from 'react';
import { ILoadedVehicle } from '../../../../../../api/types';
import { useDispatch, useSelector } from 'react-redux';
import { setVehicle } from '../../../../../../store/reducers/appointmentFrameReducer/actions';
import { TArgCallback } from '../../../../../../types/types';
import { RootState } from '../../../../../../store/rootReducer';
import { CarDataWithBtn, CardBtnWrapper, CarInfo, StyledButton, Wrapper } from './styles';
import { Button, useMediaQuery, useTheme } from '@mui/material';
import { Api } from '../../../../../../api/ApiEndpoints/ApiEndpoints';
import { useSCs } from '../../../../../../hooks/useSCs/useSCs';
import { useModal } from '../../../../../../hooks/useModal/useModal';
import AppointmentSelectionModal from '../../../../CustomerSelect/AppointmentSelectionModal/AppointmentSelectionModal';
import { AppointmentSummaryI } from '../../../../utils/types';

type TProps = {
  car: ILoadedVehicle;
  clearData: () => void;
  onSelectCar: TArgCallback<ILoadedVehicle>;
  onScheduleNewAppointment: TArgCallback<ILoadedVehicle>;
  customerId: string;
};

export const CarCard: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({
  car,
  clearData,
  onSelectCar,
  onScheduleNewAppointment,
  customerId,
}) => {
  const { mileage } = useSelector((state: RootState) => state.vehicleDetails);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const selectedScId: number | undefined = useSelector((state: RootState) => {
    return state.appointment.scProfile?.id;
  });
  const [loadedAppointmentsByCar, setLoadedAppointmentsByCar] = useState<AppointmentSummaryI[]>([]);
  const {
    onOpen: onOpenAppointmentSelection,
    onClose: onCloseAppointmentSelection,
    isOpen: isOpenAppointmentSelection,
  } = useModal();

  const onEdit = (appointmentHashKey: string) => {
    clearData();
    const updatedCar = { ...car, appointmentHashKeys: [appointmentHashKey] };
    const selectedMileage = mileage.find(
      el => el.value.toString() === updatedCar?.mileage?.toString()
    );
    dispatch(setVehicle({ ...updatedCar, mileage: selectedMileage?.value ?? null }));
    onSelectCar(updatedCar);
  };

  const onSchedule = () => {
    onScheduleNewAppointment(car);
  };

  const handleSelectAppointment = () => {
    Api.call(Api.endpoints.Appointments.GetShortByQuery, {
      params: {
        vehicleId: car.id,
        customerId: car.customerId,
        serviceCenterId: selectedScId,
      },
    })
      .then(async result => {
        if (result) {
          const appointments = result.data.result ?? [];

          if (!appointments.length) {
            console.error('Not appointments from request');
            return;
          }

          if (appointments.length === 1) {
              onEdit(appointments[0].appointmentHashKey);
            return;
          }

          if (appointments.length > 1) {
            setLoadedAppointmentsByCar(appointments);
            onOpenAppointmentSelection();
          }
        }
      })
      .catch(e => {
        console.error('Error while fetching appointment list:', e);
      });
  };

  return (
    <Wrapper>
      <CarDataWithBtn>
        <CarInfo>
          {car.year} {car.make} {car.model} {car?.modelDetails ?? ''}
        </CarInfo>
      </CarDataWithBtn>
      <CardBtnWrapper>
        <Button
          color="info"
          variant="contained"
          onClick={onSchedule}
        >
          Schedule {isSm ? 'Appointment' : null}
        </Button>
        <StyledButton
          onClick={handleSelectAppointment}
          disabled={!car.hasPlannedAppointment}
        >
          Change/Cancel {isSm ? 'Appointment' : null}
        </StyledButton>
      </CardBtnWrapper>
      {loadedAppointmentsByCar.length ? (
        <AppointmentSelectionModal
          open={isOpenAppointmentSelection}
          handleCancelAppointment={onEdit}
          onClose={onCloseAppointmentSelection}
          appointments={loadedAppointmentsByCar}
          isEditAppointment={tr}
        />
      ) : (
        <></>
      )}
    </Wrapper>
  );
};
