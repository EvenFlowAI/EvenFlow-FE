import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../../store/rootReducer';
import { EServiceType } from '../../../../../../../store/reducers/appointmentFrameReducer/types';
import { useTranslation } from 'react-i18next';
import { useMediaQuery, useTheme } from '@mui/material';
import { ReactComponent as PencilIcon } from '../../../../../../../assets/img/pencil.svg';
import { useModal } from '../../../../../../../hooks/useModal/useModal';
import EditAddressModal from '../../../../../EditAddressModal/EditAddressModal';
import { ETransportationType } from '../../../../../../../store/reducers/transportationNeeds/types';
import SwitchFlowModal from '../../../../../SwitchFlowModal/SwitchFlowModal';

const Address = () => {
  const { serviceTypeOption, address, zipCode, transportation } = useSelector(
    (state: RootState) => state.appointmentFrame
  );
  const { firstScreenOptions } = useSelector(({ serviceTypes }: RootState) => serviceTypes);
  const { isOpen, onClose, onOpen } = useModal();
  const {
    isOpen: isSwitchFlowOpen,
    onClose: onSwitchFlowClose,
    onOpen: onSwitchFlowOpen,
  } = useModal();

  const serviceType = useMemo(() => {
    if (serviceTypeOption) {
      return serviceTypeOption.type;
    }

    return transportation?.type === ETransportationType.PickUpDelivery
      ? EServiceType.PickUpDropOff
      : EServiceType.VisitCenter;
  }, [serviceTypeOption, transportation]);

  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('mdl'));

  const selectedOption = firstScreenOptions.find(item => item.type === EServiceType.VisitCenter);

  const openSwitchFlow = () => {
    onClose();
    onSwitchFlowOpen();
  };

  return serviceType !== EServiceType.VisitCenter && address ? (
    <div className="service-list">
      <h4
        style={
          isMobile
            ? {
                textTransform: 'capitalize',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }
            : {
                textTransform: 'uppercase',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }
        }
      >
        {' '}
        {t('Your Address')}:{' '}
        <span style={{ cursor: 'pointer' }} onClick={onOpen}>
          <PencilIcon />
        </span>
      </h4>
      <div style={{ fontWeight: 700 }}>
        {`${typeof address === 'string' ? address : address?.label}` || ''}
        {zipCode ? `, ${zipCode}` : ''}
      </div>
      <EditAddressModal open={isOpen} onClose={onClose} openSwitchFlow={openSwitchFlow} />
      <SwitchFlowModal
        open={isSwitchFlowOpen}
        onClose={onSwitchFlowClose}
        selectedOption={selectedOption || serviceTypeOption}
        onNext={onSwitchFlowClose}
      />
    </div>
  ) : null;
};

export default Address;
