import React from 'react';
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

export const SelectedAppointment = () => {
  const { serviceTypeOption } = useSelector((state: RootState) => state.appointmentFrame);
  const { appointment, serviceValetAppointment } = useSelector(
    (state: RootState) => state.appointment
  );
  const { classes } = useSelectedAppointmentStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const isSm = useMediaQuery(theme.breakpoints.down('md'));

  const price =
    serviceTypeOption?.type === EServiceType.PickUpDropOff && serviceValetAppointment
      ? (serviceValetAppointment?.price.value ?? 0)
      : (appointment?.price.value ?? 0);
  const ancillaryPrice =
    serviceTypeOption?.type === EServiceType.PickUpDropOff && serviceValetAppointment
      ? (serviceValetAppointment?.price.ancillaryPrice ?? 0)
      : (appointment?.price.ancillaryPrice ?? 0);

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
              {appointment && isSm ? (
                <DateWrapper>
                  {t('Date & Time')}: {dayjs.utc(appointment.date).format('MMMM D, h:mm A')}
                  <WaitListLabel />
                </DateWrapper>
              ) : serviceValetAppointment && isSm ? (
                <ServiceValetDateTime serviceValetAppointment={serviceValetAppointment} />
              ) : null}
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
            {appointment ? (
              <DateWrapper>
                {t('Date & Time')}: <br />{' '}
                {dayjs.utc(appointment.date).format('ddd, MMMM D, h:mm A')}
              </DateWrapper>
            ) : serviceValetAppointment ? (
              <ServiceValetDateTime serviceValetAppointment={serviceValetAppointment} />
            ) : null}
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
