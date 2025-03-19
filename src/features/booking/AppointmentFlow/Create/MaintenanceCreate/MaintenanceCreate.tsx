import React, { useMemo } from 'react';
import { MaintenanceDetailsForm } from '../../Screens/MaintenanceDetails/MaintenanceDetailsForm';
import { TArgCallback, TScreen } from '../../../../../types/types';
import { EServiceCategoryPage } from '../../../../../api/types';
import { EServiceCategoryType } from '../../../../../store/reducers/categories/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';

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
  const { isAdvisorAvailable, isAppointmentTimingAvailable, isTransportationAvailable } =
    useSelector((state: RootState) => state.bookingFlowConfig);
  const { service, serviceTypeOption } = useSelector((state: RootState) => state.appointmentFrame);

  const nextLogicalScreen = useMemo(() => {
    let nextScreen: TScreen = 'appointmentSelection';
    if (isAdvisorAvailable) {
      nextScreen = 'consultantSelection';
    } else if (isTransportationAvailable && !serviceTypeOption?.transportationOption) {
      nextScreen = 'transportationNeeds';
    } else if (isAppointmentTimingAvailable) {
      nextScreen = 'appointmentTiming';
    }
    return nextScreen;
  }, [isAdvisorAvailable, isAppointmentTimingAvailable, isTransportationAvailable]);

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
