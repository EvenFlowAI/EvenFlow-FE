import React from 'react';
import { TCallback } from '../../../types/types';
import { TGroupedAppointment } from '../../../utils/types';
import { ReactComponent as CalendarIcon } from '../../../assets/img/empty_calendar.svg';
import { ReactComponent as CalendarIconWhite } from '../../../assets/img/empty_calendar_white.svg';
import { monthDayFormat } from '../../../features/booking/AppointmentFlow/Screens/AppointmentSlots/constants';
import { Date, Day, DayCard } from '../../styled/DayCard';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getClearDate } from '../../../utils/utils';

dayjs.extend(utc);

type TProps = {
  day: string;
  onClick: TCallback;
  isCurrent: boolean;
  appointment?: TGroupedAppointment;
  isXs: boolean;
};

export const DaySelectCard: React.FC<TProps> = ({ day, onClick, appointment, isCurrent, isXs }) => {
  const utcDay = dayjs.utc(day);

  const getLabel = () => {
    return utcDay.format('ddd');
  };

  const utcNow = dayjs.utc();

  // for finding last slot with time
  const lastSlot = appointment?.appointments[appointment?.appointments?.length - 1].date;

  // added getClearDate for convert lastSlot to utc
  const isAvailable = lastSlot ? utcNow.isBefore(getClearDate(lastSlot)) : false;

  const isOffPeak =
    isAvailable && Boolean(appointment?.appointments?.find(el => el.price?.amountOfSavingMoney));

  return (
    <DayCard available={isAvailable} isCurrent={isCurrent} isOffPeak={isOffPeak} onClick={onClick}>
      <Date>{utcDay.format(monthDayFormat)}</Date>
      <Day available={isAvailable} isCurrent={isCurrent} isOffPeak={isOffPeak} onClick={onClick}>
        {isCurrent ? <CalendarIconWhite /> : <CalendarIcon />}
        {getLabel()}
        {isXs ? <div className="padding" /> : null}
      </Day>
    </DayCard>
  );
};
