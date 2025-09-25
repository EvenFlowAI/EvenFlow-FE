import React, { Dispatch, SetStateAction, useMemo } from 'react';
import { Autocomplete, Divider, FormControlLabel, Grid, Switch } from '@mui/material';
import { TextField } from '../../../../formControls/TextFieldStyled/TextField';
import {
  EDisplayOnBookingType,
  EEmployeeType,
  TDMSConsultantChange,
  TEmployeeForm,
  TSelectChange,
} from '../types';
import { ToggleButtons } from '../../../../buttons/ToggleButtons/ToggleButtons';
import { autocompleteRender } from '../../../../../utils/autocompleteRenders';
import { checkEmail, getOptions, validatePhoneNumber } from '../../../../../utils/utils';
import 'react-phone-number-input/style.css';
import {DmsRoles, superRoles} from '../constants';
import { useCurrentUser } from '../../../../../hooks/useCurrentUser/useCurrentUser';
import { Roles, TTechnicianLevel } from '../../../../../types/types';
import { loadDMSAdvisors } from '../../../../../store/reducers/employees/actions';
import { TRole } from '../../../../../store/reducers/users/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';
import { useStyles } from './styles';
import { TOption } from '../../../../../features/admin/ServiceBookModal/types';
import {availableUserRoles} from "../../../../../utils/constants";

type TTFormProps = {
  isEdit: boolean;
  form: TEmployeeForm;
  formIsChecked: boolean;
  setFormIsChecked: Dispatch<SetStateAction<boolean>>;
  setEmployeeForm: Dispatch<SetStateAction<TEmployeeForm>>;
};

export const CreateEmployeeForm: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TTFormProps>>
> = ({ setEmployeeForm, setFormIsChecked, formIsChecked, form, isEdit }) => {
  const { shortSC, shortLoading } = useSelector((state: RootState) => state.serviceCenters);
  const { DmsAdvisors: dmsAdvisors } = useSelector((state: RootState) => state.scEmployees);
  const { loadingDMSAdvisors } = useSelector((state: RootState) => state.employees);
  const currentUser = useCurrentUser();
  const dispatch = useDispatch();

  const { classes } = useStyles();
  const dmsOptions = useMemo(
    () => dmsAdvisors.filter(el => el.role && form.role && DmsRoles[el.role] === form.role),
    [dmsAdvisors, form.role]
  );
  const dmsAdvisor = useMemo(
    () =>
      form?.dmsId && dmsAdvisors.length
        ? dmsAdvisors.find(item => item.dmsId === form.dmsId)
        : null,
    [form?.dmsId, dmsAdvisors]
  );
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

  const handleSelectChange: TSelectChange = (e, value) => {
    setFormIsChecked(false);
    if (value?.id) {
      dispatch(loadDMSAdvisors(value.id));
    }
    setEmployeeForm(prev => ({ ...prev, serviceCenter: value ?? null }));
  };

  const handleSelfServiceChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setFormIsChecked(false);
    setEmployeeForm(prev => ({
      ...prev,
      displayOnBookingTypes: checked
        ? prev.displayOnBookingTypes
          ? [...prev.displayOnBookingTypes, EDisplayOnBookingType.SelfService]
          : [EDisplayOnBookingType.SelfService]
        : prev.displayOnBookingTypes?.filter(el => el !== EDisplayOnBookingType.SelfService),
    }));
  };

  const handleEmployeeChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setFormIsChecked(false);
    setEmployeeForm(prev => ({
      ...prev,
      displayOnBookingTypes: checked
        ? prev.displayOnBookingTypes
          ? [...prev.displayOnBookingTypes, EDisplayOnBookingType.Employee]
          : [EDisplayOnBookingType.Employee]
        : prev.displayOnBookingTypes?.filter(el => el !== EDisplayOnBookingType.Employee),
    }));
  };

  const handleDMSConsultantChange: TDMSConsultantChange = (e, value) => {
    setFormIsChecked(false);
    setEmployeeForm(prev => ({ ...prev, dmsId: value ? value.dmsId : null }));
  };

  const handleRoleChange = (e: any, value: string | null) => {
    setFormIsChecked(false);
    setEmployeeForm(prev => ({
      ...prev,
      role: value as TRole,
      dmsId: null,
      type: null,
      displayOnBookingTypes: value === 'Advisor' ? prev.displayOnBookingTypes : [],
    }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<{}>, newVal: number) => {
    setFormIsChecked(false);
    if (newVal) {
      setEmployeeForm(prev => ({
        ...prev,
        technicianLevel: newVal as TTechnicianLevel,
      }));
    }
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
        {form.role === Roles.ServiceDirector ? (
          <TextField
            disabled
            value={null}
            placeholder="Select Service Center"
            fullWidth
            label="Service Center"
          />
        ) : (
          <Autocomplete
            disabled={isEdit}
            options={shortSC}
            onChange={handleSelectChange}
            getOptionLabel={i => i.name}
            isOptionEqualToValue={(o, s) => o.id === s.id}
            loading={shortLoading}
            value={form.serviceCenter || null}
            renderInput={autocompleteRender({
              label: 'Service center',
              fullWidth: true,
              placeholder: 'Select Service Center',
              error: !form.serviceCenter && formIsChecked,
            })}
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
            error: !form.role && formIsChecked
          })}
        />
      </Grid>
      <Grid item xs={12}>
        <Divider color="#DADADA" style={{ margin: 0 }} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Autocomplete
          options={dmsOptions}
          onChange={handleDMSConsultantChange}
          getOptionLabel={i => (i.fullName ? `${i.fullName} - ${i.dmsId}` : `${i.dmsId}`)}
          isOptionEqualToValue={(o, s) => o.id === s.id}
          disabled={!form.role || shortLoading || loadingDMSAdvisors}
          loading={shortLoading || loadingDMSAdvisors}
          value={dmsAdvisor ?? null}
          renderInput={autocompleteRender({
            label: 'Assign Employee from DMS',
            fullWidth: true,
            placeholder: 'Assign Employee from DMS',
          })}
        />
      </Grid>
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
      {form.role === Roles.Technician ? (
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
                  error={!form.hourlyRate && formIsChecked}
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
                  error={!form.overtimeRate && formIsChecked}
                  value={form.overtimeRate}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <ToggleButtons
              value={form.technicianLevel}
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
      ) : null}
      {form.role === Roles.Advisor ? (
        <>
          <Grid item xs={12} sm={6} container>
            <Grid item xs={12}>
              <div className={classes.switchersTitle}>Display On Booking Flow</div>
            </Grid>

            <Grid item xs={6}>
              <FormControlLabel
                className={classes.switcher}
                labelPlacement="start"
                control={
                  <Switch
                    disabled={!form.dmsId}
                    name="selfService"
                    onChange={handleSelfServiceChange}
                    checked={form.displayOnBookingTypes?.includes(
                      EDisplayOnBookingType.SelfService
                    )}
                    color="primary"
                  />
                }
                label={<span>Self Service</span>}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                labelPlacement="start"
                className={classes.switcher}
                control={
                  <Switch
                    disabled={!form.dmsId}
                    name="employee"
                    onChange={handleEmployeeChange}
                    checked={form.displayOnBookingTypes?.includes(EDisplayOnBookingType.Employee)}
                    color="primary"
                  />
                }
                label={<span>Employee</span>}
              />
            </Grid>
          </Grid>
        </>
      ) : null}
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
