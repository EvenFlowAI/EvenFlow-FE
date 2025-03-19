import React from 'react';
import { TDateAppointmentData } from '../../../../../api/types';
import { dateTimeFormat } from '../AppointmentDetails/AppointmentDetails';
import { useDetailsItemStyles } from '../DetailsItem/styles';
import dayjs from 'dayjs';

export const ModifiedData: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<{ data: TDateAppointmentData[] }>>
> = ({ data }) => {
  const { classes } = useDetailsItemStyles();
  return data?.length ? (
    <div className={classes.wrapper}>
      <div className={classes.details}>
        <div className={classes.title}>Modified</div>
        {data.map(el => (
          <div
            className={classes.text}
            style={{ marginBottom: 8 }}
            key={dayjs(el.date).toISOString()}
          >
            <div>{dayjs(el.date).format(dateTimeFormat)}</div>
            <div>Scheduler: {el.scheduler?.fullName}</div>
          </div>
        ))}
      </div>
    </div>
  ) : null;
};
