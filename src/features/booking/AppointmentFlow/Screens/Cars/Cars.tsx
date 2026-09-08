import React, { Dispatch, SetStateAction } from 'react';
import { TArgCallback, TCallback } from '../../../../../types/types';
import { TScreen } from '../../../../../types/screens';
import { StepWrapper } from '../../../../../components/styled/StepWrapper';
import { ILoadedVehicle } from '../../../../../api/types';
import { Loading } from '../../../../../components/wrappers/Loading/Loading';
import { CarsContent } from './CarsContent';
import { useCarsController } from '../../../../../hooks/useCars/useCarsController';

type TProps = {
  onBack: TCallback;
  loading: boolean;
  needToShowServiceSelection: boolean;
  handleSetScreen: TArgCallback<TScreen>;
  setNeedToShowServiceSelection: Dispatch<SetStateAction<boolean>>;
  onSelectAppointment?: (car: ILoadedVehicle) => Promise<void>;
};

export const Cars: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({
  onSelectAppointment,
  onBack,
  loading,
  handleSetScreen,
  needToShowServiceSelection,
  setNeedToShowServiceSelection,
}) => {
  const {
    customerLoadedData,
    isAuthorized,
    isSm,
    t,
    clearData,
    onSelectCar,
    handleAddNewVehicle,
    handleAddNewCarAppointment,
  } = useCarsController({
    handleSetScreen,
    needToShowServiceSelection,
    setNeedToShowServiceSelection,
    onSelectAppointment,
  });

  return (
    <StepWrapper>
      {loading || isAuthorized ? (
        <Loading />
      ) : (
        <CarsContent
          isSm={isSm}
          loading={loading}
          onBack={onBack}
          onAddNewVehicle={handleAddNewVehicle}
          onSelectCar={onSelectCar}
          onScheduleNewAppointment={handleAddNewCarAppointment}
          clearData={clearData}
          customerLoadedData={customerLoadedData}
          t={t}
        />
      )}
    </StepWrapper>
  );
};
