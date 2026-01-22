import React, { useCallback, useMemo } from 'react';
import { Autocomplete, Grid } from '@mui/material';
import {
  autocompleteOptionsRender,
  autocompleteRender,
} from '../../../../utils/autocompleteRenders';
import { TextField } from '../../../../components/formControls/TextFieldStyled/TextField';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { IMake, IModel } from '../../../../api/types';
import { ServiceBookState } from '../types';

interface VehicleAutocompleteGroupProps {
  setFormIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
  formIsChecked: boolean;
  loading: boolean;
  state: ServiceBookState;
  setState: React.Dispatch<React.SetStateAction<ServiceBookState>>;
}

const VehicleAutocompleteGroup = ({
  setFormIsChecked,
  formIsChecked,
  loading,
  state,
  setState,
}: VehicleAutocompleteGroupProps) => {
  const { podsLoading } = useSelector(({ pods }: RootState) => pods);
  const { makes } = useSelector(({ vehicleDetails }: RootState) => vehicleDetails);

  const getSortedMakes = () => {
    return [...makes].sort((a, b) =>
      state.selectedMakes.find(make => make.id === a.id)
        ? state.selectedMakes.find(make => make.id === b.id)
          ? 0
          : -1
        : 1
    );
  };

  const onMakeChange = useCallback(
    (e: React.SyntheticEvent, value: IMake[]) => {
      setState(prev => ({
        ...prev,
        selectedMakes: value,
        modelsOptions: value.map(make => make.models).flat(),
        selectedModels: prev.selectedModels.filter(item =>
          value.find(make => make.models.find(model => model.id === item.id))
        ),
      }));
    },
    [state.selectedModels]
  );

  const getSortedModels = () => {
    const uniqueModels = state.modelsOptions.reduce((acc, model) => {
      const existingModel = acc.find(m => m.name === model.name);
      if (!existingModel) {
        acc.push(model);
      } else if (state.selectedModels.find(sm => sm.id === model.id)) {
        // Replace with selected model if current one is selected
        const index = acc.findIndex(m => m.name === model.name);
        acc[index] = model;
      }
      return acc;
    }, [] as IModel[]);
    return uniqueModels.sort((a, b) =>
      state.selectedModels.find(model => model.id === a.id)
        ? state.selectedModels.find(model => model.id === b.id)
          ? 0
          : -1
        : 1
    );
  };

  const onModelChange = useCallback((e: React.SyntheticEvent, value: IModel[]) => {
    setState(prev => ({ ...prev, selectedModels: value }));
  }, []);

  const handleMileageFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormIsChecked(false);
    setState(prev => ({ ...prev, mileageFrom: e.target.value.trim() }));
  };

  const mileageFromIsInvalid = useMemo(() => {
    return (
      !Number.isInteger(+state.mileageFrom) ||
      +state.mileageFrom <= 0 ||
      (state.mileageTo ? +state.mileageFrom > +state.mileageTo : false)
    );
  }, [state.mileageFrom, state.mileageTo]);

  const handleMileageToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormIsChecked(false);
    setState(prev => ({ ...prev, mileageTo: e.target.value.trim() }));
  };

  const mileageToIsInvalid = useMemo(() => {
    return (
      !Number.isInteger(+state.mileageTo) ||
      +state.mileageTo <= 0 ||
      (state.mileageFrom ? +state.mileageFrom > +state.mileageTo : false)
    );
  }, [state.mileageFrom, state.mileageTo]);

  return (
    <>
      <Grid item xs={12} sm={12} md={6}>
        <Autocomplete
          multiple
          style={{ marginBottom: 10 }}
          disabled={podsLoading || loading}
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
          value={state.selectedMakes}
          onChange={onMakeChange}
          renderInput={autocompleteRender({
            label: 'Makes',
            placeholder: 'Select Makes',
          })}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <Autocomplete
          multiple
          disabled={podsLoading || loading}
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
          value={state.selectedModels}
          onChange={onModelChange}
          renderInput={autocompleteRender({
            label: 'Models',
            placeholder: 'Select Models',
          })}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          id="mileageFrom"
          name="mileageFrom"
          label="Mileage From"
          placeholder="Type Mileage From"
          fullWidth
          onChange={handleMileageFromChange}
          value={state.mileageFrom}
          error={state.mileageFrom ? formIsChecked && mileageFromIsInvalid : false}
          disabled={podsLoading || loading}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          id="mileageTo"
          name="mileageTo"
          label="Mileage To"
          placeholder="Type Mileage To"
          fullWidth
          onChange={handleMileageToChange}
          value={state.mileageTo}
          error={state.mileageTo ? formIsChecked && mileageToIsInvalid : false}
          disabled={podsLoading || loading}
        />
      </Grid>
    </>
  );
};

export default VehicleAutocompleteGroup;
