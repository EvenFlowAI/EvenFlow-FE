import React from 'react';
import { IAppointment } from '../../../../../api/types';
import { TitleWrapper } from '../styles';
import { DetailsItem } from '../DetailsItem/DetailsItem';
import { Divider } from '@mui/material';
import { Text, Title } from './styles';

export const CustomerInfo: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<{ payload: IAppointment }>>
> = ({ payload }) => {
  return (
    <div>
      <TitleWrapper>Customer Information</TitleWrapper>
      <DetailsItem
        title={
          payload.customerInformation
            ? (payload.customerInformation?.fullName ?? '')
            : 'DMS missing Customer Information'
        }
        text={`${payload.customerInformation?.email ?? ''} ${payload.customerInformation?.phoneNumber ?? ''}`}
      />
      {payload.customerInformation?.dmsId ? (
        <Title>Customer ID: {payload.customerInformation?.dmsId}</Title>
      ) : null}
      {payload.customerInformation?.companyName ? (
        <Title style={{ marginTop: 12 }}>
          Company Name:<Text> {payload.customerInformation?.companyName}</Text>
        </Title>
      ) : null}
      <Divider style={{ marginBottom: 24 }} />
    </div>
  );
};
