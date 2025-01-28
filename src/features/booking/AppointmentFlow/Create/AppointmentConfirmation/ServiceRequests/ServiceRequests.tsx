import React, { useMemo } from 'react';
import { AppointmentConfirmationTitle } from '../../../../../../components/wrappers/AppointmentConfirmationTitle/AppointmentConfirmationTitle';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../store/rootReducer';
import { useTranslation } from 'react-i18next';
import { EServiceType } from '../../../../../../store/reducers/appointmentFrameReducer/types';
import { List, ServiceItem, TitleWrapper } from './styles';
import { ConfirmationItemWrapper } from '../../../../../../components/styled/ConfirmationItemWrapper';

const ServiceRequests = () => {
  const { appointment, serviceValetAppointment, selectedSR, selectedSRComments } = useSelector(
    (state: RootState) => state.appointment
  );

  const { serviceTypeOption } = useSelector((state: RootState) => state.appointmentFrame);

  const { t } = useTranslation();

  const currentAppointment = useMemo(() => {
    return serviceTypeOption?.type === EServiceType.PickUpDropOff
      ? serviceValetAppointment
      : appointment;
  }, [serviceTypeOption, serviceValetAppointment, appointment]);

  console.log({ appointment, serviceValetAppointment, selectedSR, selectedSRComments });

  return currentAppointment?.serviceRequestPrices?.length ? (
    <ConfirmationItemWrapper>
      <TitleWrapper>
        <AppointmentConfirmationTitle>{t('Service Requests')}</AppointmentConfirmationTitle>
      </TitleWrapper>
      <List>
        {currentAppointment?.serviceRequestPrices?.map(item => (
          <ServiceItem key={item.requestName}>
            {item.requestName.includes('Going') ? t('My Description of Needs') : item.requestName}
          </ServiceItem>
        ))}
      </List>
    </ConfirmationItemWrapper>
  ) : null;
};

export default ServiceRequests;
