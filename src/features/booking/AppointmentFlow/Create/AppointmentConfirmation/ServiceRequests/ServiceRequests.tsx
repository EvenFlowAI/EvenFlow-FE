import React, { useMemo, useState } from 'react';
import { AppointmentConfirmationTitle } from '../../../../../../components/wrappers/AppointmentConfirmationTitle/AppointmentConfirmationTitle';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../store/rootReducer';
import { useTranslation } from 'react-i18next';
import { EServiceType } from '../../../../../../store/reducers/appointmentFrameReducer/types';
import { List, ServiceItem, TitleWrapper, MessageIconWrapper } from './styles';
import { ConfirmationItemWrapper } from '../../../../../../components/styled/ConfirmationItemWrapper';
import { ReactComponent as MessageIcon } from '../../../../../../assets/img/comment_icon.svg';
import { ReactComponent as MessageIconFilled } from '../../../../../../assets/img/comment_icon_filled.svg';
import CommentModal from '../../../../../../components/modals/booking/CommentModal/CommentModal';
import { useModal } from '../../../../../../hooks/useModal/useModal';
import { ISR } from '../../../../../../store/reducers/appointment/types';

const ServiceRequests = () => {
  const { appointment, serviceValetAppointment, selectedSR, selectedSRComments, serviceRequests } =
    useSelector((state: RootState) => state.appointment);
  const { isOpen: isCommentOpen, onClose: onCommentClose, onOpen: onCommentOpen } = useModal();
  const { serviceTypeOption } = useSelector((state: RootState) => state.appointmentFrame);
  const [selectedRequest, setSelectedRequest] = useState<ISR | null>(null);

  const { t } = useTranslation();

  const currentAppointment = useMemo(() => {
    return serviceTypeOption?.type === EServiceType.PickUpDropOff
      ? serviceValetAppointment
      : appointment;
  }, [serviceTypeOption, serviceValetAppointment, appointment]);

  return currentAppointment?.serviceRequestPrices?.length ? (
    <>
      <ConfirmationItemWrapper>
        <TitleWrapper>
          <AppointmentConfirmationTitle>{t('Service Requests')}</AppointmentConfirmationTitle>
        </TitleWrapper>
        <List>
          {serviceTypeOption?.type === EServiceType.PickUpDropOff
            ? serviceValetAppointment?.serviceRequestPrices?.map(item => (
                <ServiceItem key={item.requestName}>
                  {item.requestName.includes('Going')
                    ? t('My Description of Needs')
                    : item.requestName}
                </ServiceItem>
              ))
            : selectedSR.map(item => {
                const currentServiceRequest = serviceRequests.find(
                  serviceRequest => serviceRequest.id === item
                );
                if (currentServiceRequest) {
                  return (
                    <ServiceItem key={item}>
                      {currentServiceRequest?.description?.includes('Going')
                        ? t('My Description of Needs')
                        : currentServiceRequest.description}
                      <MessageIconWrapper
                        onClick={() => {
                          setSelectedRequest(currentServiceRequest);
                          onCommentOpen();
                        }}
                      >
                        {selectedSRComments[item] ? <MessageIconFilled /> : <MessageIcon />}
                      </MessageIconWrapper>
                    </ServiceItem>
                  );
                }
                return null;
              })}
        </List>
      </ConfirmationItemWrapper>
      <CommentModal
        selectedRequest={selectedRequest}
        currentComment={selectedSRComments[selectedRequest?.id ?? 0]}
        open={isCommentOpen}
        onClose={() => {
          onCommentClose();
          setSelectedRequest(null);
        }}
      />
    </>
  ) : null;
};

export default ServiceRequests;
