import React, { Dispatch, SetStateAction, useMemo } from 'react';
import { Autocomplete, Divider, Grid } from '@mui/material';
import 'react-phone-number-input/style.css';
import { TUserAccountForm } from '../types';
import { TextField } from '../../../../formControls/TextFieldStyled/TextField';
import { availableUserRoles } from '../../../../../utils/constants';
import { checkEmail, getOptions, validatePhoneNumber } from '../../../../../utils/utils';
import { superRoles } from '../../CreateEmployee/constants';
import { autocompleteRender } from '../../../../../utils/autocompleteRenders';
import { EEmployeeType } from '../../CreateEmployee/types';
import { TOption } from '../../../../../features/admin/ServiceBookModal/types';
import { TRole } from '../../../../../store/reducers/users/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';
import AddDealershipGroupForm from './AddDealershipGroupForm';
import ServiceCenterCategoryDropdown from './ServiceCenterCategoryDropdown';
import { ServiceCenterSection } from './ServiceCenterSection';
import { Roles } from '../../../../../types/types';
import { useMessage } from '../../../../../hooks/useMessage/useMessage';

type TTFormProps = {
  form: TUserAccountForm;
  formIsChecked: boolean;
  setFormIsChecked: Dispatch<SetStateAction<boolean>>;
  setEmployeeForm: Dispatch<SetStateAction<TUserAccountForm>>;
  isAdding: boolean;
  isAdminPanel: boolean;
};

export const AddUserAccountForm: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TTFormProps>>
> = ({ setEmployeeForm, setFormIsChecked, formIsChecked, form, isAdding, isAdminPanel }) => {
  const { shortLoading } = useSelector((state: RootState) => state.serviceCenters);
  const { emailError, dmsIdError } = useSelector((state: RootState) => state.roleManagement);
  const showMessage = useMessage();

  const ERROR_MESSAGES = {
    duplicateEmail: 'A user with this email already exists in the system',
    duplicateDmsId: 'A user with this DMS ID already exists in the system',
  };

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
    if (!isAdding) {
      showMessage('Previous role configurations will be changed.');
    }
    setFormIsChecked(false);
    setEmployeeForm(prev => ({
      ...prev,
      role: value as TRole,
      dmsId: null,
      type: null,
      displayOnBookingTypes: value === Roles.Advisor ? [] : [],
      serviceCenters: prev.serviceCenters.map(sc => {
        return {
          ...sc,
          dmsId: null,
          type: null,
          displayOnBookingTypes: [],
        };
      }),
    }));
  };

  const isShowScConfiguration =
    form.role &&
    form.role !== Roles.EvenFlowAccountManager &&
    form.role !== Roles.Vendor &&
    form.role !== Roles.AIBookingAgent;

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
          label="First name *"
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
          label="Last name *"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <AddDealershipGroupForm
          isAdminPanel={isAdminPanel}
          isAdding={isAdding}
          form={form}
          formIsChecked={formIsChecked}
          setEmployeeForm={setEmployeeForm}
          setFormIsChecked={setFormIsChecked}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <ServiceCenterCategoryDropdown
          form={form}
          isAdding={isAdding}
          formIsChecked={formIsChecked}
          setEmployeeForm={setEmployeeForm}
          setFormIsChecked={setFormIsChecked}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          id="email"
          name="email"
          fullWidth
          placeholder="Type Email"
          value={form.email}
          error={formIsChecked ? !checkEmail(form.email) || emailError : false}
          onChange={handleChange}
          label="Email *"
          formIsChecked={formIsChecked}
          helperText={formIsChecked ? (emailError ? ERROR_MESSAGES.duplicateEmail : '') : ''}
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
            label: 'Role *',
            fullWidth: true,
            placeholder: 'Select Role',
            error: formIsChecked && (!form.role || dmsIdError),
          })}
        />
        {dmsIdError && (
          <span style={{ fontSize: 14, color: 'red', display: 'block', marginTop: 3 }}>
            {ERROR_MESSAGES.duplicateDmsId}
          </span>
        )}
      </Grid>
      <Grid item xs={12}>
        <Divider color="#DADADA" style={{ margin: '0 0 10px 0' }} />
      </Grid>
      {isShowScConfiguration && (
        <Grid container spacing={3} style={{ marginLeft: 0 }}>
          {form.serviceCenters?.map(sc => (
            <ServiceCenterSection
              key={sc.value}
              formIsChecked={formIsChecked}
              sc={sc}
              form={form}
              setEmployeeForm={setEmployeeForm}
              setFormIsChecked={setFormIsChecked}
              employeeTypeOptions={employeeTypeOptions}
              shortLoading={shortLoading}
              isAdding={isAdding}
            />
          ))}
        </Grid>
      )}
    </Grid>
  );
};
