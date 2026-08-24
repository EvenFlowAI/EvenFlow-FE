import React from 'react';
import { Button, Grid, IconButton } from '@mui/material';
import { DeleteOutline } from '@mui/icons-material';
import ClockTimePicker from '../../../../components/pickers/ClockTimePicker/ClockTimePicker';
import { TBreak } from '../types';
import { TParsableDate } from '../../../../types/types';

type TProps = {
  dayLabel: string;
  dayOfWeek: number;
  data: TBreak;
  isXS: boolean;
  isClosedDay: boolean;
  viewMode?: boolean;
  formIsChecked: boolean;
  containerClassName: string;
  buttonClassName: string;
  textClassName: string;
  onCheck: (day: number, check: boolean) => () => void;
  onChange: (day: number, t: 'from' | 'to') => (date: TParsableDate) => void;
};

export const BreakDayRow: React.FC<TProps> = ({
  dayLabel,
  dayOfWeek,
  data,
  isXS,
  isClosedDay,
  viewMode,
  formIsChecked,
  containerClassName,
  buttonClassName,
  textClassName,
  onCheck,
  onChange,
}) => {
  const canShowBreakTime = data.checked && !isClosedDay;
  const addBreakDisabled = data.checked || isClosedDay || viewMode;
  const fromError = !data.from && data.checked && formIsChecked;
  const toError = !data.to && data.checked && formIsChecked;

  return (
    <Grid container className={containerClassName} alignItems="flex-end" key={dayLabel}>
      <Grid item xs={12} sm={3}>
        <Button
          onClick={onCheck(dayOfWeek, true)}
          fullWidth
          disabled={addBreakDisabled}
          className={buttonClassName}
          variant="contained"
          color="primary"
        >
          Add Break
        </Button>
      </Grid>
      <Grid item xs={1} hidden={isXS} />
      <Grid item xs={4} sm={3}>
        <ClockTimePicker
          label={dayLabel}
          fullWidth
          disabled={!data.checked || viewMode}
          placeholder={isClosedDay ? 'Closed' : ''}
          value={data.from}
          error={fromError}
          onChange={onChange(dayOfWeek, 'from')}
          id={`${dayLabel}Start`}
          name={`${dayLabel}Start`}
        />
      </Grid>
      <Grid item xs={2} sm={1} className={textClassName}>
        {canShowBreakTime ? 'to' : ''}
      </Grid>
      <Grid item xs={4} sm={3}>
        {canShowBreakTime ? (
          <ClockTimePicker
            fullWidth
            id={`${dayLabel}End`}
            name={`${dayLabel}End`}
            value={data.to}
            error={toError}
            disabled={viewMode}
            onChange={onChange(dayOfWeek, 'to')}
          />
        ) : null}
      </Grid>
      <Grid item xs={2} sm={1}>
        {data.checked && !viewMode ? (
          <IconButton onClick={onCheck(dayOfWeek, false)} color="primary" size="large">
            <DeleteOutline />
          </IconButton>
        ) : null}
      </Grid>
    </Grid>
  );
};
