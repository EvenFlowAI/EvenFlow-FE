import React from 'react';
import dayjs from 'dayjs';
import { TBreak } from '../types';
import { blankRow } from '../constants';
import { TParsableDate } from '../../../../types/types';
import { BreakDayRow } from './BreakDayRow';

type TProps = {
  form: TBreak[];
  workDays: number[];
  isXS: boolean;
  viewMode?: boolean;
  formIsChecked: boolean;
  containerClassName: string;
  buttonClassName: string;
  textClassName: string;
  onCheck: (day: number, check: boolean) => () => void;
  onChange: (day: number, t: 'from' | 'to') => (date: TParsableDate) => void;
};

const getDataByDay = (form: TBreak[], dayOfWeek: number): TBreak => {
  return (
    form.find(el => el.dayOfWeek === dayOfWeek) ?? {
      ...blankRow,
      dayOfWeek,
    }
  );
};

const isClosedDay = (workDays: number[], day: number): boolean => {
  return !workDays.includes(day);
};

export const BreakFormRows: React.FC<TProps> = ({
  form,
  workDays,
  isXS,
  viewMode,
  formIsChecked,
  containerClassName,
  buttonClassName,
  textClassName,
  onCheck,
  onChange,
}) => {
  return (
    <>
      {dayjs.weekdays().map((dayLabel, dayOfWeek) => {
        const data = getDataByDay(form, dayOfWeek);

        return (
          <BreakDayRow
            key={dayLabel}
            dayLabel={dayLabel}
            dayOfWeek={dayOfWeek}
            data={data}
            isXS={isXS}
            isClosedDay={isClosedDay(workDays, dayOfWeek)}
            viewMode={viewMode}
            formIsChecked={formIsChecked}
            containerClassName={containerClassName}
            buttonClassName={buttonClassName}
            textClassName={textClassName}
            onCheck={onCheck}
            onChange={onChange}
          />
        );
      })}
    </>
  );
};
