import React, { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { Autocomplete, Grid } from '@mui/material';
import { TextField } from '../../../../components/formControls/TextFieldStyled/TextField';
import {
  autocompleteOptionsRender,
  autocompleteRender,
} from '../../../../utils/autocompleteRenders';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { ServiceBookState, TForm, TOption } from '../types';
import { getOptions } from '../../../../utils/utils';
import { EAppointmentType, EJobType } from '../../../../store/reducers/pods/types';
import { IAdvisorShort } from '../../../../store/reducers/users/types';
import { IAssignedServiceRequestShort } from '../../../../store/reducers/serviceRequests/types';

interface AppointmentAutocompleteGroupProps {
  setForm: Dispatch<SetStateAction<TForm>>;
  form: TForm;
  setFormIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
  formIsChecked: boolean;
  loading: boolean;
  state: ServiceBookState;
  setState: React.Dispatch<React.SetStateAction<ServiceBookState>>;
}

const AppointmentAutocompleteGroup = ({
  setForm,
  form,
  setFormIsChecked,
  formIsChecked,
  loading,
  setState,
  state,
}: AppointmentAutocompleteGroupProps) => {
  const { podsLoading } = useSelector(({ pods }: RootState) => pods);
  const { advisorsList, techniciansList } = useSelector(
    ({ scEmployees }: RootState) => scEmployees
  );
  const { scRequestsShort: serviceRequests } = useSelector(
    ({ serviceRequests }: RootState) => serviceRequests
  );

  const appointmentTypeOptions: TOption[] = useMemo(
    () => getOptions(Object.keys(EAppointmentType).filter(key => Number.isNaN(+key))),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormIsChecked(false);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onAppointmentTypeChange = useCallback((e: React.SyntheticEvent, value: TOption | null) => {
    setState(prev => ({ ...prev, appointmentType: value }));
  }, []);

  const handleSelectAdv = (e: React.SyntheticEvent, val: IAdvisorShort[]) => {
    setFormIsChecked(false);
    setForm({ ...form, advisors: val });
  };

  const handleTechniciansChange = (e: React.SyntheticEvent, val: IAdvisorShort[]) => {
    setFormIsChecked(false);
    setForm({ ...form, technicians: val });
  };

  const handleSCChange = (e: React.SyntheticEvent, val: IAssignedServiceRequestShort[]) => {
    setFormIsChecked(false);
    setForm({ ...form, serviceRequests: val });
  };

  const jobTypeOptions: TOption[] = useMemo(
    () => getOptions(Object.keys(EJobType).filter(key => Number.isNaN(+key))),
    []
  );

  const onJobTypeChange = useCallback((e: React.SyntheticEvent, value: TOption | null) => {
    setState(prev => ({ ...prev, jobType: value }));
  }, []);

  return (
    <>
      <Grid item xs={12} sm={6}>
        <TextField
          id="name"
          name="name"
          label="Name"
          placeholder="Type Name"
          fullWidth
          required
          autoComplete="pod-name pod"
          onChange={handleChange}
          value={form.name}
          error={!form.name.length && formIsChecked}
          disabled={podsLoading || loading}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Autocomplete
          options={appointmentTypeOptions}
          getOptionLabel={i => i.name}
          disabled={podsLoading || loading}
          value={state.appointmentType}
          isOptionEqualToValue={(o, v) => o.value === v.value}
          onChange={onAppointmentTypeChange}
          renderInput={autocompleteRender({
            label: 'Appointment Type',
            placeholder: 'Appointment Type',
          })}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <Autocomplete
          options={advisorsList}
          multiple
          onChange={handleSelectAdv}
          ChipProps={{
            color: 'primary',
            style: { borderRadius: 4 },
            size: 'small',
          }}
          disableCloseOnSelect
          disabled={podsLoading || loading}
          getOptionLabel={i => i.fullName}
          isOptionEqualToValue={(o, s) => o.id === s.id}
          loading={false}
          value={form.advisors}
          renderOption={autocompleteOptionsRender(e => e.fullName)}
          renderInput={autocompleteRender({
            label: 'Advisors',
            fullWidth: true,
            placeholder: 'Select Advisors',
          })}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <Autocomplete
          disabled={podsLoading || loading}
          options={techniciansList}
          multiple
          ChipProps={{
            color: 'primary',
            style: { borderRadius: 4 },
            size: 'small',
          }}
          disableCloseOnSelect
          onChange={handleTechniciansChange}
          getOptionLabel={i => i.fullName}
          isOptionEqualToValue={(o, v) => o.id === v.id}
          renderOption={autocompleteOptionsRender(e => e.fullName)}
          loading={false}
          value={form.technicians}
          renderInput={autocompleteRender({
            label: 'Technicians',
            fullWidth: true,
            placeholder: 'Select Technicians',
            error: !form.technicians.length && formIsChecked,
          })}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <Autocomplete
          options={serviceRequests}
          multiple
          fullWidth
          disabled={podsLoading || loading}
          ChipProps={{
            color: 'primary',
            style: { borderRadius: 4 },
            size: 'small',
          }}
          disableCloseOnSelect
          onChange={handleSCChange}
          getOptionLabel={i => i.code}
          isOptionEqualToValue={(o, v) => o.id === v.id}
          renderOption={autocompleteOptionsRender(e => e.code)}
          loading={false}
          value={form.serviceRequests}
          renderInput={autocompleteRender({
            label: 'Op Codes',
            fullWidth: true,
            placeholder: 'Select Op Codes',
          })}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <Autocomplete
          disabled={podsLoading || loading}
          options={jobTypeOptions}
          isOptionEqualToValue={(o, v) => o.value === v.value}
          getOptionLabel={i => i.name}
          value={state.jobType}
          onChange={onJobTypeChange}
          renderInput={autocompleteRender({
            label: 'Job Type',
            placeholder: 'Job Type',
          })}
        />
      </Grid>
    </>
  );
};

export default AppointmentAutocompleteGroup;
