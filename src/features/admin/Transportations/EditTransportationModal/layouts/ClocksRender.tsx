import React from 'react';
import ClockTimePicker from '../../../../../components/pickers/ClockTimePicker/ClockTimePicker';
import dayjs from 'dayjs';
import { QueryBuilder } from '@mui/icons-material';
import { useStyles } from '../styles';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';
import { TRuleState } from '../helper';

interface IClocksRender {
  rule: TRuleState;
  errors: string[];
  updateLocalRule: (index: number, rule: Partial<TRuleState>) => void;
  index: number;
  disabled: boolean;
}

const ClocksRender = ({ rule, errors, updateLocalRule, index, disabled }: IClocksRender) => {
  const { classes } = useStyles();

  const { formIsChecked } = useSelector((state: RootState) => state.serviceRequests);

  return (
    <div className={classes.smallWrapper}>
      <ClockTimePicker
        withClear
        disabled={disabled}
        error={
          errors.some(
            e => e.includes('time') || e.includes('Start') || e.includes('configuration')
          ) && formIsChecked
        }
        value={rule.timeOfDay?.start ?? null}
        onError={(reason, value) => {
          if (reason === 'invalidDate' || value === null) {
            updateLocalRule(index, {
              timeOfDay: {
                ...rule.timeOfDay,
                start: null,
              },
            });
          }
        }}
        onChange={date =>
          updateLocalRule(index, {
            timeOfDay: {
              ...rule.timeOfDay,
              start: date ? dayjs(date, 'HH:mm:ss') : null,
            },
          })
        }
        fullWidth
        InputProps={{
          endAdornment: disabled ? null : <QueryBuilder color={'disabled'} cursor="pointer" />,
          placeholder: 'Start Time',
        }}
      />
      <span>_</span>
      <ClockTimePicker
        withClear
        disabled={disabled}
        error={
          errors.some(
            e => e.includes('time') || e.includes('End') || e.includes('configuration')
          ) && formIsChecked
        }
        value={rule.timeOfDay?.end ?? null}
        onError={(reason, value) => {
          if (reason === 'invalidDate' || value === null) {
            updateLocalRule(index, {
              timeOfDay: {
                ...rule.timeOfDay,
                start: null,
              },
            });
          }
        }}
        onChange={date =>
          updateLocalRule(index, {
            timeOfDay: {
              ...rule.timeOfDay,
              end: date ? dayjs(date, 'HH:mm:ss') : null,
            },
          })
        }
        fullWidth
        InputProps={{
          endAdornment: disabled ? null : <QueryBuilder color={'disabled'} cursor="pointer" />,
          placeholder: 'End Time',
        }}
      />
    </div>
  );
};

export default ClocksRender;
