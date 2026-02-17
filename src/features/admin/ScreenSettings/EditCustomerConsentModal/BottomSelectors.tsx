import React, { useMemo } from 'react';
import { Autocomplete, Grid } from '@mui/material';
import { dayOfWeekOptions } from './constants';
import {
  autocompleteOptionsRender,
  autocompleteRender,
} from '../../../../utils/autocompleteRenders';
import { EDay } from '../../../../store/reducers/demandSegments/types';
import { TForm } from './types';
import { TOption } from '../../ServiceBookModal/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { hasEndTimeError, hasStartTimeError } from './helper';
import ClockTimePicker from '../../../../components/pickers/ClockTimePicker/ClockTimePicker';
import dayjs from 'dayjs';
import { useStyles } from '../styles';

interface BottomSelectorsProps {
  form: TForm;
  formIsChecked: boolean;
  setFormIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
  setForm: React.Dispatch<React.SetStateAction<TForm>>;
}

const BottomSelectors = ({
  setFormIsChecked,
  setForm,
  form,
  formIsChecked,
}: BottomSelectorsProps) => {
  const { classes } = useStyles();

  const { slotRange } = useSelector(({ slotScoring }: RootState) => slotScoring);

  const startTimeError = useMemo(
    () => hasStartTimeError(form, slotRange, formIsChecked),
    [formIsChecked, slotRange, form]
  );

  const endTimeError = useMemo(
    () => hasEndTimeError(form, slotRange, formIsChecked),
    [formIsChecked, slotRange, form]
  );

  const onAppointmentTimeChange = (value: string, field: keyof TForm) => {
    setFormIsChecked(false);
    if (value === 'Invalid Date') {
      setForm(prev => ({ ...prev, [field]: null }));
    } else {
      setForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const onDayOfWeekChange = (e: React.SyntheticEvent, value: TOption[]) => {
    setFormIsChecked(false);
    setForm(prev => ({ ...prev, daysOfWeek: value.map(({ value }) => value as EDay) }));
  };

  return (
    <>
      <Grid item xs={12}>
        <Autocomplete
          multiple
          ChipProps={{
            color: 'primary',
            style: { borderRadius: 4 },
            size: 'small',
          }}
          disableCloseOnSelect
          options={dayOfWeekOptions}
          isOptionEqualToValue={(o, v) => o.value === v.value}
          renderOption={autocompleteOptionsRender(e => e.name)}
          value={dayOfWeekOptions.filter(el => form.daysOfWeek.includes(el.value as EDay))}
          onChange={onDayOfWeekChange}
          getOptionLabel={i => i.name}
          renderInput={autocompleteRender({
            label: 'Appointment Days Of Week',
            placeholder: 'Select Appointment Days Of Week',
          })}
        />
      </Grid>
      <div className={classes.dateWrapper}>
        <div>
          <ClockTimePicker
            value={form.appointmentTimeFrom ? dayjs(form.appointmentTimeFrom, 'HH:mm:ss') : null}
            withClear
            onChange={e =>
              onAppointmentTimeChange(dayjs(e).format('HH:mm:ss'), 'appointmentTimeFrom')
            }
            label={'Appointment Time Of Day From'}
            InputProps={{
              className: 'ClockTimeTriggers',
              id: 'Scheduled time',
              placeholder: '',
              error: startTimeError,
            }}
          />
        </div>
        <div>
          <ClockTimePicker
            value={form.appointmentTimeTo ? dayjs(form.appointmentTimeTo, 'HH:mm:ss') : null}
            withClear
            onChange={e =>
              onAppointmentTimeChange(dayjs(e).format('HH:mm:ss'), 'appointmentTimeTo')
            }
            label={'Appointment Time Of Day To'}
            InputProps={{
              className: 'ClockTimeTriggers',
              id: 'Scheduled time 2',
              placeholder: '',
              error: endTimeError,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default BottomSelectors;
