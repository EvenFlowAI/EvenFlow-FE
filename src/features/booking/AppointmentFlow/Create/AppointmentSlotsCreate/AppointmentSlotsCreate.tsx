import React, { useMemo } from 'react';
import { TArgCallback } from '../../../../../types/types';
import { TScreen } from '../../../../../types/screens';
import { AppointmentSlots } from '../../Screens/AppointmentSlots/AppointmentSlots';
import { searchForCustomerConsents } from '../../../../../store/reducers/appointmentFrameReducer/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';
import { EServiceType } from '../../../../../store/reducers/appointmentFrameReducer/types';
import { ETransportationType } from '../../../../../store/reducers/transportationNeeds/types';

type TAppointmentSelectionProps = {
  handleSetScreen: TArgCallback<TScreen>;
};

const AppointmentSlotsCreate: React.FC<TAppointmentSelectionProps> = ({ handleSetScreen }) => {
  const { isTransportationAvailable, isAdvisorAvailable, currentConfig, config } = useSelector(
    (state: RootState) => state.bookingFlowConfig
  );
  const { serviceTypeOption, isPickupDropoffWithoutFirstScreenOption, transportation } =
    useSelector((state: RootState) => state.appointmentFrame);
  const dispatch = useDispatch();

  const serviceType = useMemo(() => {
    if (serviceTypeOption) {
      return serviceTypeOption.type;
    }

    return transportation?.type === ETransportationType.PickUpDelivery
      ? EServiceType.PickUpDropOff
      : EServiceType.VisitCenter;
  }, [serviceTypeOption, transportation]);

  const previousLogicalScreen: TScreen = useMemo(
    () =>
      currentConfig?.appointmentSelection
        ? 'appointmentTiming'
        : !serviceTypeOption?.transportationOption &&
            isTransportationAvailable &&
            !isPickupDropoffWithoutFirstScreenOption
          ? 'transportationNeeds'
          : (config.find(configItem => configItem.serviceType === serviceType)?.advisorSelection ??
              isAdvisorAvailable)
            ? 'consultantSelection'
            : 'serviceNeeds',
    [
      currentConfig,
      isAdvisorAvailable,
      isTransportationAvailable,
      serviceTypeOption,
      isPickupDropoffWithoutFirstScreenOption,
      serviceType,
    ]
  );

  const onEmptyConsents = () => handleSetScreen('appointmentConfirmation');

  const handleNext = (): void => {
    dispatch(searchForCustomerConsents(onEmptyConsents));
  };

  return (
    <AppointmentSlots
      handleSetScreen={handleSetScreen}
      onNext={handleNext}
      prevLogicalScreen={previousLogicalScreen}
    />
  );
};

export default AppointmentSlotsCreate;
