import React, { useEffect, useRef } from 'react';
import { TArgCallback } from '../../../types/types';
import { useMediaQuery, useTheme } from '@mui/material';
import { DaySelector } from '../DaySelector/DaySelector';
import { TGroupedAppointments } from '../../../utils/types';
import { useTranslation } from 'react-i18next';
import { MonthSelector } from '../MonthSelector/MonthSelector';
import { TMonthProps } from '../../../features/booking/AppointmentFlow/Screens/AppointmentSlots/types';

type TProps = {
  onDateRangeSet: TArgCallback<boolean>;
  appointments: TGroupedAppointments;
  dateRangeUpdated: boolean;
  dateChangeDisabled: boolean;
  daysPerScreen: number;
  onLoadNext: () => void;
  onLoadPrevious: () => void;
} & TMonthProps;

export const AppointmentDateSelector: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TProps>>
> = ({
  date,
  loading,
  onDateChange,
  appointments,
  dateChangeDisabled,
  dateRangeUpdated,
  onDateRangeSet,
  daysPerScreen,
  onLoadNext,
  onLoadPrevious,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('mdl'));
  const { t } = useTranslation();
  const monthSelectorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (monthSelectorRef.current) {
      monthSelectorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [date]);

  return (
    <div style={isMobile ? { padding: '16px 8px' } : {}}>
      {!isMobile && <h4>{t('Select Date')}</h4>}
      {!dateChangeDisabled ? (
        <div ref={monthSelectorRef}>
          <MonthSelector date={date} loading={loading} onDateChange={onDateChange} />
        </div>
      ) : null}
      <DaySelector
        dateRangeUpdated={dateRangeUpdated}
        onDateRangeSet={onDateRangeSet}
        date={date}
        appointments={appointments}
        loading={loading}
        onDateChange={onDateChange}
        daysPerScreen={daysPerScreen}
        onLoadNext={onLoadNext}
        onLoadPrevious={onLoadPrevious}
      />
    </div>
  );
};
