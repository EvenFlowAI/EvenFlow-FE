import React, { useEffect, useMemo, useState, useCallback } from 'react';
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
}

export const DaySelector: React.FC<DaySelectorProps> = ({
  date,
  onDateChange,
  loading,
  appointments,
  daysPerScreen,
  onLoadNext,
  onLoadPrevious,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const history = useHistory();
  const { onOpen, isOpen, onClose } = useModal();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isAdminPanel = history.location.pathname.includes('admin');

  const { selectedTiming } = useSelector((state: RootState) => state.appointmentFrame);
  const { appointment } = useSelector((state: RootState) => state.appointment);

  // State for managing the visible slice of days
  const [sliceIdx, setSliceIdx] = useState<number>(0);

  // Memoized days array and month length
  const { days, daysInMonth } = useMemo(() => {
    const monthLength = dayjs.utc(date).daysInMonth();
    const generatedDays = Array(monthLength)
      .fill(0)
      .map((_, idx) => getAppointmentDate(date, idx + 1));
    return { days: generatedDays, daysInMonth: monthLength };
  }, [date]);

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

  // Update slice index when selected date changes
  useEffect(() => {
    if (selectedDateIndex === -1 || daysInMonth <= daysPerScreen) {
      setSliceIdx(0);
      return;
    }

    // Always position the selected date at the beginning of the visible range
    setSliceIdx(selectedDateIndex);
  }, [selectedDateIndex, daysInMonth, daysPerScreen]);

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

  // Get visible days for rendering
  const visibleDays = useMemo(
    () => days.slice(sliceIdx, sliceIdx + daysPerScreen),
    [days, sliceIdx, daysPerScreen]
  );

  // Check if we can navigate forward
  const canNavigateForward = sliceIdx + daysPerScreen < daysInMonth;

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
