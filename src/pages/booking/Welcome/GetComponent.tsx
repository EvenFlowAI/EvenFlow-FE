import React from 'react';
import ServiceCenterSelect from '../../../features/booking/ServiceCenterSelect/ServiceCenterSelect';
import ServiceTypeSelect from '../../../features/booking/ServiceTypeSelect/ServiceTypeSelect';
import { CustomerSelect } from '../../../features/booking/CustomerSelect/CustomerSelect';
import { EServiceType, EUserType } from '../../../store/reducers/appointmentFrameReducer/types';
import { TView } from '../../../types/types';

interface GetComponentI {
  welcomeScreenView: TView;
  loading: boolean;
  isLoading: boolean;
  onComplete: (
    serviceType: EServiceType,
    selectedUserType?: EUserType,
    emailFromQuery?: string
  ) => void;
  handleValueServiceConfig: (serviceType: EServiceType) => void;
  handleNew: () => void;
  redirect: () => void;
}

export const GetComponent = ({
  welcomeScreenView,
  loading,
  isLoading,
  onComplete,
  handleValueServiceConfig,
  handleNew,
  redirect,
}: GetComponentI) => {
  switch (welcomeScreenView) {
    case 'serviceCenterSelect':
      return <ServiceCenterSelect />;
    case 'search':
    case 'serviceSelect':
      return (
        <ServiceTypeSelect loading={loading} handleValueServiceConfig={handleValueServiceConfig} />
      );
    case 'select':
    default:
      return (
        <CustomerSelect
          loading={loading || isLoading}
          onComplete={onComplete}
          handleNew={handleNew}
          redirect={redirect}
        />
      );
  }
};
