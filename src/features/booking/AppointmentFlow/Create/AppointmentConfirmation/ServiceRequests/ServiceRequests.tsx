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
import { mergeArrayById } from '../../../../../../utils/utils';

const ServiceRequests = () => {
  const { appointment, serviceValetAppointment, selectedSR, selectedSRComments, serviceRequests } =
    useSelector((state: RootState) => state.appointment);
  const { isOpen: isCommentOpen, onClose: onCommentClose, onOpen: onCommentOpen } = useModal();
  const {
    serviceTypeOption,
    packagePriceTitles,
    serviceCategories,
    selectedPackage,
    packagePricingType,
    selectedRecalls,
  } = useSelector((state: RootState) => state.appointmentFrame);
  const [selectedRequest, setSelectedRequest] = useState<ISR | null>(null);
  const { allCategories } = useSelector((state: RootState) => state.categories);
  const { t } = useTranslation();

  const currentAppointment = useMemo(() => {
    return serviceTypeOption?.type === EServiceType.PickUpDropOff
      ? serviceValetAppointment
      : appointment;
  }, [serviceTypeOption, serviceValetAppointment, appointment]);

  const serviceCategoriesWithComments = mergeArrayById(serviceCategories);

  const currentCategories = allCategories.filter(
    category =>
      serviceCategoriesWithComments.map(item => item.id).includes(category.id) &&
      category.type === 0
  );

  let name;
  if (selectedPackage) {
    name = `${selectedPackage.name} package`;
    if (packagePriceTitles?.length) {
      const price = packagePriceTitles.find(item => item.type === packagePricingType);
      if (price) name = name + ` (${price.title})`;
    }
  }

  // const currentAppointmentServiceRequestsWithComment =
  //   currentAppointment?.serviceRequestPrices?.map(item => {
  //     const currentServiceRequest = serviceRequests.find(
  //       serviceRequest => serviceRequest.description === item.requestName
  //     );
  //     return {
  //       ...item,
  //       comment: selectedSRComments[currentServiceRequest?.id ?? 0] ?? '',
  //       id: currentServiceRequest?.id ?? 0,
  //     };
  //   });

  return currentAppointment?.serviceRequestPrices?.length ? (
    <>
      <ConfirmationItemWrapper>
        <TitleWrapper>
          <AppointmentConfirmationTitle>{t('Service Requests')}</AppointmentConfirmationTitle>
        </TitleWrapper>
        <List>
          {serviceTypeOption?.type === EServiceType.PickUpDropOff ? (
            currentAppointment?.serviceRequestPrices?.map(item => {
              const currentServiceRequest =
                serviceCategoriesWithComments.find(
                  serviceRequest => serviceRequest.name === item.requestName
                ) ?? null;
              return (
                <ServiceItem key={item.requestName}>
                  {item.requestName.includes('Going')
                    ? t('My Description of Needs')
                    : item.requestName}
                  <MessageIconWrapper
                    onClick={() => {
                      setSelectedRequest({
                        isCommentRequired: currentServiceRequest?.isCommentRequired ?? false,
                        description: currentServiceRequest?.description ?? '',
                        id: currentServiceRequest?.id ?? 0,
                        code: 'specialCategory',
                        comment: currentServiceRequest?.comment ?? '',
                      });
                      onCommentOpen();
                    }}
                  >
                    {currentServiceRequest?.comment ? <MessageIconFilled /> : <MessageIcon />}
                  </MessageIconWrapper>
                </ServiceItem>
              );
            })
          ) : (
            <>
              {selectedRecalls.map(el => (
                <ServiceItem key={el.id}>{el.recallComponent}</ServiceItem>
              ))}
              {selectedPackage?.name ? <ServiceItem>{name}</ServiceItem> : null}
              {selectedSR.map(item => {
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
              {currentCategories.map(item => {
                return (
                  <ServiceItem key={item.id}>
                    {item?.name?.includes('Going') ? t('My Description of Needs') : item?.name}
                    <MessageIconWrapper
                      onClick={() => {
                        setSelectedRequest({
                          isCommentRequired: item?.isCommentRequired ?? false,
                          description: item?.name,
                          id: item.id,
                          code: 'specialCategory',
                          comment: serviceCategoriesWithComments.find(
                            itemWithComments => itemWithComments.id === item.id
                          )?.comment,
                        });
                        onCommentOpen();
                      }}
                    >
                      {serviceCategoriesWithComments.find(
                        itemWithComments => itemWithComments.id === item.id
                      )?.comment ? (
                        <MessageIconFilled />
                      ) : (
                        <MessageIcon />
                      )}
                    </MessageIconWrapper>
                  </ServiceItem>
                );
              })}
            </>
          )}
        </List>
      </ConfirmationItemWrapper>
      <CommentModal
        selectedRequest={selectedRequest}
        currentComment={
          selectedRequest?.code === 'specialCategory'
            ? (selectedRequest?.comment ?? '')
            : (selectedSRComments[selectedRequest?.id ?? 0] ?? '')
        }
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
