import React from 'react';
import { Grid, InputAdornment, Switch } from '@mui/material';
import { TextField } from '../../../components/formControls/TextFieldStyled/TextField';
import { Label } from './styles';
import {
  SwitcherLabel,
  SwitcherWrapper,
} from '../EmployeesScheduleManagement/EmployeeScheduleModal/styles';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/rootReducer';
import { TForm } from './types';

interface EmployeeSettingsFormProps {
  form: TForm;
  setForm: React.Dispatch<React.SetStateAction<TForm>>;
  formIsChecked: boolean;
  setFormChecked: React.Dispatch<React.SetStateAction<boolean>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EmployeeSettingsForm = ({
  form,
  setForm,
  formIsChecked,
  setFormChecked,
  handleChange,
}: EmployeeSettingsFormProps) => {
  const { currentSetting } = useSelector((state: RootState) => state.capacityManagement);

  const handleSwitch = (e: React.SyntheticEvent, value: boolean) => {
    setFormChecked(false);
    setForm(prev => ({ ...prev, isAdvisorStaffingFactor: value }));
  };

  return (
    <>
      <Grid item xs={12} md={6}>
        <TextField
          id="technicianEfficiency"
          name="technicianEfficiency"
          label="Technician Efficiency"
          placeholder="Type Efficiency, %"
          fullWidth
          type="number"
          startAdornment={<InputAdornment position="start">%</InputAdornment>}
          error={
            formIsChecked &&
            form.technicianEfficiency !== null &&
            (form.technicianEfficiency < 25 ||
              form.technicianEfficiency > 999 ||
              !Number.isInteger(+form.technicianEfficiency))
          }
          inputProps={{ min: 0, step: 1 }}
          onChange={handleChange}
          value={form.technicianEfficiency}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          id="averageBillHoursPerRO"
          name="averageBillHoursPerRO"
          label="Average RO Hours"
          placeholder="Type RO Hours"
          fullWidth
          type="number"
          inputProps={{ min: 0 }}
          onChange={handleChange}
          error={
            formIsChecked && form.averageBillHoursPerRO !== null && form.averageBillHoursPerRO < 0
          }
          value={form.averageBillHoursPerRO}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Label>Advisor Staffing Factor</Label>
        <SwitcherWrapper>
          <SwitcherLabel>OFF</SwitcherLabel>
          <Switch
            disabled={typeof currentSetting?.isAdvisorStaffingFactor === 'undefined'}
            onChange={handleSwitch}
            checked={form.isAdvisorStaffingFactor}
            color="primary"
          />
          <SwitcherLabel>ON</SwitcherLabel>
        </SwitcherWrapper>
      </Grid>
    </>
  );
};

export default EmployeeSettingsForm;
