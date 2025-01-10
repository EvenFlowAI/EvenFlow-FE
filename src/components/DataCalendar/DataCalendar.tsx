import React, { useEffect, useMemo } from 'react';
import { Paper } from '@mui/material';
import clsx from 'clsx';
import { useStyles } from './styles';
import dayjs from 'dayjs';
import { IDataCalendarProps, TParsableDate } from '../../types/types';
import { TDay, TDayType } from '../../features/admin/AvailableStaffCalendar/types';
import { CalendarControls } from './CalendarControls/CalendarControls';
import { CALENDAR_FORMAT, WeekDayNames } from '../../utils/constants';
import { IconsBlock } from './IconsBlock/IconsBlock';
import { Loading } from '../wrappers/Loading/Loading';

export function DataCalendar<U>({
  date,
  data,
  setDate,
  onDayClick,
  firstIconFieldName,
  secondIconFieldName,
  firstIcon,
  secondIcon,
  index,
  dateFieldName,
  firstIconText,
  secondIconText,
  setTimePeriod,
  timePeriod,
  disabledDates,
  loading,
}: IDataCalendarProps<U>) {
  const today = useMemo(() => dayjs(), []);
  const { classes } = useStyles();

  const handleMonthChange = (m: TParsableDate) => {
    setDate(m);
  };

  const days: TDay[] = useMemo(() => {
    const days: TDay[] = [];
    let cur = dayjs(date).startOf('month');
    const daysInMonth = cur.daysInMonth();
    const startDay = cur.day();
    cur = cur.subtract(startDay, 'days');
    for (let i = 0; i < daysInMonth + startDay; i++) {
      days.push({
        date: dayjs(cur),
        day: +cur.format('D'),
        type: cur.month() === dayjs(date).month() ? 'cur' : 'prev',
      });
      cur = dayjs(cur).add(1, 'day');
    }
    for (let i = 0; i < cur.day(); i++) {
      days.push({
        date: dayjs(cur),
        day: +cur.format('D'),
        type: 'next',
      });
      cur = dayjs(cur).add(1, 'day');
    }

    return days;
  }, [date]);

  useEffect(() => {
    if (days.length) {
      if (
        !dayjs(timePeriod?.startDate).isSame(dayjs(days[0]?.date)) ||
        !dayjs(timePeriod?.endDate).isSame(dayjs(days[days.length - 1]?.date))
      ) {
        setTimePeriod({ startDate: days[0]?.date, endDate: days[days.length - 1]?.date });
      }
    }
  }, [days, timePeriod]);

  const onClick = (data: U | undefined, date: TParsableDate, dayType: TDayType) => {
    if (data && dayType === 'cur') {
      onDayClick(data, date, dayType);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <Paper className={classes.paper} variant="outlined">
        <h2 className={classes.title}>Calendar</h2>
        <CalendarControls date={date} onChange={handleMonthChange} />
        {loading ? (
          <Loading />
        ) : (
          <div className={classes.calendarWrapper}>
            {WeekDayNames.map(day => (
              <div className={classes.weekDay} key={day}>
                {day}
              </div>
            ))}
            {days.map((d, i) => {
              const dayData = data.find(el => {
                if (el[dateFieldName]) {
                  const formatted = dayjs
                    .utc(el[dateFieldName] as TParsableDate)
                    .format(CALENDAR_FORMAT);
                  return dayjs(formatted).isSame(dayjs.utc(d.date), 'date');
                }
              });
              const isEnabled = !disabledDates?.find(el => dayjs(d.date).isSame(dayjs(el), 'date'));

              return (
                <div
                  className={clsx(
                    classes.dayCell,
                    d.type === 'cur'
                      ? isEnabled
                        ? classes.currentMonth
                        : //classes.nonWorking
                          classes.currentMonth
                      : classes.prevMonth,
                    dayjs(d.date).isSame(today, 'day') ? classes.today : ''
                  )}
                  onClick={() => {
                    return onClick(dayData, d.date, d.type);
                  }}
                  key={`${d.day}-${d.type}`}
                >
                  <span className={classes.dayNumber}>{d.day}</span>
                  <IconsBlock
                    icon={firstIcon}
                    index={'firstIcon'}
                    tooltipText={firstIconText}
                    value={dayData ? dayData[firstIconFieldName] : undefined}
                  />
                  <IconsBlock
                    index={'secondIcon'}
                    icon={secondIcon}
                    tooltipText={secondIconText}
                    value={dayData ? dayData[secondIconFieldName] : undefined}
                  />
                </div>
              );
            })}
          </div>
        )}
      </Paper>
    </div>
  );
}
