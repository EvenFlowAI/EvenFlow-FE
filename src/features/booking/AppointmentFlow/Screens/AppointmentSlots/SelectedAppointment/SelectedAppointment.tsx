import React, { useMemo } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../store/rootReducer';
import { EServiceType } from '../../../../../../store/reducers/appointmentFrameReducer/types';
import { useTranslation } from 'react-i18next';
import ServiceValetDateTime from './ServiceValetDateTime/ServiceValetDateTime';
import ServicesList from './ServicesWithPrices/ServicesWithPrices';
import Prices from './Prices/Prices';
import Address from './Address/Address';
import Info from './Info/Info';
import { useSelectedAppointmentStyles } from '../../../../../../hooks/styling/useSelectedAppointmentStyles';
import { DateWrapper } from '../../../../../../components/styled/DateWrapper';
import { List, PriceWrapper, Wrapper } from './styles';
import { WaitListLabel } from '../WaitListLabel/WaitListLabel';
import dayjs from 'dayjs';
import { ETransportationType } from '../../../../../../store/reducers/transportationNeeds/types';

const getServiceType = (
  serviceTypeOption: RootState['appointmentFrame']['serviceTypeOption'],
  transportation: RootState['appointmentFrame']['transportation']
) => {
  if (serviceTypeOption) {
    return serviceTypeOption.type;
  }

  return transportation?.type === ETransportationType.PickUpDelivery
    ? EServiceType.PickUpDropOff
    : EServiceType.VisitCenter;
};

const getPrice = ({
  serviceType,
  serviceValetAppointment,
  appointment,
  packageEMenuType,
  selectedPackage,
}: {
  serviceType: EServiceType;
  serviceValetAppointment: RootState['appointment']['serviceValetAppointment'];
  appointment: RootState['appointment']['appointment'];
  packageEMenuType: RootState['appointmentFrame']['packageEMenuType'];
  selectedPackage: RootState['appointmentFrame']['selectedPackage'];
}) => {
  if (serviceType === EServiceType.PickUpDropOff && serviceValetAppointment) {
    return serviceValetAppointment.price.value ?? 0;
  }

  const appointmentPrice = appointment?.price.value ?? 0;
  if (appointmentPrice !== 0) {
    return appointmentPrice;
  }

  if (packageEMenuType != null) {
    return selectedPackage?.price ?? 0;
  }

  return 0;
};

const getAncillaryPrice = ({
  serviceType,
  serviceValetAppointment,
  appointment,
}: {
  serviceType: EServiceType;
  serviceValetAppointment: RootState['appointment']['serviceValetAppointment'];
  appointment: RootState['appointment']['appointment'];
}) => {
  if (serviceType === EServiceType.PickUpDropOff && serviceValetAppointment) {
    return serviceValetAppointment.price.ancillaryPrice ?? 0;
  }

  return appointment?.price.ancillaryPrice ?? 0;
};

const renderMobileDate = (
  isSm: boolean,
  appointment: RootState['appointment']['appointment'],
  serviceValetAppointment: RootState['appointment']['serviceValetAppointment'],
  t: (key: string) => string
) => {
  if (!isSm) {
    return null;
  }

  if (appointment) {
    return (
      <DateWrapper>
        {t('Date & Time')}: {dayjs.utc(appointment.date).format('MMMM D, h:mm A')}
        <WaitListLabel />
      </DateWrapper>
    );
  }

  if (serviceValetAppointment) {
    return <ServiceValetDateTime serviceValetAppointment={serviceValetAppointment} />;
  }

  return null;
};

const renderDesktopDate = (
  appointment: RootState['appointment']['appointment'],
  serviceValetAppointment: RootState['appointment']['serviceValetAppointment'],
  t: (key: string) => string
) => {
  if (appointment) {
    return (
      <DateWrapper>
        {t('Date & Time')}: <br /> {dayjs.utc(appointment.date).format('ddd, MMMM D, h:mm A')}
      </DateWrapper>
    );
  }

  if (serviceValetAppointment) {
    return <ServiceValetDateTime serviceValetAppointment={serviceValetAppointment} />;
  }

  return null;
};

export const SelectedAppointment = () => {
  const { serviceTypeOption, selectedPackage, packageEMenuType, transportation } = useSelector(
    (state: RootState) => state.appointmentFrame
  );
  const { appointment, serviceValetAppointment } = useSelector(
    (state: RootState) => state.appointment
  );
  const { classes } = useSelectedAppointmentStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const isSm = useMediaQuery(theme.breakpoints.down('md'));

  const serviceType = useMemo(
    () => getServiceType(serviceTypeOption, transportation),
    [serviceTypeOption, transportation]
  );

  const price = useMemo(
    () =>
      getPrice({
        serviceType,
        serviceValetAppointment,
        appointment,
        packageEMenuType,
        selectedPackage,
      }),
    [serviceType, serviceValetAppointment, appointment, packageEMenuType, selectedPackage]
  );

  const ancillaryPrice = useMemo(
    () => getAncillaryPrice({ serviceType, serviceValetAppointment, appointment }),
    [serviceType, serviceValetAppointment, appointment]
  );

  return (
    <div>
      <Wrapper>
        <div>
          {!isSm && <p className={classes.title}>{t('Your selections')}</p>}
          <List>
            <li className="service-item" key="service-item">
              <ServicesList />
            </li>
            <li key="advisor" style={isSm ? { width: '100%' } : {}}>
              <Address />
              {renderMobileDate(isSm, appointment, serviceValetAppointment, t)}
              {isSm && Boolean(price) && (
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Prices price={price} ancillaryPrice={ancillaryPrice} />
                  <Info />
                </div>
              )}
            </li>
          </List>
        </div>
        {!isSm ? (
          <PriceWrapper>
            {renderDesktopDate(appointment, serviceValetAppointment, t)}
            <React.Fragment>
              {Boolean(price) && <Prices price={price} ancillaryPrice={ancillaryPrice} />}
              <WaitListLabel />
              {/*todo uncomment for offer new functionality*/}
              {/*{!isSm && Boolean(appointment?.serviceRequestPrices?.find(sr => sr.offer)) ? <div className="offerLabel">*/}
              {/*  <SpecialLabel><SpecialServiceIcon className="icon"/>{t("Service special applied")}</SpecialLabel>*/}
              {/*</div> : null}*/}
              <Info />
            </React.Fragment>
          </PriceWrapper>
        ) : null}
      </Wrapper>
    </div>
  );
};
