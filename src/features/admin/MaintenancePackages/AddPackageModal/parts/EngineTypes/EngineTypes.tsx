import React, { useCallback, Dispatch, SetStateAction } from 'react';
import { autocompleteRender } from '../../../../../../utils/autocompleteRenders';
import { Autocomplete } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../store/rootReducer';
import Checkbox from '../../../../../../components/formControls/Checkbox/Checkbox';
import { CheckBoxOutlineBlank, CheckBoxOutlined } from '@mui/icons-material';
import { IEngineType } from '../../../../../../store/reducers/vehicleDetails/types';
import { useAutocompleteStyles } from '../../../../../../hooks/styling/useAutocompleteStyles';

type TEngineTypesProps = {
  setSelectedEngineTypes: Dispatch<SetStateAction<IEngineType[]>>;
  selectedEngineTypes: IEngineType[];
  setFormIsChecked: Dispatch<SetStateAction<boolean>>;
  isApplyBusinessRules: boolean;
};

const EngineTypes: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TEngineTypesProps>>
> = ({ setSelectedEngineTypes, selectedEngineTypes, setFormIsChecked, isApplyBusinessRules }) => {
  const { engineTypes } = useSelector((state: RootState) => state.vehicleDetails);
  const { classes } = useAutocompleteStyles();

  const sortEngineTypes = (a: IEngineType, b: IEngineType) => {
    return selectedEngineTypes.find(el => a.id === el.id)
      ? selectedEngineTypes.find(el => b.id === el.id)
        ? 0
        : -1
      : 1;
  };

  const getSortedOptions = () => {
    return engineTypes.slice().sort(sortEngineTypes);
  };

  const renderEngineTypeOption = useCallback(
    (props: any, option: IEngineType) => {
      const checked = !!selectedEngineTypes.find(el => el.id === option.id);
      return (
        <li style={{ display: 'flex', alignItems: 'center' }} {...props} key={option.id}>
          <Checkbox
            color="primary"
            icon={
              checked ? (
                <CheckBoxOutlined htmlColor="#3855FE" />
              ) : (
                <CheckBoxOutlineBlank htmlColor="#DADADA" />
              )
            }
            checked={checked}
          />
          {option.name}
        </li>
      );
    },
    [selectedEngineTypes]
  );

  const onChange = (e: React.SyntheticEvent, value: IEngineType[]) => {
    setFormIsChecked(false);
    setSelectedEngineTypes(value);
  };

  return (
    <Autocomplete
      classes={classes}
      options={getSortedOptions()}
      disableCloseOnSelect
      multiple
      onChange={onChange}
      renderOption={renderEngineTypeOption}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={option => option.name ?? null}
      disabled={!isApplyBusinessRules}
      value={selectedEngineTypes}
      renderInput={autocompleteRender({
        label: 'Engine Types',
        placeholder: 'Select Engine Types',
      })}
    />
  );
};

export default EngineTypes;
