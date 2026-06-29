import React, { useMemo } from 'react';
import { MaintenanceDetailsForm } from '../../Screens/MaintenanceDetails/MaintenanceDetailsForm';
import { TArgCallback } from '../../../../../types/types';
import { TScreen } from '../../../../../types/screens';
import { EServiceCategoryPage } from '../../../../../api/types';
import { EServiceCategoryType } from '../../../../../store/reducers/categories/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';
import { ETransportationType } from '../../../../../store/reducers/transportationNeeds/types';
import { EServiceType } from '../../../../../store/reducers/appointmentFrameReducer/types';

type TMaintenanceDetailsProps = {
  onBack: TArgCallback<TScreen>;
  onNext: TArgCallback<TScreen>;
  serviceCategoryPage: EServiceCategoryPage;
};

const MaintenanceCreate: React.FC<TMaintenanceDetailsProps> = ({
  onBack,
  onNext,
  serviceCategoryPage,
}) => {
  const { isAdvisorAvailable, isAppointmentTimingAvailable, isTransportationAvailable, config } =
    useSelector((state: RootState) => state.bookingFlowConfig);
  const { service, serviceTypeOption, transportation, isPickupDropoffWithoutFirstScreenOption } =
    useSelector((state: RootState) => state.appointmentFrame);

  const serviceType = useMemo(() => {
    if (serviceTypeOption) {
      return serviceTypeOption.type;
    }

    return transportation?.type === ETransportationType.PickUpDelivery
      ? EServiceType.PickUpDropOff
      : EServiceType.VisitCenter;
  }, [serviceTypeOption, transportation]);

  const nextLogicalScreen = useMemo(() => {
    let nextScreen: TScreen = 'appointmentSelection';
    if (
      config.find(configItem => configItem.serviceType === serviceType)?.advisorSelection ??
      isAdvisorAvailable
    ) {
      nextScreen = 'consultantSelection';
    } else if (
      isTransportationAvailable &&
      !serviceTypeOption?.transportationOption &&
      !isPickupDropoffWithoutFirstScreenOption
    ) {
      nextScreen = 'transportationNeeds';
    } else if (isAppointmentTimingAvailable) {
      nextScreen = 'appointmentTiming';
    }
    return nextScreen;
  }, [
    isAdvisorAvailable,
    isAppointmentTimingAvailable,
    isTransportationAvailable,
    isPickupDropoffWithoutFirstScreenOption,
    config,
    serviceType,
    serviceTypeOption,
  ]);

  const goToNextScreen = () => {
    onNext(
      service?.type === EServiceCategoryType.MaintenancePackage
        ? 'packageSelection'
        : nextLogicalScreen
    );
  };

  return (
    <MaintenanceDetailsForm
      serviceCategoryPage={serviceCategoryPage}
      onBack={onBack}
      handleNext={goToNextScreen}
    />
  );
};

export default MaintenanceCreate;
