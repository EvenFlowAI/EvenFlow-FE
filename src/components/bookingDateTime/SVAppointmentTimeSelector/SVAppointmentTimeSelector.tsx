import React, { useCallback, useEffect, useMemo } from 'react';
import { IServiceValetAppointment } from '../../../store/reducers/appointment/types';
import { Loading } from '../../wrappers/Loading/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { selectServiceValetAppointment } from '../../../store/reducers/appointment/actions';
import ReactGA from 'react-ga4';
import { useTranslation } from 'react-i18next';
import { setSideBarSteps } from '../../../store/reducers/appointmentFrameReducer/actions';
import { PickUpSlotCard } from '../PickUpSlotCard/PickUpSlotCard';
import { PickUpSlotsWrapper } from './styles';
import { TParsableDate } from '../../../types/types';
import dayjs from 'dayjs';
import { useTimeSelectorStyles } from '../../../hooks/styling/useTmeSelectorStyles';
import { getClearSVDate } from '../../../utils/svAppointments';

type TProps = {
  date: TParsableDate;
  loading: boolean;
};

export const SVAppointmentTimeSelector: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TProps>>
> = ({ date, loading }) => {
  const {
    serviceValetAppointment: selectedAppointment,
    serviceValetSlots,
    isAppointmentSlotsLoading,
    serviceValetCapacity,
  } = useSelector((state: RootState) => state.appointment);
  const { selectedTiming, sideBarSteps, trackerData } = useSelector(
    (state: RootState) => state.appointmentFrame
  );
  const dispatch = useDispatch();
  const { classes } = useTimeSelectorStyles();
  const { t } = useTranslation();

  const [SVSlotsWithTimes, setSVSlotsWithTimes] = React.useState<IServiceValetAppointment[]>([]);

  useEffect(() => {
    if (serviceValetSlots && serviceValetCapacity) {
      const enriched = serviceValetSlots.map(slot => {
        const dayName = dayjs(slot.date).format('dddd');
        const capacityForDay = serviceValetCapacity[dayName];

        return {
          ...slot,
          pickUpMin: capacityForDay?.pickUpMin || '',
          pickUpMax: capacityForDay?.pickUpMax || '',
          dropOffMin: capacityForDay?.dropOffMin || '',
          dropOffMax: capacityForDay?.dropOffMax || '',
        };
      });

      setSVSlotsWithTimes(enriched);
    }
  }, [serviceValetSlots, serviceValetCapacity]);

  const currentSlots = useMemo(() => {
    const dateWithOffset = dayjs(date);
    return SVSlotsWithTimes.filter(slot => dayjs.utc(slot.date).isSame(dateWithOffset, 'date'));
  }, [SVSlotsWithTimes, date]);

  const handleGA = useCallback(
    (a: IServiceValetAppointment | null) => {
      ReactGA.event('asc_form_engagement', {
        element_text: 'Valet Date & Time Clicked',
        slot_price: a?.price?.value ? `$${a.price.value}` : undefined,
      });
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

  const handleSelect = useCallback(
    (a: IServiceValetAppointment | null) => {
      const data = a && selectedTiming ? { ...a, timingType: selectedTiming } : a;
      handleGA(a);

      const dayName = dayjs(data?.date).format('dddd');
      if (serviceValetCapacity && data) {
        const capacityForDay = serviceValetCapacity[dayName];
        const firstASlotWithData = {
          ...data,
          pickUpMin: capacityForDay.pickUpMin || '',
          pickUpMax: capacityForDay.pickUpMax || '',
          dropOffMin: capacityForDay.dropOffMin || '',
          dropOffMax: capacityForDay.dropOffMax || '',
        };

        dispatch(selectServiceValetAppointment(firstASlotWithData));
        handleSideBar();
      }
    },
    [selectedTiming]
  );

  return (
    <div className={classes.wrapper}>
      <div className={classes.titleWrapper}>
        <h4 className={classes.title}>{t('Select Time')}</h4>
        <div>
          {getClearSVDate(date).format('ddd')},{' '}
          <span className={classes.boldText}>{getClearSVDate(date).format('MMM DD')}</span>
        </div>
      </div>
      {!loading && !isAppointmentSlotsLoading ? (
        <PickUpSlotsWrapper>
          {currentSlots?.length ? (
            currentSlots.map(timeSlot => {
              return (
                <PickUpSlotCard
                  date={date}
                  onSelect={handleSelect}
                  selected={Boolean(
                    selectedAppointment &&
                    dayjs(timeSlot?.date).isSame(selectedAppointment.date, 'minute')
                  )}
                  timeSlot={timeSlot}
                  key={dayjs.utc(timeSlot.date).toISOString()}
                />
              );
            })
          ) : (
            <PickUpSlotCard
              date={date}
              onSelect={handleSelect}
              selected={false}
              timeSlot={null}
              key={dayjs().toISOString()}
            />
          )}
        </PickUpSlotsWrapper>
      ) : (
        <Loading />
      )}
    </div>
  );
};
