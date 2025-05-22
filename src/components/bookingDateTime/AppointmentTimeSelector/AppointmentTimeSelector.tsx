import React, { useCallback, useEffect, useMemo } from 'react';
import { IRemappedAppointmentSlot } from '../../../store/reducers/appointment/types';
import { TimeSlotCard } from '../TimeSlotCard/TimeSlotCard';
import { Loading } from '../../wrappers/Loading/Loading';
import { TGroupedAppointment } from '../../../utils/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { selectAppointment } from '../../../store/reducers/appointment/actions';
import ReactGA from 'react-ga4';
import { useTranslation } from 'react-i18next';
import {
  loadHoursOfOperations,
  setSideBarSteps,
} from '../../../store/reducers/appointmentFrameReducer/actions';
import { TSlot } from '../../../features/booking/AppointmentFlow/Screens/AppointmentSlots/types';
import { TimeSlotsWrapper } from './styles';
import { TParsableDate } from '../../../types/types';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useTimeSelectorStyles } from '../../../hooks/styling/useTmeSelectorStyles';
import { IFirstScreenOption } from '../../../store/reducers/serviceTypes/types';

dayjs.extend(utc);
dayjs.extend(timezone);

type TProps = {
  date: TParsableDate;
  loading: boolean;
  appointments?: TGroupedAppointment;
  selectFirstSlot?: (date?: TParsableDate, newSeviceOption?: IFirstScreenOption) => void;
};

export const AppointmentTimeSelector: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TProps>>
> = ({ date, loading, appointments, selectFirstSlot }) => {
  const {
    appointment: selectedAppointment,
    scProfile,
    customerLoadedData,
  } = useSelector((state: RootState) => state.appointment);
  const { selectedTiming, gap, hoursOfOperations, sideBarSteps, appointmentByKey, trackerData } =
    useSelector((state: RootState) => state.appointmentFrame);
  const dispatch = useDispatch();
  const { classes } = useTimeSelectorStyles();
  const { t } = useTranslation();

  useEffect(() => {
    if (scProfile) {
      dispatch(loadHoursOfOperations(scProfile.id));
    }
  }, [scProfile]);

  const handleSelect = useCallback(
    (a: IRemappedAppointmentSlot | null) => {
      const data = a && selectedTiming ? { ...a, timingType: selectedTiming } : a;
      handleGA(a);
      dispatch(selectAppointment(data));
      if (!customerLoadedData?.isUpdating && !appointmentByKey) {
        handleSideBar();
      }
    },
    [selectedTiming]
  );

  const generateSlots = (
    startHours: number | string,
    startMinutes: number | string,
    endHours: number | string,
    endMinutes: number | string
  ): TSlot[] => {
    const slots: TSlot[] = [];

    // Create start and end times in local timezone
    let start = dayjs.utc(date).hour(+startHours).minute(+startMinutes).second(0).millisecond(0);
    const end = dayjs.utc(date).hour(+endHours).minute(+endMinutes).second(0).millisecond(0);

    let cDate = start;

    while (dayjs(cDate).isSameOrBefore(end, 'minute')) {
      // Store the UTC date for backend communication
      const utcDate = cDate.utc();

      // Format the label in local timezone
      const label = cDate.format('h:mm a');

      slots.push({
        date: utcDate,
        label,
      });

      cDate = cDate.add(gap ?? 0, 'minute');
    }
    return slots;
  };

  const slots: TSlot[] = useMemo(() => {
    let slots: TSlot[] = [];
    const currentSCSchedule = hoursOfOperations.find(item => {
      // Use browser's timezone for day of week calculation
      const localDate = dayjs(date).tz(dayjs.tz.guess());
      return item.dayOfWeek === localDate.day();
    });

    if (gap) {
      if (currentSCSchedule) {
        const [startHours, startMinutes] = currentSCSchedule.from.split(':');
        const [endHours, endMinutes] = currentSCSchedule.to.split(':');
        slots = generateSlots(startHours, startMinutes, endHours, endMinutes);
      } else if (hoursOfOperations.length) {
        const [startHours, startMinutes] = hoursOfOperations[0].from.split(':');
        const [endHours, endMinutes] = hoursOfOperations[0].to.split(':');
        slots = generateSlots(startHours, startMinutes, endHours, endMinutes);
      } else {
        slots = generateSlots(8, 0, 17, 0);
      }
    }
    return slots;
  }, [date, appointments, gap, hoursOfOperations]);

  const handleGA = useCallback(
    (a: IRemappedAppointmentSlot | null) => {
      ReactGA.event(
        {
          category: 'EvenFlow User',
          action: 'Clicked on Appointment Slot',
          label: a?.price?.value ? `With Price $${a.price.value}` : '',
        },
        trackerData.ids
      );
    },
    [trackerData]
  );

  const handleSideBar = () => {
    const index = sideBarSteps.indexOf('appointmentSelection');
    if (index > -1) {
      const slicedSteps = sideBarSteps.slice(0, index + 1);
      dispatch(setSideBarSteps(slicedSteps));
    }
  };

  const localDate = dayjs(date);

  return (
    <div className={classes.wrapper}>
      <div className={classes.titleWrapper}>
        <h4 className={classes.title}>{t('Select Time')}</h4>
        <div>
          {localDate.format('ddd')},{' '}
          <span className={classes.boldText}>{localDate.format('MMM DD')}</span>
        </div>
      </div>
      {!loading ? (
        <TimeSlotsWrapper>
          {slots.map(timeSlot => {
            const appointment = appointments?.appointments.find(a =>
              dayjs.utc(a.date).isSame(dayjs.utc(timeSlot.date), 'minute')
            );

            return (
              <TimeSlotCard
                date={date}
                slot={appointment}
                onSelect={handleSelect}
                selected={Boolean(
                  selectedAppointment && appointment?.id === selectedAppointment.id
                )}
                timeSlot={timeSlot}
                key={timeSlot.label}
              />
            );
          })}
        </TimeSlotsWrapper>
      ) : (
        <Loading />
      )}
    </div>
  );
};
