import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { EUserType } from '../../../../store/reducers/appointmentFrameReducer/types';
import { useStyles } from './styles';

const CustomerInfo = () => {
  const { customerLoadedData } = useSelector((state: RootState) => state.appointment);
  const { selectedVehicle, userType } = useSelector((state: RootState) => state.appointmentFrame);
  const { classes } = useStyles();
  const { t } = useTranslation();
  const customerName =
    customerLoadedData?.fullName ??
    `${customerLoadedData?.firstName ?? ''} ${customerLoadedData?.lastName ?? ''}`;

  const formatPhoneNumber = (raw?: string): string => {
    if (!raw) return '';

    const hasSeparators = /[-.()\s]/.test(raw);
    if (hasSeparators) return raw;

    const digitsOnly = raw.replace(/\D/g, '');
    if (digitsOnly.length === 10) {
      return `${digitsOnly.slice(0, 3)}.${digitsOnly.slice(3, 6)}.${digitsOnly.slice(6)}`;
    }

    return raw;
  };

  const getPreferredPhone = (): string => {
    const phones = customerLoadedData?.phoneNumbersByCategory;
    if (phones?.cell) return `Cell: ${formatPhoneNumber(phones.cell)}`;
    if (phones?.home) return `Home: ${formatPhoneNumber(phones.home)}`;
    if (phones?.other) return `Phone: ${formatPhoneNumber(phones.other)}`;
    if (customerLoadedData?.phoneNumber)
      return `Phone: ${formatPhoneNumber(customerLoadedData.phoneNumber)}`; // for the clone and edit
    return 'Phone: Missing';
  };

  return userType === EUserType.Existing && customerLoadedData ? (
    <div className={classes.wrapper}>
      <div className={classes.title}>{t('Customer')}</div>
      <div>{customerName}</div>

      <div>{getPreferredPhone()}</div>

      <div>
        {selectedVehicle?.year ?? ''} {selectedVehicle?.make ?? ''} {selectedVehicle?.model ?? ''}
      </div>

      <div>{selectedVehicle?.vin}</div>
    </div>
  ) : null;
};

export default CustomerInfo;
