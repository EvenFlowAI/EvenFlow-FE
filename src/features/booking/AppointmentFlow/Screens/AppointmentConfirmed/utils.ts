import { EServiceType } from '../../../../../store/reducers/appointmentFrameReducer/types';
import i18n from '../../../../../i18n';
import { IFirstScreenOption } from '../../../../../store/reducers/serviceTypes/types';

export const getAddressLabel = (serviceType: EServiceType): string => {
  switch (serviceType) {
    case EServiceType.MobileService:
      return i18n.t('Service Address');
    case EServiceType.PickUpDropOff:
      return i18n.t('Pick Up Address');
    default:
      return i18n.t('Address');
  }
};
export const getServiceName = (
  serviceTypeOption: IFirstScreenOption | null,
  serviceType: EServiceType
) => {
  if (serviceTypeOption?.name) return serviceTypeOption?.name;
  switch (serviceType) {
    case EServiceType.MobileService:
      return i18n.t('Mobile Service');
    case EServiceType.PickUpDropOff:
      return i18n.t('Pick Up / Drop Off Service');
    default:
      return i18n.t('Visit Center');
  }
};
