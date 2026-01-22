import React, { useMemo } from 'react';
import { Autocomplete, Grid } from '@mui/material';
import { dayOfWeekOptions } from './constants';
import {
  autocompleteOptionsRender,
  autocompleteRender,
} from '../../../../utils/autocompleteRenders';
import { EDay } from '../../../../store/reducers/demandSegments/types';
import { Label } from './styles';
import TimeSelect from '../../../../components/pickers/TimeSelect/TimeSelect';
import { TForm } from './types';
import { TOption } from '../../ServiceBookModal/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { hasEndTimeError, hasStartTimeError } from './helper';

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
  const { slotRange } = useSelector(({ slotScoring }: RootState) => slotScoring);

  const startTimeError = useMemo(
    () => hasStartTimeError(form, slotRange, formIsChecked),
    [formIsChecked, slotRange, form]
  );

  const endTimeError = useMemo(
    () => hasEndTimeError(form, slotRange, formIsChecked),
    [formIsChecked, slotRange, form]
  );

  const onAppointmentTimeChange = (value: string | undefined, field: keyof TForm) => {
    setFormIsChecked(false);
    setForm(prev => ({ ...prev, [field]: value }));
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
      <Grid item xs={12} sm={6}>
        <Label>Appointment Time Of Day From</Label>
        <TimeSelect
          disableClearable={false}
          width={'100%'}
          error={startTimeError}
          gap={60}
          start={slotRange?.start ?? ''}
          end={slotRange?.end ?? ''}
          value={form.appointmentTimeFrom}
          onChange={value => onAppointmentTimeChange(value, 'appointmentTimeFrom')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Label>Appointment Time Of Day To</Label>
        <TimeSelect
          disableClearable={false}
          width={'100%'}
          error={endTimeError}
          gap={60}
          start={slotRange?.start ?? ''}
          end={slotRange?.end ?? ''}
          value={form.appointmentTimeTo}
          onChange={value => onAppointmentTimeChange(value, 'appointmentTimeTo')}
        />
      </Grid>
    </>
  );
};

export default BottomSelectors;
