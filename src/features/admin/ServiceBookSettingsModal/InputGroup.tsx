import React, { useMemo } from 'react';
import { Autocomplete, Grid } from '@mui/material';
import { TextField } from '../../../components/formControls/TextFieldStyled/TextField';
import { autocompleteRender } from '../../../utils/autocompleteRenders';
import { SubTitle } from './styles';
import { TOption } from '../ServiceBookModal/types';
import { getGapSlotOptions } from './utils';
import { TForm } from './types';

interface InputGroupProps {
  form: TForm;
  setForm: React.Dispatch<React.SetStateAction<TForm>>;
  formIsChecked: boolean;
  setFormChecked: React.Dispatch<React.SetStateAction<boolean>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputGroup = ({
  form,
  setForm,
  formIsChecked,
  setFormChecked,
  handleChange,
}: InputGroupProps) => {
  const gapSlotTypeOptions: TOption[] = useMemo(() => getGapSlotOptions(), []);

  const handleSelectGap = (e: React.SyntheticEvent, val: TOption | null) => {
    setFormChecked(false);
    setForm({ ...form, gapSlotsType: val });
  };

  return (
    <>
      <Grid item xs={12}>
        <TextField
          id="serviceBookName"
          name="serviceBookName"
          label="Service Book Name"
          placeholder="Type Name"
          fullWidth
          required
          disabled
          error={formIsChecked && !form.serviceBookName}
          onChange={handleChange}
          value={form.serviceBookName}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Autocomplete
          id="gapSlotsType"
          fullWidth
          getOptionLabel={o => o.name}
          onChange={handleSelectGap}
          value={form.gapSlotsType}
          isOptionEqualToValue={(o, v) => o === v}
          options={gapSlotTypeOptions}
          renderInput={autocompleteRender({
            label: 'Appointment Gap Slots',
            placeholder: 'Appointment Gap Slots',
            error: formIsChecked && !form.gapSlotsType,
            required: true,
          })}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          id="appointmentsPerSlot"
          name="appointmentsPerSlot"
          label="Appointments Per Slot"
          placeholder="Type Amount"
          fullWidth
          type="number"
          error={formIsChecked && form.appointmentsPerSlot !== null && form.appointmentsPerSlot < 0}
          inputProps={{ min: 0 }}
          onChange={handleChange}
          value={form.appointmentsPerSlot}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          id="appointmentLeadTime"
          name="appointmentLeadTime"
          label="Appointment Lead Time"
          placeholder="Type Time"
          error={formIsChecked && form.appointmentLeadTime !== null && form.appointmentLeadTime < 0}
          fullWidth
          type="number"
          inputProps={{ min: 0 }}
          onChange={handleChange}
          value={form.appointmentLeadTime}
        />
      </Grid>
      <Grid xs={12} item>
        <SubTitle>Appointment Cut Off</SubTitle>
      </Grid>
    </>
  );
};

export default InputGroup;
