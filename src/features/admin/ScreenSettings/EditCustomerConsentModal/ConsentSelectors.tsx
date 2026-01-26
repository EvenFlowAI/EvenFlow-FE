import React, { useCallback, useState } from 'react';
import { Autocomplete, Grid } from '@mui/material';
import { customerTypeOptions, yearOptions } from './constants';
import { EUserType } from '../../../../store/reducers/appointmentFrameReducer/types';
import {
  autocompleteOptionsRender,
  autocompleteRender,
} from '../../../../utils/autocompleteRenders';
import { IMake, IModel } from '../../../../api/types';
import { TForm } from './types';
import { TOption } from '../../ServiceBookModal/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';

interface ConsentSelectorsProps {
  form: TForm;
  formIsChecked: boolean;
  setFormIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
  setForm: React.Dispatch<React.SetStateAction<TForm>>;
}

const ConsentSelectors = ({
  form,
  formIsChecked,
  setFormIsChecked,
  setForm,
}: ConsentSelectorsProps) => {
  const [modelsOptions, setModelsOptions] = useState<IModel[]>([]);
  const { makes } = useSelector(({ vehicleDetails }: RootState) => vehicleDetails);

  const onModelChange = useCallback((e: React.SyntheticEvent, value: IModel[]) => {
    setFormIsChecked(false);
    setForm(prev => ({ ...prev, models: value }));
  }, []);

  const onAutocompleteChange =
    (name: keyof TForm) => (e: React.SyntheticEvent, value: string | null) => {
      setFormIsChecked(false);
      setForm(prev => ({ ...prev, [name]: value ? +value : null }));
    };

  const onCustomerTypeChange = (e: React.SyntheticEvent, value: TOption | null) => {
    setFormIsChecked(false);
    setForm(prev => ({ ...prev, customerType: value ? (value.value as EUserType) : null }));
  };

  const getSortedModels = () => {
    const otherModels = modelsOptions.filter(model => model.name.toUpperCase().includes('OTHER'));
    const nonOtherModels = modelsOptions.filter(
      model => !model.name.toUpperCase().includes('OTHER')
    );

    // Keep only the first OTHER model if it exists
    const uniqueOtherModel = otherModels.length > 0 ? [otherModels[0]] : [];

    return [...nonOtherModels, ...uniqueOtherModel].sort((a, b) =>
      form.models.find(model => model.id === a.id)
        ? form.models.find(model => model.id === b.id)
          ? 0
          : -1
        : 1
    );
  };

  const getSortedMakes = () => {
    return [...makes].sort((a, b) =>
      form.makes.find(make => make.id === a.id)
        ? form.makes.find(make => make.id === b.id)
          ? 0
          : -1
        : 1
    );
  };

  const onMakeChange = useCallback((e: React.SyntheticEvent, value: IMake[]) => {
    setFormIsChecked(false);
    setForm(prev => ({ ...prev, makes: value }));
    setModelsOptions(value.map(make => make.models).flat());
    setForm(prev => ({
      ...prev,
      models: prev.models.filter(item =>
        value.find(make => make.models.find(model => model.id === item.id))
      ),
    }));
  }, []);

  return (
    <>
      <Grid item xs={12} sm={6} md={4}>
        <Autocomplete
          options={customerTypeOptions}
          isOptionEqualToValue={(o, v) => o.value === v.value}
          getOptionLabel={i => i.name}
          value={
            customerTypeOptions.find(el => (el.value as EUserType) === form.customerType) ?? null
          }
          onChange={onCustomerTypeChange}
          renderInput={autocompleteRender({
            label: 'Customer Type (New, Existing)',
            placeholder: 'Customer Type (New, Existing)',
          })}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Autocomplete
          style={{ marginBottom: 10 }}
          options={yearOptions}
          isOptionEqualToValue={(option, value) => option === value}
          value={form.modelYearFrom?.toString() ?? ''}
          onChange={onAutocompleteChange('modelYearFrom')}
          renderInput={autocompleteRender({
            label: 'Vehicle Year From',
            placeholder: 'Vehicle Year From',
            error:
              formIsChecked &&
              ((!!form.modelYearFrom &&
                !!form.modelYearTo &&
                form.modelYearFrom > form.modelYearTo) ||
                (!!form.modelYearTo && !form.modelYearFrom)),
          })}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Autocomplete
          style={{ marginBottom: 10 }}
          options={yearOptions}
          isOptionEqualToValue={(option, value) => option === value}
          value={form.modelYearTo?.toString() ?? ''}
          onChange={onAutocompleteChange('modelYearTo')}
          renderInput={autocompleteRender({
            label: 'Vehicle Year To',
            placeholder: 'Vehicle Year To',
            error:
              formIsChecked &&
              ((!!form.modelYearFrom &&
                !!form.modelYearTo &&
                form.modelYearFrom > form.modelYearTo) ||
                (!!form.modelYearFrom && !form.modelYearTo)),
          })}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Autocomplete
          multiple
          style={{ marginBottom: 10 }}
          ChipProps={{
            color: 'primary',
            style: { borderRadius: 4 },
            size: 'small',
          }}
          options={getSortedMakes()}
          disableCloseOnSelect
          getOptionLabel={i => i.name}
          isOptionEqualToValue={(o, v) => o.id === v.id}
          renderOption={autocompleteOptionsRender(e => e.name)}
          value={form.makes}
          onChange={onMakeChange}
          renderInput={autocompleteRender({
            label: 'Vehicle Makes',
            placeholder: 'Vehicle Makes',
          })}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <Autocomplete
          multiple
          style={{ marginBottom: 10 }}
          ChipProps={{
            color: 'primary',
            style: { borderRadius: 4 },
            size: 'small',
          }}
          options={getSortedModels()}
          disableCloseOnSelect
          getOptionLabel={i => i.name}
          renderOption={autocompleteOptionsRender(e => e.name)}
          isOptionEqualToValue={(o, v) => o.id === v.id}
          value={form.models}
          onChange={onModelChange}
          renderInput={autocompleteRender({
            label: 'Vehicle Models',
            placeholder: 'Vehicle Models',
          })}
        />
      </Grid>
    </>
  );
};

export default ConsentSelectors;
