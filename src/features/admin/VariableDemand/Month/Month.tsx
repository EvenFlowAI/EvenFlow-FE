import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import {
  EDemandCategory,
  ITimeOfYearSetting,
} from '../../../../store/reducers/pricingSettings/types';
import { noop } from '../../../../utils/utils';
import { Day, DayName, MonthName } from './styles';
import { getDays } from './utils';
import { TParsableDate } from '../../../../types/types';
import dayjs from 'dayjs';

type TProps = {
  month: number;
  data: ITimeOfYearSetting[];
  onClick: (date: TParsableDate, data?: ITimeOfYearSetting) => void;
};

export const Month: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({
  month,
  data,
  onClick,
}) => {
  const [d, start, end] = useMemo(() => {
    const dt = dayjs.utc().month(month);
    return [
      dt,
      dayjs.utc(dt).startOf('month').startOf('week'),
      dayjs.utc(dt).endOf('month').endOf('week'),
    ];
  }, [month]);
  const monthDatesData = useMemo(() => getDays(start, end, data), [start, end, data]);

  const handleClick = (day: number, data?: ITimeOfYearSetting) => () => {
    const mDate = dayjs.utc().month(month).date(day).hour(0).minute(0).second(0).millisecond(0);
    onClick(mDate, data);
  };

  return (
    <Box display="grid" gap={'3px'} gridTemplateColumns="repeat(7, 1fr)">
      <MonthName>{d.format('MMMM')}</MonthName>
      {dayjs.weekdays().map(wd => (
        <DayName key={wd}>{wd[0]}</DayName>
      ))}
      {monthDatesData.map((mdd, idx) => {
        const dayNumber = dayjs(mdd.date).format('D');
        return (
          <Day
            key={idx}
            onClick={
              dayjs(mdd.date).isSame(d, 'month') ? handleClick(Number(dayNumber), mdd.data) : noop
            }
            className={[
              !dayjs(mdd.date).isSame(d, 'month') ? 'nonCurrent' : 'current',
              !mdd.data
                ? ''
                : mdd.data.demandCategory === EDemandCategory.Low
                  ? 'low'
                  : mdd.data.demandCategory === EDemandCategory.Average
                    ? 'average'
                    : 'high',
            ].join(' ')}
          >
            <span>{dayNumber}</span>
          </Day>
        );
      })}
    </Box>
  );
};
