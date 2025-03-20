import React, { useEffect, useMemo, useState } from 'react';
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

type TProps = {
  date: TParsableDate;
  dateRangeUpdated: boolean;
  onDateRangeSet: TArgCallback<boolean>;
  onDateChange: TArgCallback<TParsableDate>;
  loading: boolean;
  appointments: TGroupedAppointments;
};

export const DaySelector: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({
  date,
  onDateChange,
  loading,
  appointments,
  dateRangeUpdated,
  onDateRangeSet,
}) => {
  const { isAppointmentTimingAvailable } = useSelector(
    (state: RootState) => state.bookingFlowConfig
  );
  const { selectedTiming } = useSelector((state: RootState) => state.appointmentFrame);
  const { searchedDateRange, appointment } = useSelector((state: RootState) => state.appointment);
  const [sliceIdx, setSliceIdx] = useState<number>(0);
  const theme = useTheme();
  const dispatch = useDispatch();
  const { onOpen, isOpen, onClose } = useModal();
  const isMd = useMediaQuery(theme.breakpoints.down('md'));
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isXs = useMediaQuery(theme.breakpoints.down('xsm'));
  const isMds = useMediaQuery(theme.breakpoints.down('mds'));
  const history = useHistory();
  const isAdminPanel = history.location.pathname.includes('admin');
  const daysPerScreen: number = useMemo(() => {
    return isXs ? 3 : isMd ? 4 : isMds ? 5 : 6;
  }, [isMd, isMds]);

  const [daysInMonth, days]: [number, string[]] = useMemo(() => {
    let daysInMonth: number = dayjs.utc(date).daysInMonth();
    let generatedDays: string[] = [];
    if (searchedDateRange) {
      daysInMonth = Math.abs(
        dayjs
          .utc(searchedDateRange.from)
          .diff(dayjs.utc(dayjs(searchedDateRange.to).add(1, 'day')), 'days')
      );
      let currentDate = dayjs.utc(searchedDateRange.from);
      let endDate = dayjs.utc(searchedDateRange.to).endOf('day');
      let i = 0;
      const maxAvailableDaysAmount = daysInMonth < WHILE_LIMIT ? WHILE_LIMIT : daysInMonth;
      while (dayjs(currentDate).isSameOrBefore(endDate, 'date') && i < maxAvailableDaysAmount) {
        generatedDays.push(currentDate.startOf('day').toISOString().replace('.000', ''));
        currentDate = dayjs.utc(currentDate).add(1, 'day');
        i++;
      }
    } else {
      generatedDays = Array(daysInMonth)
        .fill(0)
        .map((e, idx) => getAppointmentDate(date, idx + 1));
    }
    return [daysInMonth, generatedDays];
  }, [date, searchedDateRange]);

  useEffect(() => {
    const selectedDate = appointment?.date ? appointment.date : date;
    const formattedDate = dayjs
      .utc(selectedDate)
      .startOf('day')
      .toISOString()
      .replace('.000Z', 'Z');
    const dateIdx = days.findIndex(el => el === formattedDate);
    if (dateIdx === -1 || daysInMonth <= daysPerScreen) {
      setSliceIdx(0);
    } else {
      const maxSliceIndex = daysInMonth - daysPerScreen;

      if (dateIdx < sliceIdx || dateIdx >= sliceIdx + daysPerScreen) {
        let newSliceIdx = dateIdx - 2;

        newSliceIdx = Math.max(0, Math.min(newSliceIdx, maxSliceIndex));
        setSliceIdx(newSliceIdx);
      }
    }
  }, [date, days, daysPerScreen, daysInMonth, dateRangeUpdated, onDateRangeSet, appointment]);

  const handleChangeDay = (date: string) => () => {
    onDateChange(dayjs.utc(date));
  };

  const nextAvailable = (): boolean => {
    return sliceIdx < daysInMonth - daysPerScreen;
  };
  const prevAvailable = (): boolean => {
    return sliceIdx > 0;
  };

  const handleNext = () => {
    if (nextAvailable()) {
      setSliceIdx(prevIndex => {
        const nS = prevIndex + daysPerScreen * 2;
        return nS <= daysInMonth ? prevIndex + daysPerScreen : daysInMonth - daysPerScreen;
      });
    } else {
      if (isAppointmentTimingAvailable && !isAdminPanel) onOpen();
    }
  };
  const handlePrev = () => {
    if (prevAvailable()) {
      setSliceIdx(s => {
        const pS = s - daysPerScreen;
        return pS >= 0 ? pS : 0;
      });
    } else {
      if (selectedTiming === EAppointmentTimingType.PreferredDate && !isAdminPanel) {
        onOpen();
      }
    }
  };

  const handleYes = () => {
    dispatch(setTiming(EAppointmentTimingType.PreferredDate));
    dispatch(setCurrentFrameScreen('appointmentTiming'));
    dispatch(selectAppointment(null));
    dispatch(selectServiceValetAppointment(null));
  };


  return (
    <DaySelectorWrapper>
      <DateSelectArrow onClick={handlePrev} disabled={!prevAvailable()}>
        <ChevronLeft />
      </DateSelectArrow>
      {days.slice(sliceIdx, sliceIdx + daysPerScreen).map(day => (
        <DaySelectCard
          key={day}
          isXs={isSm}
          isCurrent={dayjs.utc(date).isSame(dayjs.utc(day), 'date')}
          appointment={appointments[day]}
          onClick={handleChangeDay(day)}
          day={day}
          data-date={day}
        />
      ))}
      <DateSelectArrow onClick={handleNext} disabled={!nextAvailable()}>
        <ChevronRight />
      </DateSelectArrow>
      <PromptNewSearchModal onClose={onClose} open={isOpen} onSave={handleYes} />
    </DaySelectorWrapper>
  );
};
