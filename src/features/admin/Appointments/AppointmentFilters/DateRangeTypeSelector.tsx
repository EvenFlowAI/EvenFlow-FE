import React from 'react';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { EDate } from '../types';
import { RadioBlock, RadioGroupLabel } from './styles';

type TProps = {
  dateRangeType: EDate;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, value: string) => void;
};

export const DateRangeTypeSelector: React.FC<TProps> = ({ dateRangeType, onChange }) => {
  return (
    <RadioBlock>
      <RadioGroupLabel>Date Search:</RadioGroupLabel>
      <RadioGroup
        row
        aria-label="countType"
        name="countType"
        value={dateRangeType === EDate.AppointmentDate ? 'AppointmentDate' : 'CreatedDate'}
        onChange={onChange}
      >
        <FormControlLabel
          value={'CreatedDate'}
          control={<Radio color="primary" />}
          label="Created Date"
        />
        <FormControlLabel
          value={'AppointmentDate'}
          control={<Radio color="primary" />}
          label="Appointment Date"
        />
      </RadioGroup>
    </RadioBlock>
  );
};
