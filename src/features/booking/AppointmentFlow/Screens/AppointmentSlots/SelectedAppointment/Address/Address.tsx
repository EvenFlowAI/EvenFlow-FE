import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../../store/rootReducer';
import { EServiceType } from '../../../../../../../store/reducers/appointmentFrameReducer/types';
import { useTranslation } from 'react-i18next';
import { useMediaQuery, useTheme } from '@mui/material';
import { ReactComponent as PencilIcon } from '../../../../../../../assets/img/pencil.svg';
import { useModal } from '../../../../../../../hooks/useModal/useModal';
import EditAddressModal from '../../../../../EditAddressModal/EditAddressModal';

const Address = () => {
  const { serviceTypeOption, address, zipCode } = useSelector(
    (state: RootState) => state.appointmentFrame
  );
  const { isOpen, onClose, onOpen } = useModal();
  const serviceType = useMemo(
    () => (serviceTypeOption ? serviceTypeOption.type : EServiceType.VisitCenter),
    [serviceTypeOption]
  );
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('mdl'));

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
      <EditAddressModal open={isOpen} onClose={onClose} />
    </div>
  ) : null;
};

export default Address;
