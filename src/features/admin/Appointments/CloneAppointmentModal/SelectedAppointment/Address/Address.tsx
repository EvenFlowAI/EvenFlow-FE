import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../store/rootReducer';
import { EServiceType } from '../../../../../../store/reducers/appointmentFrameReducer/types';
import { useTranslation } from 'react-i18next';

const Address = () => {
  const { currentAppointment } = useSelector((state: RootState) => state.appointments);
  const { t } = useTranslation();
  const serviceType = useMemo(
    () =>
      currentAppointment?.serviceTypeOption
        ? currentAppointment.serviceTypeOption.type
        : EServiceType.VisitCenter,
    [currentAppointment]
  );

  return serviceType !== EServiceType.VisitCenter && currentAppointment?.address ? (
    <div className="service-list">
      <h4>
        {' '}
        {t('YOUR ADDRESS')}:{' '}
        <div>
          {`${currentAppointment?.address?.fullAddress}` || ''}
          {currentAppointment?.address?.zipCode ? `, ${currentAppointment?.address?.zipCode}` : ''}
        </div>
      </h4>
    </div>
  ) : null;
};

export default Address;
