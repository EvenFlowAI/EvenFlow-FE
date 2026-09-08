import React from 'react';
import { Button } from '@mui/material';
import { CarCard } from './CarCard/CarCard';
import { AppointmentScreenTitle } from '../../../../../components/wrappers/AppointmentScreenTitle/AppointmentScreenTitle';
import { ButtonsRow, CarsWrapper, NewVehicleBtn } from './styles';
import { BookNewVehicle, NewVehicleCard } from './CarCard/styles';
import { ReactComponent as CarIcon } from '../../../../../assets/img/caricon.svg';
import { ILoadedVehicle } from '../../../../../api/types';
import { TCallback } from '../../../../../types/types';
import { RootState } from '../../../../../store/rootReducer';

type TCarsContentProps = {
  isSm: boolean;
  loading: boolean;
  onBack: TCallback;
  onAddNewVehicle: () => void;
  onSelectCar: (car: ILoadedVehicle) => Promise<void>;
  onScheduleNewAppointment: (vehicle: ILoadedVehicle) => void;
  clearData: () => Promise<void>;
  customerLoadedData: RootState['appointment']['customerLoadedData'];
  t: (key: string) => string;
};

export const CarsContent: React.FC<React.PropsWithChildren<TCarsContentProps>> = ({
  isSm,
  loading,
  onBack,
  onAddNewVehicle,
  onSelectCar,
  onScheduleNewAppointment,
  clearData,
  customerLoadedData,
  t,
}) => {
  return (
    <>
      <AppointmentScreenTitle>{t('Which vehicle are you coming in for?')}</AppointmentScreenTitle>
      <CarsWrapper>
        {customerLoadedData?.vehicles.length ? (
          <>
            {customerLoadedData.vehicles.map((vehicle, index) => (
              <CarCard
                onScheduleNewAppointment={onScheduleNewAppointment}
                onSelectCar={onSelectCar}
                clearData={clearData}
                car={vehicle}
                key={vehicle.dmsId || new Date().toISOString() + index}
                customerId={customerLoadedData.id}
              />
            ))}
            {!isSm ? (
              <NewVehicleCard role="presentation" onClick={onAddNewVehicle}>
                <CarIcon />
                <BookNewVehicle>{t('Book Another Vehicle')}</BookNewVehicle>
              </NewVehicleCard>
            ) : null}
          </>
        ) : (
          <p>{t('No vehicles present')}</p>
        )}
      </CarsWrapper>
      <ButtonsRow>
        {isSm ? (
          <NewVehicleBtn
            onClick={onAddNewVehicle}
            variant="outlined"
            color="primary"
            disabled={loading}
          >
            {t('Book Another Vehicle')}
          </NewVehicleBtn>
        ) : null}
        <Button onClick={onBack} disabled={loading} variant="outlined" color="primary">
          Back
        </Button>
      </ButtonsRow>
    </>
  );
};
