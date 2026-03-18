import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { TextField } from '../../../../formControls/TextFieldStyled/TextField';
import DmsForm from './DmsForm';
import TechnicianEmployee from './TechnicianEmployee';
import AdvisorEmployee from './AdvisorEmployee';
import { Roles, TOptionForUserAccountServiceCenters } from '../../../../../types/types';
import { autocompleteRender } from '../../../../../utils/autocompleteRenders';
import { Autocomplete } from '@mui/material';
import { TOption } from '../../../../../features/admin/ServiceBookModal/types';
import { TUserAccountForm } from '../types';
import { EEmployeeType } from '../../CreateEmployee/types';
import { ReactComponent as ShowMark } from '../../../../../assets/img/ShowMark.svg';
import { ReactComponent as HideMark } from '../../../../../assets/img/HideMark.svg';
import { useDispatch } from 'react-redux';
import { loadDMSAdvisors } from '../../../../../store/reducers/employees/actions';
import { TServiceConsultant } from '../../../../../store/reducers/appointments/types';

interface ServiceCenterSectionProps {
  sc: TOptionForUserAccountServiceCenters;
  form: TUserAccountForm;
  setEmployeeForm: Dispatch<SetStateAction<TUserAccountForm>>;
  formIsChecked: boolean;
  setFormIsChecked: Dispatch<SetStateAction<boolean>>;
  employeeTypeOptions: TOption[];
  shortLoading: boolean;
}

export const ServiceCenterSection = ({
  sc,
  form,
  setEmployeeForm,
  setFormIsChecked,
  formIsChecked,
  employeeTypeOptions,
  shortLoading,
}: ServiceCenterSectionProps) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [dmsAdvisors, setDmsAdvisors] = useState<TServiceConsultant[]>([]);

  const onSuccess = (data: TServiceConsultant[]) => {
    setDmsAdvisors(data);
  };

  useEffect(() => {
    if (open) {
      dispatch(loadDMSAdvisors(sc.value, onSuccess));
    }
  }, [open]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = ({
    target: { name, value },
  }) => {
    setFormIsChecked(false);
    setEmployeeForm(prev => ({
      ...prev,
      serviceCenters: prev.serviceCenters.map(el =>
        el.value === sc.value
          ? {
              ...el,
              [name]: value ? value : null,
            }
          : el
      ),
    }));
  };

  const handleTypeChange = (e: React.SyntheticEvent<Element, Event>, value: TOption | null) => {
    setFormIsChecked(false);
    setEmployeeForm(prev => ({
      ...prev,
      serviceCenters: prev.serviceCenters.map(el =>
        el.value === sc.value
          ? {
              ...el,
              type: (value?.value as EEmployeeType) ?? null,
            }
          : el
      ),
    }));
  };

  return (
    <>
      <Grid item xs={12} sm={12}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            margin: 0,
            fontWeight: 'bold',
          }}
        >
          <span>{sc.name} Configuration</span>
          <p style={{ margin: 0, cursor: 'pointer' }} onClick={() => setOpen(!open)}>
            {open ? (
              <span>
                <HideMark />
              </span>
            ) : (
              <span>
                <ShowMark />
              </span>
            )}
          </p>
        </div>
      </Grid>

      {open && (
        <>
          <DmsForm
            sc={sc}
            dmsAdvisors={dmsAdvisors}
            form={form}
            setEmployeeForm={setEmployeeForm}
            setFormIsChecked={setFormIsChecked}
          />
          <Grid item xs={12} sm={6}>
            <TextField
              label="Position"
              id={`position-${sc.value}`}
              value={sc.position}
              name="position"
              placeholder="Type position"
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <TechnicianEmployee
            sc={sc}
            setEmployeeForm={setEmployeeForm}
            form={form}
            handleChange={handleChange}
            setFormIsChecked={setFormIsChecked}
          />
          <AdvisorEmployee
            sc={sc}
            form={form}
            setFormIsChecked={setFormIsChecked}
            setEmployeeForm={setEmployeeForm}
          />
          {[Roles.Advisor, Roles.Technician].includes(form.role as Roles) ? (
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={employeeTypeOptions}
                isOptionEqualToValue={(option: TOption, value: TOption) =>
                  option.value === value.value
                }
                onChange={handleTypeChange}
                getOptionLabel={o => o.name}
                loading={shortLoading}
                value={employeeTypeOptions.find(el => el.value === sc.type) ?? null}
                renderInput={autocompleteRender({
                  label: 'Type *',
                  fullWidth: true,
                  placeholder: 'Select Type',
                  error: formIsChecked && (sc.type === null || sc.type === undefined),
                })}
              />
            </Grid>
          ) : null}
        </>
      )}
    </>
  );
};
