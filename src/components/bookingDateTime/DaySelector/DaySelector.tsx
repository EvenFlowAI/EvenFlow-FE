import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { DaySelectCard } from '../DaySelectCard/DaySelectCard';
import { TArgCallback, TParsableDate } from '../../../types/types';
import { useMediaQuery, useTheme } from '@mui/material';
import { TGroupedAppointments } from '../../../utils/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { EAppointmentTimingType } from '../../../store/reducers/appointment/types';
import PromptNewSearchModal from '../../../features/booking/AppointmentFlow/Screens/AppointmentSlots/PromptNewSearchModal/PromptNewSearchModal';
import {
  setCurrentFrameScreen,
  setTiming,
} from '../../../store/reducers/appointmentFrameReducer/actions';
import {
  selectAppointment,
  selectServiceValetAppointment,
} from '../../../store/reducers/appointment/actions';
import { WHILE_LIMIT } from '../../../features/booking/AppointmentFlow/Screens/AppointmentSlots/constants';
import { DaySelectorWrapper } from '../../styled/DaySelectorWrapper';
import { DateSelectArrow } from '../../styled/DateSelectArrow';
import { getAppointmentDate } from '../../../features/booking/AppointmentFlow/Screens/AppointmentSlots/utils';
import { useModal } from '../../../hooks/useModal/useModal';
import dayjs from 'dayjs';
import { useHistory } from 'react-router-dom';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

interface DaySelectorProps {
  date: TParsableDate;
  onDateChange: TArgCallback<TParsableDate>;
  loading: boolean;
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
  loading,
  appointments,
  daysPerScreen,
  onLoadNext,
  onLoadPrevious,
  onVisibleRangeChange,
  apiStartDate,
  apiEndDate,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const { onOpen, isOpen, onClose } = useModal();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isAdminPanel = history.location.pathname.includes('admin');
  const isInitialLoad = useRef(true);

  const { selectedTiming } = useSelector((state: RootState) => state.appointmentFrame);
  const { appointment } = useSelector((state: RootState) => state.appointment);

  // State for managing the visible slice of days
  const [sliceIdx, setSliceIdx] = useState<number>(0);

  // Memoized days array and month length
  const { days, daysInMonth, nextMonthDays } = useMemo(() => {
    const currentMonth = dayjs.utc(date);
    const monthLength = currentMonth.daysInMonth();

    // Generate days for current month
    const currentMonthDays = Array(monthLength)
      .fill(0)
      .map((_, idx) => getAppointmentDate(date, idx + 1));

    // Generate days for next month
    const nextMonth = currentMonth.add(1, 'month');
    const nextMonthLength = Math.min(daysPerScreen, nextMonth.daysInMonth());
    const nextMonthDays = Array(nextMonthLength)
      .fill(0)
      .map((_, idx) => {
        const nextMonthDate = nextMonth.date(idx + 1);
        return dayjs.utc(nextMonthDate).startOf('day').toISOString().replace('.000Z', 'Z');
      });

    return {
      days: currentMonthDays,
      daysInMonth: monthLength,
      nextMonthDays,
    };
  }, [date, daysPerScreen]);

  // Find the index of the selected date
  const selectedDateIndex = useMemo(() => {
    const selectedDate = appointment?.date || date;
    const formattedDate = dayjs
      .utc(selectedDate)
      .startOf('day')
      .toISOString()
      .replace('.000Z', 'Z');
    return days.findIndex(el => el === formattedDate);
  }, [days, date, appointment]);

  // Update slice index when selected date changes or when API dates change
  useEffect(() => {
    if (isInitialLoad.current || (apiStartDate && apiEndDate)) {
      if (apiStartDate && apiEndDate) {
        // Find the index of the API start date in the days array
        const startDateIndex = days.findIndex(
          day =>
            dayjs.utc(day).startOf('day').toISOString() ===
            dayjs.utc(apiStartDate).startOf('day').toISOString()
        );

        if (startDateIndex !== -1) {
          setSliceIdx(startDateIndex);
        } else {
          // If the API start date is not in the current month's days array,
          // it means we've crossed a month boundary
          const apiStartDateObj = dayjs.utc(apiStartDate);
          const currentMonthObj = dayjs.utc(date);

          // Check if API date is in a different month
          if (apiStartDateObj.month() !== currentMonthObj.month()) {
            // If API date is in a previous month, start from the beginning
            if (apiStartDateObj.isBefore(currentMonthObj)) {
              setSliceIdx(0);
            } else {
              // If API date is in a next month, show the end of current month
              setSliceIdx(Math.max(0, daysInMonth - daysPerScreen));
            }
          } else if (selectedDateIndex === -1 || daysInMonth <= daysPerScreen) {
            setSliceIdx(0);
          } else {
            // to get center of the displayed dates
            const idXOfCenterElement = selectedDateIndex - Math.floor(daysPerScreen / 2);
            if (idXOfCenterElement + daysPerScreen > daysInMonth) {
              // Handle right date edge
              if (selectedDateIndex === days.length - 1) {
                setSliceIdx(daysInMonth - daysPerScreen + 1);
              } else {
                setSliceIdx(daysInMonth - daysPerScreen);
              }
            } else {
              // Handle left date edge
              setSliceIdx(idXOfCenterElement >= 0 ? idXOfCenterElement : 0);
            }
          }
        }
      } else if (selectedDateIndex === -1 || daysInMonth <= daysPerScreen) {
        setSliceIdx(0);
      } else {
        // to get center of the displayed dates
        const idXOfCenterElement = selectedDateIndex - Math.floor(daysPerScreen / 2);
        if (idXOfCenterElement + daysPerScreen > daysInMonth) {
          // Handle right date edge
          if (selectedDateIndex === days.length - 1) {
            setSliceIdx(daysInMonth - daysPerScreen + 1);
          } else {
            setSliceIdx(daysInMonth - daysPerScreen);
          }
        } else {
          // Handle left date edge
          setSliceIdx(idXOfCenterElement >= 0 ? idXOfCenterElement : 0);
        }
      }
      isInitialLoad.current = false;
    }
  }, [selectedDateIndex, daysInMonth, daysPerScreen, apiStartDate, apiEndDate, days, date]);

