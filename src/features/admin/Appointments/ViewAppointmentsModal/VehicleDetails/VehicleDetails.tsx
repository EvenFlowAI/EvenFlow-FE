import React from 'react';
import { IAppointment } from '../../../../../api/types';
import { DetailsItem } from '../DetailsItem/DetailsItem';
import { Divider } from '@mui/material';
import { SimpleData, TitleWrapper } from '../styles';

export const VehicleDetails: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<{ payload: IAppointment }>>
> = ({ payload }) => {
  const vehicleData = `${payload.vehicle?.make ?? ''} ${payload.vehicle?.model ?? ''} ${Boolean(payload.vehicle?.year) ? payload.vehicle?.year : ''}`;
  return (
    <div>
      <TitleWrapper>Vehicle Details</TitleWrapper>
      <DetailsItem
        title={payload.vehicle?.vin ?? ''}
        text={
          payload.vehicle?.make || payload.vehicle?.model || Boolean(payload.vehicle?.year)
            ? vehicleData
            : 'DMS missing vehicle data'
        }
      />
      {payload?.estimatedMileage ? (
        <SimpleData>Estimated Mileage: {payload?.estimatedMileage} miles</SimpleData>
      ) : null}
      {payload?.vehicle?.dmsId ? (
        <SimpleData>Vehicle ID: {payload.vehicle?.dmsId}</SimpleData>
      ) : null}
      <Divider style={{ marginBottom: 24 }} />
    </div>
  );
};
