import React, { useMemo } from 'react';
import { TArgCallback } from '../../../../../types/types';
import { TScreen } from '../../../../../types/screens';
import { AppointmentTiming } from '../../Screens/AppointmentTiming/AppointmentTiming';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';
import { ETransportationType } from '../../../../../store/reducers/transportationNeeds/types';
import { EServiceType } from '../../../../../store/reducers/appointmentFrameReducer/types';

const AppointmentTimingCreate: React.FC<{ handleSetScreen: TArgCallback<TScreen> }> = ({
  handleSetScreen,
}) => {
  const { serviceTypeOption, isPickupDropoffWithoutFirstScreenOption, transportation } =
    useSelector((state: RootState) => state.appointmentFrame);
  const { isAdvisorAvailable, isTransportationAvailable, config } = useSelector(
    (state: RootState) => state.bookingFlowConfig
  );

  const serviceType = useMemo(() => {
    if (serviceTypeOption) {
      return serviceTypeOption.type;
    }

    return transportation?.type === ETransportationType.PickUpDelivery
      ? EServiceType.PickUpDropOff
      : EServiceType.VisitCenter;
  }, [serviceTypeOption, transportation]);

  const onBack = () => {
    const prev: TScreen =
      isTransportationAvailable &&
      !serviceTypeOption?.transportationOption &&
      !isPickupDropoffWithoutFirstScreenOption
        ? 'transportationNeeds'
        : (config.find(configItem => configItem.serviceType === serviceType)?.advisorSelection ??
            isAdvisorAvailable)
          ? 'consultantSelection'
          : 'serviceNeeds';
    handleSetScreen(prev);
  };
  return <AppointmentTiming handleSetScreen={handleSetScreen} onBack={onBack} />;
};

export default AppointmentTimingCreate;
