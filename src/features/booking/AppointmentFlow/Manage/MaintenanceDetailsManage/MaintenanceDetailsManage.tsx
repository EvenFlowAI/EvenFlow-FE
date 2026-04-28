import React from 'react';
import { MaintenanceDetailsForm } from '../../Screens/MaintenanceDetails/MaintenanceDetailsForm';
import { TArgCallback } from '../../../../../types/types';
import { TScreen } from '../../../../../types/screens';
import { EServiceCategoryPage } from '../../../../../api/types';
import { EServiceCategoryType } from '../../../../../store/reducers/categories/types';
import { EServiceType } from '../../../../../store/reducers/appointmentFrameReducer/types';
import { checkPodChanged } from '../../../../../store/reducers/appointments/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';
import { useException } from '../../../../../hooks/useException/useException';
import { ETransportationType } from '../../../../../store/reducers/transportationNeeds/types';

type TMaintenanceDetailsProps = {
  onBack: TArgCallback<TScreen>;
  onNext: TArgCallback<TScreen>;
  serviceCategoryPage: EServiceCategoryPage;
};

const MaintenanceDetailsManage: React.FC<TMaintenanceDetailsProps> = ({
  onBack,
  onNext,
  serviceCategoryPage,
}) => {
  const { isAdvisorAvailable, isAppointmentTimingAvailable, isTransportationAvailable } =
    useSelector((state: RootState) => state.bookingFlowConfig);
  const { service, serviceTypeOption, appointmentByKey, advisor, transportation } = useSelector(
    (state: RootState) => state.appointmentFrame
  );
  const { scProfile } = useSelector((state: RootState) => state.appointment);

  const dispatch = useDispatch();
  const showError = useException();

  const handleUpdating = () => {
    if (service?.type === EServiceCategoryType.MaintenancePackage) {
      onNext('packageSelection');
    } else {
      const advisorNotSelected = !advisor && isAdvisorAvailable;

      const pickUpSelected =
        transportation?.type === ETransportationType.PickUpDelivery &&
        appointmentByKey?.serviceTypeOption &&
        appointmentByKey?.serviceTypeOption?.type !== EServiceType.PickUpDropOff;
      const pickUpChanged =
        serviceTypeOption?.type !== EServiceType.PickUpDropOff &&
        appointmentByKey?.serviceTypeOption &&
        transportation?.type === ETransportationType.PickUpDelivery;
      if (pickUpSelected || pickUpChanged) {
        onNext(
          advisorNotSelected
            ? 'consultantSelection'
            : isTransportationAvailable && !serviceTypeOption?.transportationOption
              ? 'transportationNeeds'
              : isAppointmentTimingAvailable
                ? 'appointmentTiming'
                : 'appointmentSelection'
        );
      } else {
        if (advisorNotSelected) {
          onNext('consultantSelection');
        } else {
          scProfile && dispatch(checkPodChanged(scProfile.id, showError));
        }
      }
    }
  };

  return (
    <MaintenanceDetailsForm
      serviceCategoryPage={serviceCategoryPage}
      onBack={onBack}
      handleNext={handleUpdating}
    />
  );
};

export default MaintenanceDetailsManage;
