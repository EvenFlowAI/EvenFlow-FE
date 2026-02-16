import React, { Dispatch, SetStateAction, useMemo } from 'react';
import { Autocomplete, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { TUserAccountForm } from '../types';
import { RootState } from '../../../../../store/rootReducer';
import { TServiceConsultant } from '../../../../../store/reducers/appointments/types';
import { DmsRoles } from '../../CreateEmployee/constants';
import { autocompleteRender } from '../../../../../utils/autocompleteRenders';
import { TOptionForUserAccountServiceCenters } from '../../../../../types/types';

interface DmsFormProps {
  sc: TOptionForUserAccountServiceCenters;
  setFormIsChecked: Dispatch<SetStateAction<boolean>>;
  setEmployeeForm: Dispatch<SetStateAction<TUserAccountForm>>;
  form: TUserAccountForm;
}

const DmsForm = ({ sc, setFormIsChecked, setEmployeeForm, form }: DmsFormProps) => {
  const { shortLoading } = useSelector((state: RootState) => state.serviceCenters);
  const { loadingDMSAdvisors } = useSelector((state: RootState) => state.employees);
  const { DmsAdvisors: dmsAdvisors } = useSelector((state: RootState) => state.scEmployees);

  const handleDMSConsultantChange = (e: React.SyntheticEvent, value: TServiceConsultant | null) => {
    setFormIsChecked(false);
    setEmployeeForm(prev => ({
      ...prev,
      serviceCenters: prev.serviceCenters.map(el =>
        el.value === sc.value
          ? {
              ...el,
              dmsId: value ? value.dmsId : null,
            }
          : el
      ),
    }));
  };

  const dmsOptions = useMemo(
    () => dmsAdvisors.filter(el => el.role && form.role && DmsRoles[el.role] === form.role),
    [dmsAdvisors, form.role]
  );

  const dmsAdvisor = useMemo(
    () =>
      sc?.dmsId && dmsAdvisors.length ? dmsAdvisors.find(item => item.dmsId === sc.dmsId) : null,
    [sc?.dmsId, dmsAdvisors]
  );

  return (
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
  );
};

export default DmsForm;
