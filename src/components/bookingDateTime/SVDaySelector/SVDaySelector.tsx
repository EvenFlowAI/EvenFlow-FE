import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { TArgCallback, TParsableDate } from '../../../types/types';
import { useMediaQuery, useTheme } from '@mui/material';
import { IServiceValetAppointment } from '../../../store/reducers/appointment/types';
import { SVDaySelectCard } from '../SVDaySelectCard/SVDaySelectCard';
import { DaySelectorWrapper } from '../../styled/DaySelectorWrapper';
import { DateSelectArrow } from '../../styled/DateSelectArrow';
import dayjs from 'dayjs';

type TProps = {
  date: TParsableDate;
  dateRangeUpdated: boolean;
  firstDayWithSlots?: null | TParsableDate;
  onDateRangeSet: TArgCallback<boolean>;
  onDateChange: TArgCallback<TParsableDate>;
  appointments: IServiceValetAppointment[];
  daysPerScreen: number;
  onLoadNext: () => void;
  onLoadPrevious: () => void;
  apiStartDate?: string | null;
  apiEndDate?: string | null;
  onVisibleRangeChange?: (startDate: string, endDate: string) => void;
};

export const SVDaySelector: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({
  date,
  onDateChange,
  appointments,
  firstDayWithSlots,
  daysPerScreen,
  onLoadNext,
  onLoadPrevious,
  apiStartDate,
  apiEndDate,
  onVisibleRangeChange,
}) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('xsm'));
  const [firstLoadAvailableSlots, setFirstLoadAvailableSlots] = useState<boolean>(true);
  // Flag to prevent rerendering visible days when selecting a date
  const ignoreSelection = useRef(false);

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

  // Get the first visible day
  const firstVisibleDay =
    visibleDays.length > 0
      ? dayjs.utc(visibleDays[0]).startOf('day')
      : dayjs.utc(date).startOf('day');

  // Notify parent component of visible date range changes
  useEffect(() => {
    if (onVisibleRangeChange && visibleDays.length > 0) {
      const startDate = visibleDays[0];
      const endDate = visibleDays[visibleDays.length - 1];
      onVisibleRangeChange(startDate, endDate);
    }
  }, [visibleDays, onVisibleRangeChange]);

  const handleNext = () => {
    setFirstLoadAvailableSlots(false);
    onLoadNext();
  };

  const handlePrev = () => {
    setFirstLoadAvailableSlots(false);
    onLoadPrevious();
  };

  const isFirstDayVisible =
    visibleDays.length > 0 && dayjs.utc(visibleDays[0]).isSame(dayjs.utc().startOf('day'));

  const isDisabledPreviousSlots =
    firstLoadAvailableSlots || isFirstDayVisible || !firstVisibleDay.isAfter(firstDayWithSlots);

  return (
    <DaySelectorWrapper>
      <DateSelectArrow
        onClick={isDisabledPreviousSlots ? () => {} : handlePrev}
        disabled={isDisabledPreviousSlots}
      >
        <ChevronLeft />
      </DateSelectArrow>
      {visibleDays.map(day => (
        <SVDaySelectCard
          key={day}
          isXs={isXs}
          isCurrent={dayjs.utc(date).isSame(dayjs.utc(day), 'date')}
          appointment={appointments.find(item => dayjs.utc(item.date).isSame(dayjs(day), 'date'))}
          onClick={handleDateSelect(day)}
          day={day}
        />
      ))}
      <DateSelectArrow onClick={handleNext}>
        <ChevronRight />
      </DateSelectArrow>
    </DaySelectorWrapper>
  );
};
