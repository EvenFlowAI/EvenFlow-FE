import React, { Dispatch, SetStateAction, useMemo } from 'react';
import { Autocomplete, Divider, Grid } from '@mui/material';
import { TextField } from '../../../../formControls/TextFieldStyled/TextField';
import { EEmployeeType, TEmployeeForm } from '../types';
import { autocompleteRender } from '../../../../../utils/autocompleteRenders';
import { checkEmail, getOptions, validatePhoneNumber } from '../../../../../utils/utils';
import 'react-phone-number-input/style.css';
import { superRoles } from '../constants';
import { Roles } from '../../../../../types/types';
import { TRole } from '../../../../../store/reducers/users/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';
import { TOption } from '../../../../../features/admin/ServiceBookModal/types';
import { availableUserRoles, dealerShipAccessRoles } from '../../../../../utils/constants';
import TechnicianEmployee from './TechnicianEmployee';
import AdvisorEmployee from './AdvisorEmployee';
import DmsForm from './forms/DmsForm';
import ServiceCenterForm from './forms/ServiceCenterForm';

type TTFormProps = {
  isEdit: boolean;
  form: TEmployeeForm;
  initialForm: TEmployeeForm;
  formIsChecked: boolean;
  setFormIsChecked: Dispatch<SetStateAction<boolean>>;
  setEmployeeForm: Dispatch<SetStateAction<TEmployeeForm>>;
};

export const CreateEmployeeForm: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TTFormProps>>
> = ({ setEmployeeForm, setFormIsChecked, formIsChecked, form, initialForm, isEdit }) => {
  const { shortLoading } = useSelector((state: RootState) => state.serviceCenters);

  const employeeTypeOptions: TOption[] = useMemo(
    () => getOptions(Object.keys(EEmployeeType).filter(key => Number.isNaN(+key))),
    []
  );
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({
    target: { name, value },
  }) => {
    setFormIsChecked(false);
    if (name === 'phoneNumber') {
      value = validatePhoneNumber(value);
    }
    setEmployeeForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e: React.SyntheticEvent, value: string | null) => {
    setFormIsChecked(false);
    setEmployeeForm(prev => ({
      ...prev,
      role: value as TRole,
      dmsId: null,
      type: null,
      displayOnBookingTypes: value === 'Advisor' ? prev.displayOnBookingTypes : [],
      serviceCenter: dealerShipAccessRoles.includes(value as TRole) ? null : prev.serviceCenter,
    }));
  };

  const handleTypeChange = (e: React.SyntheticEvent<Element, Event>, value: TOption | null) => {
    setFormIsChecked(false);
    setEmployeeForm(prev => ({
      ...prev,
      type: (value?.value as EEmployeeType) ?? null,
    }));
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <TextField
          id="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="Type First name"
          name="firstName"
          fullWidth
          error={!form.firstName?.length && formIsChecked}
          label="First name"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          id="lastName"
          fullWidth
          value={form.lastName}
          onChange={handleChange}
          error={!form.lastName?.length && formIsChecked}
          placeholder="Type Last name"
          name="lastName"
          label="Last name"
        />
      </Grid>
      <Grid item xs={12}>
        {form.role && dealerShipAccessRoles.includes(form.role) ? (
          <TextField
            disabled
            value={null}
            placeholder="Select Service Center"
            fullWidth
            label="Service Center"
          />
        ) : (
          <ServiceCenterForm
            form={form}
            formIsChecked={formIsChecked}
            setEmployeeForm={setEmployeeForm}
            setFormIsChecked={setFormIsChecked}
            initialForm={initialForm}
            isEdit={isEdit}
          />
        )}
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          id="email"
          name="email"
          fullWidth
          placeholder="Type Email"
          value={form.email}
          error={Boolean(form.email?.length) && !checkEmail(form.email) && formIsChecked}
          onChange={handleChange}
          label="Email"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Autocomplete
          options={availableUserRoles.exceptOf(superRoles)}
          isOptionEqualToValue={(option, value) => option === value}
          onChange={handleRoleChange}
          loading={shortLoading}
          value={form.role ?? null}
          renderInput={autocompleteRender({
            label: 'Role',
            fullWidth: true,
            placeholder: 'Select Role',
            error: !form.role && formIsChecked,
          })}
        />
      </Grid>
      <Grid item xs={12}>
        <Divider color="#DADADA" style={{ margin: 0 }} />
      </Grid>
      <DmsForm form={form} setEmployeeForm={setEmployeeForm} setFormIsChecked={setFormIsChecked} />
      <Grid item xs={12} sm={6}>
        <TextField
          label="Position"
          id="position"
          value={form.position}
          name="position"
          placeholder="Type position"
          onChange={handleChange}
          fullWidth
        />
      </Grid>
      <TechnicianEmployee
        setEmployeeForm={setEmployeeForm}
        form={form}
        handleChange={handleChange}
        setFormIsChecked={setFormIsChecked}
      />
      <AdvisorEmployee
        form={form}
        setFormIsChecked={setFormIsChecked}
        setEmployeeForm={setEmployeeForm}
      />
      {[Roles.Advisor, Roles.Technician].includes(form.role as Roles) ? (
        <Grid item xs={12} sm={6}>
          <Autocomplete
            options={employeeTypeOptions}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            onChange={handleTypeChange}
            getOptionLabel={o => o.name}
            loading={shortLoading}
            value={employeeTypeOptions.find(el => el.value === form.type) ?? null}
            renderInput={autocompleteRender({
              label: 'Type',
              fullWidth: true,
              placeholder: 'Select Type',
            })}
          />
        </Grid>
      ) : null}
    </Grid>
  );
};
