import React, { useEffect, useRef } from 'react';
import { TArgCallback } from '../../../types/types';
import { useMediaQuery, useTheme } from '@mui/material';
import { DaySelector } from '../DaySelector/DaySelector';
import { TGroupedAppointments } from '../../../utils/types';
import { useTranslation } from 'react-i18next';
import { MonthSelector } from '../MonthSelector/MonthSelector';
import { TMonthProps } from '../../../features/booking/AppointmentFlow/Screens/AppointmentSlots/types';

type TProps = {
  appointments: TGroupedAppointments;
  dateChangeDisabled: boolean;
  daysPerScreen: number;
  onLoadNext: () => void;
  onLoadPrevious: () => void;
  apiStartDate?: string | null;
  apiEndDate?: string | null;
} & TMonthProps;

export const AppointmentDateSelector: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TProps>>
> = ({
  date,
  loading,
  onDateChange,
  appointments,
  dateChangeDisabled,
  daysPerScreen,
  onLoadNext,
  onLoadPrevious,
  apiStartDate,
  apiEndDate,
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
        date={date}
        appointments={appointments}
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
