import React from 'react';
import { TArgCallback, TParsableDate } from '../../../types/types';
import { useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { SVDaySelector } from '../SVDaySelector/SVDaySelector';

import { MonthSelector } from '../MonthSelector/MonthSelector';
import { TMonthProps } from '../../../features/booking/AppointmentFlow/Screens/AppointmentSlots/types';

type TProps = {
  onDateRangeSet: TArgCallback<boolean>;
  firstDayWithSlots?: null | TParsableDate;
  dateRangeUpdated: boolean;
  dateChangeDisabled: boolean;
  daysPerScreen: number;
  onLoadNext: () => void;
  onLoadPrevious: () => void;
  apiStartDate?: string | null;
  apiEndDate?: string | null;
} & TMonthProps;

export const SVAppointmentDateSelector: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TProps>>
> = ({
  date,
  firstDayWithSlots,
  onDateChange,
  dateChangeDisabled,
  dateRangeUpdated,
  onDateRangeSet,
  daysPerScreen,
  onLoadNext,
  onLoadPrevious,
  apiStartDate,
  apiEndDate,
}) => {
  const { serviceValetSlots } = useSelector((state: RootState) => state.appointment);
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();

  return (
    <div>
      {!isXs && <h4>{t('Select Date')}</h4>}
      {!dateChangeDisabled ? <MonthSelector date={date} onDateChange={onDateChange} /> : null}
      <SVDaySelector
        onDateRangeSet={onDateRangeSet}
        dateRangeUpdated={dateRangeUpdated}
        date={date}
        firstDayWithSlots={firstDayWithSlots}
        appointments={serviceValetSlots}
        onDateChange={onDateChange}
        daysPerScreen={daysPerScreen}
        onLoadNext={onLoadNext}
        onLoadPrevious={onLoadPrevious}
        apiStartDate={apiStartDate}
        apiEndDate={apiEndDate}
      />
    </div>
  );
};
