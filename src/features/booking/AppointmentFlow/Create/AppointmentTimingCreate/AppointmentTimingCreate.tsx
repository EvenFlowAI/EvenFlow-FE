import React from 'react';
import { TArgCallback } from '../../../../../types/types';
import { TScreen } from '../../../../../types/screens';
import { AppointmentTiming } from '../../Screens/AppointmentTiming/AppointmentTiming';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';

const AppointmentTimingCreate: React.FC<{ handleSetScreen: TArgCallback<TScreen> }> = ({
  handleSetScreen,
}) => {
  const { consultants, serviceTypeOption } = useSelector(
    (state: RootState) => state.appointmentFrame
  );
  const { isAdvisorAvailable, isTransportationAvailable } = useSelector(
    (state: RootState) => state.bookingFlowConfig
  );

  const onBack = () => {
    const prev: TScreen =
      isTransportationAvailable && !serviceTypeOption?.transportationOption
        ? 'transportationNeeds'
        : isAdvisorAvailable && consultants.length
          ? 'consultantSelection'
          : 'serviceNeeds';
    handleSetScreen(prev);
  };
  return <AppointmentTiming handleSetScreen={handleSetScreen} onBack={onBack} />;
};

export default AppointmentTimingCreate;
