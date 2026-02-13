import React, { Dispatch, SetStateAction } from 'react';
import { Roles } from '../../../../../../types/types';
import { autocompleteRender } from '../../../../../../utils/autocompleteRenders';
import { Autocomplete } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../../store/rootReducer';
import { IServiceCenter } from '../../../../../../store/reducers/serviceCenters/types';
import { loadDMSAdvisors } from '../../../../../../store/reducers/employees/actions';
import { TEmployeeForm } from '../../types';

interface ServiceCenterFormProps {
  isEdit: boolean;
  initialForm: TEmployeeForm;
  setFormIsChecked: Dispatch<SetStateAction<boolean>>;
  setEmployeeForm: Dispatch<SetStateAction<TEmployeeForm>>;
  form: TEmployeeForm;
  formIsChecked: boolean;
}

const ServiceCenterForm = ({
  isEdit,
  initialForm,
  form,
  formIsChecked,
  setFormIsChecked,
  setEmployeeForm,
}: ServiceCenterFormProps) => {
  const { shortSC, shortLoading } = useSelector((state: RootState) => state.serviceCenters);
  const dispatch = useDispatch();

  const handleSelectChange = (e: React.SyntheticEvent, value: IServiceCenter | null) => {
    setFormIsChecked(false);
    if (value?.id) {
      dispatch(loadDMSAdvisors(value.id));
    }
    setEmployeeForm(prev => ({ ...prev, serviceCenter: value ?? null }));
  };

  return (
    <Autocomplete
      disabled={isEdit || (initialForm.role === form.role && form.role !== Roles.Advisor)}
      options={shortSC}
      onChange={handleSelectChange}
      getOptionLabel={i => i.name}
      isOptionEqualToValue={(o, s) => o.id === s.id}
      loading={shortLoading}
      value={form.serviceCenter || initialForm?.serviceCenter || null}
      renderInput={autocompleteRender({
        label: 'Service center',
        fullWidth: true,
        placeholder: 'Select Service Center',
        error: !form.serviceCenter && formIsChecked,
      })}
    />
  );
};

export default ServiceCenterForm;
