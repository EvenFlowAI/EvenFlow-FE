import React from 'react';
import { TCallback } from '../../../types/types';
import { IServiceValetAppointment } from '../../../store/reducers/appointment/types';
import { ReactComponent as CalendarIcon } from '../../../assets/img/empty_calendar.svg';
import { ReactComponent as CalendarIconWhite } from '../../../assets/img/empty_calendar_white.svg';
import { monthDayFormat } from '../../../features/booking/AppointmentFlow/Screens/AppointmentSlots/constants';
import { Date, Day, DayCard } from '../../styled/DayCard';
import dayjs from 'dayjs';

type TProps = {
  day: string;
  onClick: TCallback;
  isCurrent: boolean;
  appointment?: IServiceValetAppointment;
  isXs: boolean;
};

export const SVDaySelectCard: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TProps>>
> = ({ day, onClick, appointment, isCurrent, isXs }) => {
  const getLabel = () => {
    return dayjs.utc(day).format('ddd');
  };

  return (
    <DayCard available={Boolean(appointment)} isCurrent={isCurrent} isOffPeak={false}>
      <Date>{dayjs.utc(day).format(monthDayFormat)}</Date>
      <Day available={Boolean(appointment)} isCurrent={isCurrent} onClick={onClick}>
        {isCurrent ? <CalendarIconWhite /> : <CalendarIcon />}
        {getLabel()}
        {isXs ? <div className="padding" /> : null}
      </Day>
    </DayCard>
  );
};
