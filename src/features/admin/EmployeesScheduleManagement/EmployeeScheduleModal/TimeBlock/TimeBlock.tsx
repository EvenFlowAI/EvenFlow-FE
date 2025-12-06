import React from 'react';
import dayjs from 'dayjs';
import { timeSpanString } from '../../../../../utils/constants';
import { IHOODataForm } from '../../../../../store/reducers/serviceCenters/types';
import { IScheduleByDate } from '../../../../../store/reducers/schedules/types';
import ClockTimePicker from '../../../../../components/pickers/ClockTimePicker/ClockTimePicker';
import { useStyles } from './style';

type TProps = {
  formIsChecked: boolean;
  disabledDate: boolean;
  el: IScheduleByDate;
  onTimeChange: (el: IScheduleByDate, field: 'startAt' | 'finishAt', value: string) => void;
  schedule?: IHOODataForm;
};

const TimeBlock: React.FC<TProps> = ({
  formIsChecked,
  schedule,
  onTimeChange,
  disabledDate,
  el,
}) => {
  const { classes } = useStyles();

  return (
    <div className={classes.timePickersWrapper}>
      <ClockTimePicker
        value={dayjs(el.startAt, 'HH:mm:ss')}
        disabled={!el.isOnSchedule || disabledDate}
        onChange={e => onTimeChange(el, 'startAt', dayjs(e).format('HH:mm:ss'))}
        label={''}
        InputProps={{
          className: 'ClockTimeTriggers',
          id: 'Scheduled time',
          placeholder: '',
          error:
            formIsChecked &&
            el.isOnSchedule &&
            (!el.startAt ||
              dayjs(el.finishAt, timeSpanString).isSameOrBefore(
                dayjs(el.startAt, timeSpanString),
                'minute'
              ) ||
              dayjs(el.startAt, timeSpanString).isBefore(
                dayjs(schedule?.from, timeSpanString),
                'minute'
              ) ||
              dayjs(el.startAt, timeSpanString).isAfter(
                dayjs(schedule?.to, timeSpanString),
                'minute'
              )),
        }}
      />
      <span className={classes.boldText}>TO</span>
      <ClockTimePicker
        value={dayjs(el.finishAt, 'HH:mm:ss')}
        disabled={!el.isOnSchedule || disabledDate}
        onChange={e => onTimeChange(el, 'startAt', dayjs(e).format('HH:mm:ss'))}
        label={''}
        InputProps={{
          className: 'ClockTimeTriggers',
          id: 'Scheduled time',
          placeholder: '',
          error:
            formIsChecked &&
            el.isOnSchedule &&
            (!el.finishAt ||
              dayjs(el.finishAt, timeSpanString).isSameOrBefore(
                dayjs(el.startAt, timeSpanString),
                'minute'
              ) ||
              dayjs(el.finishAt, timeSpanString).isAfter(
                dayjs(schedule?.to, timeSpanString),
                'minute'
              ) ||
              dayjs(el.finishAt, timeSpanString).isBefore(
                dayjs(schedule?.from, timeSpanString),
                'minute'
              )),
        }}
      />
    </div>
  );
};

export default TimeBlock;
