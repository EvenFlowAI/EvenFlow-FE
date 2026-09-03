import React from 'react';
import clsx from 'clsx';
import { DateRange, QueryBuilder } from '@mui/icons-material';
import { InputLabel } from '@mui/material';
import ClockTimePicker from '../../../../../components/pickers/ClockTimePicker/ClockTimePicker';
import { CustomDatePicker } from '../../../../../components/pickers/CustomDatePicker/CustomDatePicker';
import { useDatePickerStyles } from '../../../../../hooks/styling/useDatePickerStyles';
import { TOfferForm } from '../../types';
import { TParsableDate } from '../../../../../types/types';
import { useStyles } from './styles';

type TProps = {
  form: TOfferForm;
  formIsChecked: boolean;
  onChangeDateTime: (name: keyof TOfferForm) => (date: TParsableDate) => void;
};

export const OfferScheduleSection: React.FC<React.PropsWithChildren<TProps>> = ({
  form,
  formIsChecked,
  onChangeDateTime,
}) => {
  const { classes } = useStyles();
  const { classes: pickerClasses } = useDatePickerStyles();

  return (
    <>
      <div className={clsx(classes.inputContainer, classes.rowContainer)}>
        <div className={classes.innerContainer}>
          <ClockTimePicker
            fullWidth
            label="Time of Day"
            InputProps={{
              endAdornment: <QueryBuilder color="disabled" cursor="pointer" />,
              error: formIsChecked && !form.timeOfDayFrom,
            }}
            value={form.timeOfDayFrom ?? null}
            onChange={onChangeDateTime('timeOfDayFrom')}
          />
        </div>
        <div className={classes.divider}>-</div>
        <div className={classes.innerContainer}>
          <ClockTimePicker
            fullWidth
            InputProps={{
              endAdornment: <QueryBuilder color="disabled" cursor="pointer" />,
              error: formIsChecked && !form.timeOfDayTo,
            }}
            value={form.timeOfDayTo ?? null}
            onChange={onChangeDateTime('timeOfDayTo')}
          />
        </div>
      </div>
      <div className={clsx(classes.inputContainer, classes.rowContainer)}>
        <div className={classes.innerContainer}>
          <InputLabel shrink className={pickerClasses.label}>
            Start Date
          </InputLabel>
          <CustomDatePicker
            fullWidth
            value={form.durationFrom || null}
            onChange={onChangeDateTime('durationFrom')}
            format="MMMM, DD"
            maxDate={form.durationTo || undefined}
            InputProps={{
              endAdornment: <DateRange htmlColor="rgba(0, 0, 0, 0.54)" cursor="pointer" />,
              error: formIsChecked && !form.durationFrom,
            }}
          />
        </div>
        <div className={classes.divider}>-</div>
        <div className={classes.innerContainer}>
          <InputLabel shrink className={pickerClasses.label}>
            End Date
          </InputLabel>
          <CustomDatePicker
            fullWidth
            value={form.durationTo || null}
            onChange={onChangeDateTime('durationTo')}
            format="MMMM, DD"
            disablePast
            minDate={form.durationFrom || undefined}
            InputProps={{
              endAdornment: <DateRange htmlColor="rgba(0, 0, 0, 0.54)" cursor="pointer" />,
              error: formIsChecked && !form.durationTo,
            }}
          />
        </div>
      </div>
    </>
  );
};
