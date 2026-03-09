import React, { Dispatch, SetStateAction } from 'react';
import { Grid } from '@mui/material';
import { TUserAccountForm } from '../types';
import { TextField } from '../../../../formControls/TextFieldStyled/TextField';
import {
  Roles,
  TOptionForUserAccountServiceCenters,
  TTechnicianLevel,
} from '../../../../../types/types';
import { ToggleButtons } from '../../../../buttons/ToggleButtons/ToggleButtons';

interface TechnicianEmployeeProps {
  sc: TOptionForUserAccountServiceCenters;
  form: TUserAccountForm;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
  setFormIsChecked: Dispatch<SetStateAction<boolean>>;
  setErrorForDmsId: Dispatch<SetStateAction<boolean>>;
  setEmployeeForm: Dispatch<SetStateAction<TUserAccountForm>>;
}

const TechnicianEmployee = ({
  sc,
  form,
  handleChange,
  setFormIsChecked,
  setErrorForDmsId,
  setEmployeeForm,
}: TechnicianEmployeeProps) => {
  const handleSwitchChange = (e: React.SyntheticEvent, newVal: number) => {
    setFormIsChecked(false);
    setErrorForDmsId(false);
    if (newVal) {
      setEmployeeForm(prev => ({
        ...prev,
        serviceCenters: prev.serviceCenters.map(el =>
          el.value === sc.value
            ? {
                ...el,
                technicianLevel: newVal as TTechnicianLevel,
              }
            : el
        ),
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
                  value={sc.hourlyRate}
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
                  value={sc.overtimeRate}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <ToggleButtons
              value={sc.technicianLevel || 1}
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
