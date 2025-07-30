import React, { useMemo, useState } from 'react';
import { AppointmentConfirmationTitle } from '../../../../../../components/wrappers/AppointmentConfirmationTitle/AppointmentConfirmationTitle';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../store/rootReducer';
import { useTranslation } from 'react-i18next';
import { EServiceType } from '../../../../../../store/reducers/appointmentFrameReducer/types';
import { List, MessageIconWrapper, ServiceItem, TitleWrapper } from './styles';
import { ConfirmationItemWrapper } from '../../../../../../components/styled/ConfirmationItemWrapper';
import { ReactComponent as MessageIcon } from '../../../../../../assets/img/comment_icon.svg';
import { ReactComponent as MessageIconFilled } from '../../../../../../assets/img/comment_icon_filled.svg';
import CommentModal from '../../../../../../components/modals/booking/CommentModal/CommentModal';
import { useModal } from '../../../../../../hooks/useModal/useModal';
import { ISR } from '../../../../../../store/reducers/appointment/types';
import { mergeArrayById } from '../../../../../../utils/utils';
import i18n from '../../../../../../i18n';

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
    packageEMenuType,
  } = useSelector((state: RootState) => state.appointmentFrame);
  const { scProfile } = useSelector((state: RootState) => state.appointment);
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

  const getPackageLabel = () => {
    if (selectedPackage?.name) {
      return selectedPackage?.name;
    }
    if (packageEMenuType !== null && scProfile?.maintenancePackageOptionTypes?.length) {
      const firstOption = scProfile?.maintenancePackageOptionTypes[0];
      return packageEMenuType === firstOption
        ? i18n.t('Factory Package')
        : i18n.t('Dealer Package');
    }
    return null;
  };

  const currentAppointmentServiceRequestsWithComment =
    currentAppointment?.serviceRequestPrices?.map(item => {
      const currentServiceRequest = serviceRequests.find(
        serviceRequest => serviceRequest.description === item.requestName
      );
      return {
        ...item,
        comment: selectedSRComments[currentServiceRequest?.id ?? 0] ?? '',
        id: currentServiceRequest?.id ?? 0,
      };
    });

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
              const currentCategory = currentAppointmentServiceRequestsWithComment?.find(
                serviceRequest => serviceRequest.requestName === item.requestName
              );
              const comment = currentCategory?.comment || currentServiceRequest?.comment;

              return (
                <ServiceItem key={item.requestName}>
                  {item.requestName.includes('Going')
                    ? t('My Description of Needs')
                    : item.requestName}
                  <MessageIconWrapper
                    onClick={() => {
                      if (currentServiceRequest?.type === 0) {
                        setSelectedRequest({
                          isCommentRequired: currentServiceRequest?.isCommentRequired ?? false,
                          description: currentServiceRequest?.description ?? '',
                          id: currentServiceRequest?.id ?? 0,
                          code: 'specialCategory',
                          comment: comment ?? '',
                        });
                      } else {
                        setSelectedRequest({
                          isCommentRequired: false,
                          description: currentCategory?.requestName ?? '',
                          id: currentCategory?.id ?? 0,
                          comment: comment ?? '',
                        });
                      }

                      onCommentOpen();
                    }}
                  >
                    {comment ? <MessageIconFilled /> : <MessageIcon />}
                  </MessageIconWrapper>
                </ServiceItem>
              );
            })
          ) : (
            <>
              {selectedRecalls.map(el => (
                <ServiceItem key={el.id}>{el.recallComponent}</ServiceItem>
              ))}
              <ServiceItem>{getPackageLabel()}</ServiceItem>
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
