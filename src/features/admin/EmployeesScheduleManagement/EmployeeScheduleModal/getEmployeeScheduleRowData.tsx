import React from 'react';
import { Switch } from '@mui/material';
import { TableRowDataType } from '../../../../types/types';
import { IScheduleByDate } from '../../../../store/reducers/schedules/types';
import { SwitcherLabel, SwitcherWrapper } from './styles';
import TimeBlock from './TimeBlock/TimeBlock';
import { IHOODataForm } from '../../../../store/reducers/serviceCenters/types';

type TParams = {
  isTablet: boolean;
  disabledDate: boolean;
  schedule: IHOODataForm | undefined;
  formIsChecked: boolean;
  handleSwitch: (
    el: IScheduleByDate
  ) => (e: React.ChangeEvent<HTMLInputElement>, value: boolean) => void;
  onTimeChange: (el: IScheduleByDate, field: 'startAt' | 'finishAt', value: string) => void;
};

export const getEmployeeScheduleRowData = ({
  isTablet,
  disabledDate,
  schedule,
  formIsChecked,
  handleSwitch,
  onTimeChange,
}: TParams): TableRowDataType<IScheduleByDate>[] => {
  const verticalAlign = isTablet ? 'top' : 'middle';

  return [
    {
      header: 'Employee',
      val: el => el.employeeName,
      verticalAlign,
    },
    {
      header: 'Role',
      val: el => el.role,
      verticalAlign,
    },
    {
      header: 'Service Book',
      val: el => el.serviceBooks.map(book => book.serviceBook).join(', '),
      verticalAlign,
    },
    {
      header: 'On Schedule',
      verticalAlign,
      val: el => {
        return (
          <SwitcherWrapper>
            <SwitcherLabel>NO</SwitcherLabel>
            <Switch
              disabled={disabledDate}
              onChange={handleSwitch(el)}
              checked={el.isOnSchedule}
              color="primary"
            />
            <SwitcherLabel>YES</SwitcherLabel>
          </SwitcherWrapper>
        );
      },
    },
    {
      header: 'Scheduled Hours',
      verticalAlign,
      val: el => (
        <TimeBlock
          onTimeChange={onTimeChange}
          el={el}
          schedule={schedule}
          disabledDate={disabledDate}
          formIsChecked={formIsChecked}
        />
      ),
    },
  ];
};
