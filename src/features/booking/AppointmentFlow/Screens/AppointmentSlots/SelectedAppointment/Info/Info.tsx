import React from 'react';
import { EServiceType } from '../../../../../../../store/reducers/appointmentFrameReducer/types';
import { EPricingDisplayType } from '../../../../../../../store/reducers/pricingSettings/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../../store/rootReducer';
import { useTranslation } from 'react-i18next';
import { InfoWrapper } from './styles';

const Info = () => {
  const { serviceTypeOption } = useSelector((state: RootState) => state.appointmentFrame);
  const { appointmentSlots, appointment, serviceValetSlots } = useSelector(
    (state: RootState) => state.appointment
  );
  const { t } = useTranslation();

  const isDynamicPricing =
    serviceTypeOption?.type === EServiceType.PickUpDropOff
      ? serviceValetSlots.length
        ? serviceValetSlots[0]?.serviceRequestPrices?.find(
            item => item.pricingDisplayType === EPricingDisplayType.Dynamic
          )
        : false
      : appointmentSlots.length
        ? appointmentSlots[0]?.serviceRequestPrices?.find(
            item => item.pricingDisplayType === EPricingDisplayType.Dynamic
          )
        : false;

  return isDynamicPricing && serviceTypeOption?.type !== EServiceType.PickUpDropOff ? (
    <InfoWrapper>
      {!appointment?.price?.amountOfSavingMoney
        ? t('Save by booking at off peak times!')
        : `${t('Off Peak Savings Of')} $${appointment.price.amountOfSavingMoney.toFixed(2)}`}
    </InfoWrapper>
  ) : null;
};

export default Info;
