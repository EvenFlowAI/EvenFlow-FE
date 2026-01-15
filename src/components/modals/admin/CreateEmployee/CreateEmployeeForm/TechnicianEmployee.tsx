import React, { Dispatch, SetStateAction } from 'react';
import { Roles, TTechnicianLevel } from '../../../../../types/types';
import { Grid } from '@mui/material';
import { TextField } from '../../../../formControls/TextFieldStyled/TextField';
import { ToggleButtons } from '../../../../buttons/ToggleButtons/ToggleButtons';
import { TEmployeeForm } from '../types';

interface TechnicianEmployeeProps {
  form: TEmployeeForm;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
  setFormIsChecked: Dispatch<SetStateAction<boolean>>;
  setEmployeeForm: Dispatch<SetStateAction<TEmployeeForm>>;
}

const TechnicianEmployee = ({
  form,
  handleChange,
  setFormIsChecked,
  setEmployeeForm,
}: TechnicianEmployeeProps) => {
  const handleSwitchChange = (e: React.SyntheticEvent, newVal: number) => {
    setFormIsChecked(false);
    if (newVal) {
      setEmployeeForm(prev => ({
        ...prev,
        technicianLevel: newVal as TTechnicianLevel,
      }));
    }
  };

  return (
    <>
      {form.role === Roles.Technician && (
        <>
          <Grid item xs={12} sm={12} md={6}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField
                  id="hourlyRate"
                  name="hourlyRate"
                  label="Hourly rate"
                  placeholder="Enter Rate"
                  type="number"
                  fullWidth
                  onChange={handleChange}
                  value={form.hourlyRate}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="overtimeRate"
                  name="overtimeRate"
                  label="Overtime rate"
                  placeholder="Enter Rate"
                  type="number"
                  fullWidth
                  onChange={handleChange}
                  value={form.overtimeRate}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <ToggleButtons
              value={form.technicianLevel || 1}
              label="Technician Level"
              buttons={[
                { id: '1', label: '1', value: 1 },
                { id: '2', label: '2', value: 2 },
                { id: '3', label: '3', value: 3 },
              ]}
              exclusive
              onChange={handleSwitchChange}
            />
          </Grid>
        </>
      )}
    </>
  );
};

export default TechnicianEmployee;
