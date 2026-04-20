import React, { useEffect, useState } from 'react';
import { IServiceValetAppointment } from '../../../store/reducers/appointment/types';
import { TArgCallback, TParsableDate } from '../../../types/types';
import { useTranslation } from 'react-i18next';
import {
  CheckCircleOutlined,
  HighlightOff,
  RadioButtonChecked,
  RadioButtonUnchecked,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { mockSlotTime } from '../../../features/booking/AppointmentFlow/Screens/AppointmentSlots/constants';
import { PickUpWrapper, useStyles } from './styles';
import dayjs from 'dayjs';

type TProps = {
  timeSlot: IServiceValetAppointment | null;
  selected: boolean;
  onSelect: TArgCallback<IServiceValetAppointment | null>;
  date: TParsableDate;
};

export const PickUpSlotCard: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({
  timeSlot,
  onSelect,
  selected,
  date,
}) => {
  const [timePassed, setTimePassed] = useState<boolean>(false);
  const { dropOffSettings } = useSelector((state: RootState) => state.appointment);
  const { classes } = useStyles();
  const { t } = useTranslation();

  useEffect(() => {
    if (timeSlot?.date) {
      if (timeSlot?.date) {
        const timeSlotDate = timeSlot.date.toString().split('T')[0];
        const [h, m, s] = timeSlot?.pickUpMin?.split(':') ?? [];
        const timeSlotTime = dayjs
          .utc(timeSlotDate)
          .set('hour', +h)
          .set('minute', +m)
          .set('second', +s);
        if (
          dayjs.utc(timeSlotDate).isSame(dayjs.utc(), 'day') &&
          dayjs.utc(date).isSame(dayjs.utc(), 'day')
        ) {
          const differenceInMSeconds = dayjs(
            dayjs.utc(timeSlotTime).format('YYYY-MM-DDTHH:mm:ss')
          ).diff(dayjs());
          if (differenceInMSeconds > 0) {
            setTimeout(() => setTimePassed(true), differenceInMSeconds);
          } else {
            setTimePassed(true);
          }
        } else {
          setTimePassed(false);
        }
      }
    }
  }, [timeSlot, date]);

  return (
    <PickUpWrapper
      key={timeSlot ? dayjs(timeSlot.date).toISOString() : dayjs().toISOString()}
      available={Boolean(timeSlot) && !timePassed}
      selected={selected}
      onClick={() => (timePassed ? {} : onSelect(timeSlot ?? null))}
    >
      <div className="pickUp">
        <div className={classes.radio}>
          {!selected ? <RadioButtonUnchecked /> : <RadioButtonChecked />}
        </div>
        <div className={classes.text}>
          <div>{t('Pick Up Time')}:</div>
          <div>
            {timeSlot
              ? dayjs.utc(timeSlot.pickUpMin, 'HH:mm').format('hh:mm A')
              : dayjs.utc(mockSlotTime.pickUpMin, 'HH:mm').format('hh:mm A')}
            <span> {t('to')} </span>
            {timeSlot
              ? dayjs.utc(timeSlot?.pickUpMax, 'HH:mm').format('hh:mm A')
              : dayjs.utc(mockSlotTime.pickUpMax, 'HH:mm').format('hh:mm A')}
          </div>
        </div>
      </div>
      <div className={classes.rightPart}>
        <div className={classes.availability}>
          {timeSlot && timeSlot.availableQuantity > 0 ? (
            <div className={classes.availabilityItem} style={{ color: '#008331' }}>
              <div className={classes.textWithIcon}>
                {t('Available')} <CheckCircleOutlined style={{ marginLeft: 8 }} />{' '}
              </div>
              <div>
                {timeSlot?.availableQuantity} {t('left')}
              </div>
            </div>
          ) : (
            <div className={classes.availabilityItem}>
              <div className={classes.textWithIcon} style={{ color: '#202021' }}>
                {t('Not Available')} <HighlightOff style={{ marginLeft: 8 }} />{' '}
              </div>
              <div className={classes.textWithIcon} style={{ color: '#DADADA' }}>
                0 {t('left')}
              </div>
            </div>
          )}
        </div>
        {dropOffSettings?.showDropOffTime && timeSlot?.dropOffMin && timeSlot?.dropOffMax ? (
          <div className={classes.dropOff}>
            <div>{t('Drop Off Time')}:</div>
            <div className={classes.rightText}>
              {timeSlot
                ? dayjs.utc(timeSlot?.dropOffMin, 'HH:mm').format('hh:mm A')
                : dayjs.utc(mockSlotTime.dropOffMin, 'HH:mm').format('hh:mm A')}
              <span> {t('to')} </span>
              {timeSlot
                ? dayjs.utc(timeSlot?.dropOffMax, 'HH:mm').format('hh:mm A')
                : dayjs.utc(mockSlotTime.dropOffMax, 'HH:mm').format('hh:mm A')}
            </div>
          </div>
        ) : (
          <div className={classes.dropOff} style={{ textAlign: 'justify', paddingBottom: 16 }}>
            {dropOffSettings?.description}
          </div>
        )}
      </div>
    </PickUpWrapper>
  );
};
