import React, { useMemo } from 'react';
import { AppointmentConfirmationTitle } from '../../../../../../components/wrappers/AppointmentConfirmationTitle/AppointmentConfirmationTitle';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../store/rootReducer';
import { useTranslation } from 'react-i18next';
import { EServiceType } from '../../../../../../store/reducers/appointmentFrameReducer/types';
import { Price } from './styles';
import { ConfirmationItemWrapper } from '../../../../../../components/styled/ConfirmationItemWrapper';
import { EPricingDisplayType } from '../../../../../../store/reducers/pricingSettings/types';

export const SelectedPrice = () => {
  const { appointment, scProfile, serviceValetAppointment } = useSelector(
    (state: RootState) => state.appointment
  );
  const { serviceTypeOption, packageEMenuType, selectedPackage } = useSelector(
    (state: RootState) => state.appointmentFrame
  );

  const { t } = useTranslation();

  const noDefinedPriceExists = useMemo(() => {
    if (serviceValetAppointment && serviceTypeOption?.type === EServiceType.PickUpDropOff) {
      return serviceValetAppointment?.serviceRequestPrices?.find(
        item => !item.priceValue || item.pricingDisplayType === EPricingDisplayType.Suppressed
      );
    }
    return appointment?.serviceRequestPrices?.find(
      item => !item.priceValue || item.pricingDisplayType === EPricingDisplayType.Suppressed
    );
  }, [appointment, serviceValetAppointment, serviceTypeOption]);

  const effectivePrice = useMemo(() => {
    if (serviceTypeOption?.type === EServiceType.PickUpDropOff && serviceValetAppointment) {
      const base = serviceValetAppointment.price?.value ?? 0;
      const ancillary = serviceValetAppointment.price?.ancillaryPrice ?? 0;
      return base + ancillary;
    }

    const apptBase = appointment?.price?.value ?? 0;
    const ancillary = appointment?.price?.ancillaryPrice ?? 0;

    // If appointment price is zero AND eMenu package is present -> use package price
    if ((appointment?.price?.value ?? 0) === 0 && packageEMenuType != null) {
      return selectedPackage?.price ?? 0;
    }

    return apptBase + ancillary;
  }, [appointment, serviceValetAppointment, serviceTypeOption, packageEMenuType, selectedPackage]);

  const formatPrice = (n: number) => (scProfile?.isRoundPrice ? n : n.toFixed(2));

  const showValet = serviceTypeOption?.type === EServiceType.PickUpDropOff;

  return (
    <ConfirmationItemWrapper>
      <AppointmentConfirmationTitle>{t('Selected Price')}</AppointmentConfirmationTitle>
      <Price>
        {showValet ? (
          serviceValetAppointment && !noDefinedPriceExists ? (
            <span>${formatPrice(effectivePrice)}</span>
          ) : (
            t('A full quote will be provided at the dealership')
          )
        ) : appointment && !noDefinedPriceExists ? (
          <span>${formatPrice(effectivePrice)}</span>
        ) : (
          t('A full quote will be provided at the dealership')
        )}
        {/*todo uncomment for offer new functionality*/}
        {/*{appointment?.serviceRequestPrices?.find(item => !!item.offer)*/}
        {/*    ? <SpecialLabel><SpecialServiceIcon className="icon"/>{t("Service special applied")}</SpecialLabel>*/}
        {/*    : null}*/}
      </Price>
    </ConfirmationItemWrapper>
  );
};
