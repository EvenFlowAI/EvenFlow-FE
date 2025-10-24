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

  return userType === EUserType.Existing && customerLoadedData ? (
    <div className={classes.wrapper}>
      <div className={classes.title}>{t('Customer')}</div>
      <div>{customerName}</div>
      {customerLoadedData?.phoneNumbers?.[0]?.length ? (
        <div>Cell: {customerLoadedData?.phoneNumbers?.[0]}</div>
      ) : null}
      <div>
        {selectedVehicle?.year ?? ''} {selectedVehicle?.make ?? ''} {selectedVehicle?.model ?? ''}
      </div>
      <div>{selectedVehicle?.vin}</div>
    </div>
  ) : null;
};

export default CustomerInfo;
