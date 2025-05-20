import React, { useEffect, useMemo, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { DaySelectCard } from '../DaySelectCard/DaySelectCard';
import { TArgCallback, TParsableDate } from '../../../types/types';
import { useMediaQuery, useTheme } from '@mui/material';
import { TGroupedAppointments } from '../../../utils/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { DaySelectorWrapper } from '../../styled/DaySelectorWrapper';
import { DateSelectArrow } from '../../styled/DateSelectArrow';
import dayjs from 'dayjs';
import { useHistory } from 'react-router-dom';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

interface DaySelectorProps {
  date: TParsableDate;
  onDateChange: TArgCallback<TParsableDate>;
  appointments: TGroupedAppointments;
  daysPerScreen: number;
  onLoadNext: () => void;
  onLoadPrevious: () => void;
  onVisibleRangeChange?: (startDate: string, endDate: string) => void;
  apiStartDate?: string | null;
  apiEndDate?: string | null;
}

export const DaySelector: React.FC<DaySelectorProps> = ({
  date,
  onDateChange,
  appointments,
  daysPerScreen,
  onLoadNext,
  onLoadPrevious,
  onVisibleRangeChange,
  apiStartDate,
  apiEndDate,
}) => {
  const theme = useTheme();
  const history = useHistory();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isAdminPanel = history.location.pathname.includes('admin');

  const { selectedTiming } = useSelector((state: RootState) => state.appointmentFrame);

  // Flag to prevent rerendering visible days when selecting a date
  const ignoreSelection = useRef(false);

  // Simple function to generate range of dates
  const generateDateRange = useCallback((startDate: string, endDate: string): string[] => {
    const start = dayjs.utc(startDate).startOf('day');
    const end = dayjs.utc(endDate).startOf('day');
    const daysCount = end.diff(start, 'day') + 1; // Include both start and end

    return Array(daysCount)
      .fill(0)
      .map((_, index) => {
        return start.add(index, 'day').toISOString().replace('.000Z', 'Z');
      });
  }, []);

  // Calculate visible days directly from API start and end dates
  const visibleDays = useMemo(() => {
    if (apiStartDate && apiEndDate) {
      return generateDateRange(apiStartDate, apiEndDate);
    }

    // Fallback for when API dates aren't available
    const today = dayjs.utc().startOf('day');
    const endDate = today.add(daysPerScreen - 1, 'day');
    return generateDateRange(today.toISOString(), endDate.toISOString());
  }, [apiStartDate, apiEndDate, daysPerScreen, generateDateRange]);

  // Notify parent component of visible date range changes
  useEffect(() => {
    if (onVisibleRangeChange && visibleDays.length > 0) {
      const startDate = visibleDays[0];
      const endDate = visibleDays[visibleDays.length - 1];
      onVisibleRangeChange(startDate, endDate);
    }
  }, [visibleDays, onVisibleRangeChange]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    onLoadNext();
  }, [onLoadNext]);

  const handlePrev = useCallback(() => {
    const todayStart = dayjs.utc().startOf('day');

    // Get the first visible day
    const firstVisibleDay =
      visibleDays.length > 0
        ? dayjs.utc(visibleDays[0]).startOf('day')
        : dayjs.utc(date).startOf('day');

    // Check if we can go back
    const canGoBack = firstVisibleDay.isAfter(todayStart);

    if (canGoBack) {
      onLoadPrevious();
    }
  }, [date, selectedTiming, isAdminPanel, onLoadPrevious, visibleDays]);

  // Override the onDateChange to prevent re-rendering when selecting a visible date
  const handleDateChange = useCallback(
    (selectedDate: TParsableDate) => {
      // Set the flag before calling onDateChange
      ignoreSelection.current = true;

      // Just pass the date change up to the parent
      onDateChange(selectedDate);
    },
    [onDateChange]
  );

  // Date selection handler
  const handleDateSelect = useCallback(
    (selectedDate: string) => () => {
      handleDateChange(dayjs.utc(selectedDate));
    },
    [handleDateChange]
  );

  return (
    <DaySelectorWrapper>
      <DateSelectArrow
        onClick={handlePrev}
        disabled={
          visibleDays.length > 0 && dayjs.utc(visibleDays[0]).isSame(dayjs.utc().startOf('day'))
        }
      >
        <ChevronLeft />
      </DateSelectArrow>

      {visibleDays.map(day => (
        <DaySelectCard
          key={day}
          isXs={isSm}
          isCurrent={dayjs.utc(date).isSame(dayjs.utc(day), 'date')}
          appointment={appointments[day]}
          onClick={handleDateSelect(day)}
          day={day}
          data-date={day}
        />
      ))}

      <DateSelectArrow onClick={handleNext} disabled={false}>
        <ChevronRight />
      </DateSelectArrow>
    </DaySelectorWrapper>
  );
};
