import React, { useEffect, useMemo, useRef, useState } from 'react';
import { IRemappedAppointmentSlot } from '../../../store/reducers/appointment/types';
import { TArgCallback, TParsableDate } from '../../../types/types';
import { useTranslation } from 'react-i18next';
import { ReactComponent as ClockIcon } from '../../../assets/img/clock-black.svg';
import { ReactComponent as ClockIconWhite } from '../../../assets/img/clock-white.svg';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { TSlot } from '../../../features/booking/AppointmentFlow/Screens/AppointmentSlots/types';
import { HtmlTooltip, Wrapper } from './styles';
import dayjs from 'dayjs';

type TProps = {
  timeSlot: TSlot;
  slot?: IRemappedAppointmentSlot;
  selected: boolean;
  onSelect: TArgCallback<IRemappedAppointmentSlot | null>;
  date: TParsableDate;
};

export const TimeSlotCard: React.FC<TProps> = ({ timeSlot, slot, onSelect, selected, date }) => {
  const { waitListSettings } = useSelector((state: RootState) => state.appointment);
  const [timePassed, setTimePassed] = useState<boolean>(false);
  const { t } = useTranslation();
  const title = t(
    'Expected completion time for your vehicle cannot be provided with Waitlist Only appointments'
  );
  const isOffPeak = Boolean(slot?.price.amountOfSavingMoney);
  const isWaitList = Boolean(slot?.isOverbookingApplied && waitListSettings?.isEnabled);
  const slotRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Determine if the slot is for today
  const isTodaySlot = useMemo(
    () =>
      slot?.date &&
      dayjs(slot?.date).isSame(dayjs.utc(), 'day') &&
      dayjs(date).isSame(dayjs.utc(), 'day'),
    [slot?.date, date]
  );

  // Check if the slot time has passed and set up timer for today's slots
  useEffect(() => {
    // Clear any existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (!isTodaySlot) {
      setTimePassed(false);
      return;
    }

    if (!slot?.date) {
      setTimePassed(true);
      return;
    }

    // Format the date as ISO string to ensure consistent timezone handling
    const slotDateTime = dayjs(dayjs(slot.date).format('YYYY-MM-DDTHH:mm:ss'));
    const currentTime = dayjs.utc();
    const differenceInMSeconds = slotDateTime.diff(currentTime);

    if (differenceInMSeconds <= 0) {
      // Slot time has already passed
      setTimePassed(true);
    } else {
      // Set a timeout to mark the slot as passed when the time comes
      setTimePassed(false);
      timeoutRef.current = setTimeout(() => setTimePassed(true), differenceInMSeconds);
    }

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isTodaySlot, slot?.date]);

  // Scroll selected slot into view if not visible
  useEffect(() => {
    const rect = slotRef.current?.getBoundingClientRect();
    const parentHeight = slotRef.current?.parentElement?.clientHeight;
    const parentWidth = slotRef.current?.parentElement?.clientWidth;
    const isVisible =
      Boolean(rect) &&
      parentHeight &&
      parentWidth &&
      rect?.top !== undefined &&
      rect?.left !== undefined &&
      rect?.bottom !== undefined &&
      rect?.top >= 0 &&
      rect?.left >= 0 &&
      rect?.bottom <= parentHeight &&
      rect?.right <= parentWidth;

    if (slotRef.current && selected && !isVisible) {
      slotRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selected]);

  const getContent = (timePassed: boolean): string => {
    if (slot?.isOverbookingApplied && waitListSettings?.isEnabled) {
      return waitListSettings?.text ?? t('Waitlist only');
    }
    if (!slot || timePassed) {
      return t('Not Available');
    }
    if (slot.price.amountOfSavingMoney) {
      return `${t('Save')} $${slot.price.amountOfSavingMoney}`;
    }
    return t('Available');
  };

  return isWaitList ? (
    <Wrapper
      id={slot?.id}
      available={Boolean(slot) && !timePassed}
      isWaitList={isWaitList && !timePassed}
      waitListBackground={waitListSettings?.boxHex}
      waitListTextColor={waitListSettings?.textHex}
      selected={selected}
      offPeak={isOffPeak && !timePassed}
      onClick={timePassed || !slot ? undefined : () => onSelect(slot)}
    >
      <div ref={slotRef}>{timeSlot.label}</div>
      <HtmlTooltip
        title={waitListSettings?.rolloverText ?? title}
        placement="right"
        id={slot?.time}
        enterDelay={0}
        enterNextDelay={0}
        enterTouchDelay={0}
      >
        <div className="availability">
          <ClockIcon />
          {getContent(timePassed)}
        </div>
      </HtmlTooltip>
    </Wrapper>
  ) : (
    <Wrapper
      id={slot?.id}
      available={Boolean(slot) && !timePassed}
      isWaitList={isWaitList && !timePassed}
      selected={selected}
      offPeak={isOffPeak && !timePassed}
      onClick={timePassed || !slot ? undefined : () => onSelect(slot)}
    >
      <div ref={slotRef}>{timeSlot.label}</div>
      <div className="availability">
        {selected ? <ClockIconWhite /> : <ClockIcon />}
        {getContent(timePassed)}
      </div>
    </Wrapper>
  );
};