  // Get visible days for rendering, including next month days if needed
  const visibleDays = useMemo(() => {
    // If we have API dates and they're in a different month than the current date,
    // we need to adjust our visible days calculation
    if (apiStartDate && apiEndDate) {
      const apiStartDateObj = dayjs.utc(apiStartDate);
      const currentMonthObj = dayjs.utc(date);

      // If API date is in a different month than the current date
      if (apiStartDateObj.month() !== currentMonthObj.month()) {
        // If API date is in a previous month, we need to show days from the previous month
        if (apiStartDateObj.isBefore(currentMonthObj)) {
          // We don't have previous month days in our array, so we'll just show
          // the first days of the current month
          return days.slice(0, daysPerScreen);
        } else {
          // If API date is in a next month, we need to show days from the next month
          // We already have nextMonthDays, so we'll use those
          return nextMonthDays.slice(0, daysPerScreen);
        }
      }
    }

    // Default behavior for same month
    const currentMonthVisibleDays = days.slice(sliceIdx, sliceIdx + daysPerScreen);

    // If we're near the end of the month, add days from the next month
    if (sliceIdx + daysPerScreen > daysInMonth) {
      const remainingDays = daysPerScreen - currentMonthVisibleDays.length;
      const nextMonthDaysToAdd = nextMonthDays.slice(0, remainingDays);
      return [...currentMonthVisibleDays, ...nextMonthDaysToAdd];
    }

    return currentMonthVisibleDays;
  }, [days, sliceIdx, daysPerScreen, daysInMonth, nextMonthDays, apiStartDate, apiEndDate, date]);

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
    // Move forward by daysPerScreen
    const nextSliceIdx = Math.min(sliceIdx + daysPerScreen, daysInMonth - daysPerScreen);
    setSliceIdx(nextSliceIdx);
    onLoadNext();
  }, [sliceIdx, daysPerScreen, daysInMonth, onLoadNext]);

  const handlePrev = useCallback(() => {
    const todayStart = dayjs.utc().startOf('day');
    const currentStartDate = dayjs.utc(date).startOf('day');
    const canGoBack = currentStartDate.isAfter(todayStart);

    if (canGoBack) {
      // Move backward by daysPerScreen
      const prevSliceIdx = Math.max(0, sliceIdx - daysPerScreen);
      setSliceIdx(prevSliceIdx);
      onLoadPrevious();
    } else if (selectedTiming === EAppointmentTimingType.PreferredDate && !isAdminPanel) {
      onOpen();
    }
  }, [date, sliceIdx, daysPerScreen, selectedTiming, isAdminPanel, onLoadPrevious, onOpen]);

  // Date selection handler
  const handleDateSelect = useCallback(
    (selectedDate: string) => () => {
      onDateChange(dayjs.utc(selectedDate));
    },
    [onDateChange]
  );

  // Reset appointment selection handler
  const handleResetAppointment = useCallback(() => {
    dispatch(setTiming(EAppointmentTimingType.PreferredDate));
    dispatch(setCurrentFrameScreen('appointmentTiming'));
    dispatch(selectAppointment(null));
    dispatch(selectServiceValetAppointment(null));
  }, [dispatch]);

  // Check if we can navigate forward
  const canNavigateForward = sliceIdx + daysPerScreen < daysInMonth || nextMonthDays.length > 0;

  return (
    <DaySelectorWrapper>
      <DateSelectArrow
        onClick={handlePrev}
        disabled={!dayjs.utc(date).startOf('day').isAfter(dayjs.utc().startOf('day'))}
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

      <DateSelectArrow onClick={handleNext} disabled={!canNavigateForward}>
        <ChevronRight />
      </DateSelectArrow>

      <PromptNewSearchModal onClose={onClose} open={isOpen} onSave={handleResetAppointment} />
    </DaySelectorWrapper>
  );
};
