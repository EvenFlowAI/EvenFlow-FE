import React, { useMemo, useState } from 'react';
import { AppointmentConfirmationTitle } from '../../../../../../components/wrappers/AppointmentConfirmationTitle/AppointmentConfirmationTitle';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../../store/rootReducer';
import { useTranslation } from 'react-i18next';
import {
  setCurrentFrameScreen,
  setEditingPosition,
  setServiceOptionChanged,
} from '../../../../../../store/reducers/appointmentFrameReducer/actions';
import { Edit } from '@mui/icons-material';
import { List, TitleWrapper, ServiceItem, MessageIconWrapper } from './styles';
import { getMaintenanceDescription } from '../../../../../../utils/utils';
import { ConfirmationItemWrapper } from '../../../../../../components/styled/ConfirmationItemWrapper';
import { useModal } from '../../../../../../hooks/useModal/useModal';
import { ReactComponent as MessageIcon } from '../../../../../../assets/img/comment_icon.svg';
import { ReactComponent as MessageIconFilled } from '../../../../../../assets/img/comment_icon_filled.svg';
import CommentModal from '../../../../../../components/modals/booking/CommentModal/CommentModal';
import { ISR } from '../../../../../../store/reducers/appointment/types';

const ServiceRequestsManaging = () => {
  const {
    selectedRecalls,
    packagePriceTitles,
    selectedPackage,
    packagePricingType,
    packageEMenuType,
    valueService,
    categoriesIds,
    description,
  } = useSelector((state: RootState) => state.appointmentFrame);
  const { isOpen: isCommentOpen, onClose: onCommentClose, onOpen: onCommentOpen } = useModal();
  const { allCategories } = useSelector((state: RootState) => state.categories);
  const {
    serviceRequests: srList,
    selectedSR,
    scProfile,
    serviceRequests,
    selectedSRComments,
  } = useSelector((state: RootState) => state.appointment);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [selectedRequest, setSelectedRequest] = useState<ISR | null>(null);

  const handleEditServiceRequests = () => {
    dispatch(setServiceOptionChanged(false));
    dispatch(setEditingPosition('serviceRequests'));
    dispatch(setCurrentFrameScreen('serviceNeeds'));
  };

  const servicesList = useMemo(() => {
    return getMaintenanceDescription(
      srList,
      selectedRecalls,
      packagePriceTitles,
      selectedSR,
      selectedPackage,
      allCategories,
      categoriesIds,
      valueService,
      packagePricingType,
      packageEMenuType,
      scProfile?.maintenancePackageOptionTypes
    );
  }, [
    srList,
    selectedSR,
    selectedRecalls,
    selectedPackage,
    allCategories,
    packagePriceTitles,
    categoriesIds,
    valueService,
    packagePricingType,
    packageEMenuType,
    scProfile,
  ]);

  const currentCategories = allCategories.filter(
    category => categoriesIds.includes(category.id) && category.type === 0
  );
  return servicesList?.length ? (
    <ConfirmationItemWrapper>
      <TitleWrapper>
        <AppointmentConfirmationTitle>{t('Service Requests')}</AppointmentConfirmationTitle>
        <Edit
          htmlColor="#142EA1"
          fontSize="small"
          style={{ cursor: 'pointer' }}
          onClick={handleEditServiceRequests}
        />
      </TitleWrapper>
      <List>
        <>
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
                      description: item?.name,
                      id: item.id,
                      code: 'specialCategory',
                    });
                    onCommentOpen();
                  }}
                >
                  {description ? <MessageIconFilled /> : <MessageIcon />}
                </MessageIconWrapper>
              </ServiceItem>
            );
          })}
        </>
      </List>
      <CommentModal
        selectedRequest={selectedRequest}
        currentComment={
          selectedRequest?.code === 'specialCategory'
            ? description
            : selectedSRComments[selectedRequest?.id ?? 0]
        }
        open={isCommentOpen}
        onClose={() => {
          onCommentClose();
        }}
      />
    </ConfirmationItemWrapper>
  ) : null;
};

export default ServiceRequestsManaging;
