import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { autocompleteRender } from '../../../../../../utils/autocompleteRenders';
import { Autocomplete } from '@mui/material';
import { useAutocompleteStyles } from '../../../../../../hooks/styling/useAutocompleteStyles';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../store/rootReducer';
import {
  removeDuplicates,
  upperCase,
} from '../../../../../../features/admin/MaintenancePackages/AddPackageModal/parts/MakeAndModel/utils';
import { IMake } from '../../../../../../api/types';
import { ApplyToAll } from '../../../../../../features/admin/MaintenancePackages/AddPackageModal/parts/constants';
import Checkbox from '../../../../../../components/formControls/Checkbox/Checkbox';
import { CheckBoxOutlineBlank, CheckBoxOutlined } from '@mui/icons-material';
import { CriteriaI } from '../../types';

interface RuleModelsProps {
  selectedModels: number[];
  setSelectedModels: React.Dispatch<React.SetStateAction<number[]>>;
  handleRuleChange: (index: number, field: keyof CriteriaI, newValue: string) => void;
  index: number;
  isEdit: boolean;
}

const RuleModels = ({
  selectedModels,
  setSelectedModels,
  handleRuleChange,
  index,
  isEdit,
}: RuleModelsProps) => {
  const { classes } = useAutocompleteStyles();
  const { makes: makesFromDb } = useSelector((state: RootState) => state.vehicleDetails);
  const [models, setModels] = useState<string[]>([]);

  const makes = useMemo(
    () =>
      makesFromDb.map(make => ({
        ...make,
        models: make.models.filter(model => model.name !== 'OTHER'),
      })),
    [makesFromDb]
  );

  const filteredMakes = useMemo(() => makes.filter(item => item.id), [makes]);

  const selectedMakeValues = useMemo(() => filteredMakes.map(make => make.name), [filteredMakes]);

  const selectedModelValues = useMemo(
    () =>
      filteredMakes
        .map(make => make.models)
        .flat(1)
        .filter(item => selectedModels.includes(item.id))
        .map(model => model.name),
    [filteredMakes, selectedModels]
  );

  useEffect(() => {
    const sorted = getSortedModelsOptions(filteredMakes);
    setModels(removeDuplicates(sorted));
  }, [filteredMakes]);

  const sortModels = (a: string, b: string) => {
    return upperCase(selectedModelValues).includes(a.toUpperCase())
      ? upperCase(selectedModelValues).includes(b.toUpperCase())
        ? 0
        : -1
      : 1;
  };

  const getSortedModelsOptions = useCallback(
    (makesFromDB: IMake[]): string[] => {
      const data: string[] = makesFromDB
        .map(make => make.models.map(model => model.name))
        .flat(1)
        .sort(sortModels);
      if (data.length) data.unshift(ApplyToAll);
      return removeDuplicates(data);
    },
    [selectedModelValues]
  );

  const getFilteredModels = (): string[] => {
    const data = models.filter(el => el !== ApplyToAll).sort(sortModels);
    if (data.length) data.unshift(ApplyToAll);
    return data;
  };

  const renderModelOption = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (props: any, option: any) => {
      const filteredMakes = makes.filter(item =>
        upperCase(selectedMakeValues).includes(item.name.toUpperCase())
      );
      const allModelsSelected = filteredMakes.length
        ? Boolean(
            !filteredMakes
              .map(item => item.models)
              .flat(1)
              .find(model => !upperCase(selectedModelValues).includes(model.name.toUpperCase()))
          )
        : false;

      const checked =
        upperCase(selectedModelValues).includes(option.toUpperCase()) || allModelsSelected;
      return (
        <li
          style={{ display: 'flex', alignItems: 'center' }}
          {...props}
          key={option + Math.random()}
        >
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
          {option}
        </li>
      );
    },
    [selectedModelValues]
  );

  const onModelChange = (e: React.SyntheticEvent, value: string[]) => {
    let updatedModels: number[] = [];
    const filteredModels = filteredMakes.map(item => item.models.map(model => model.id)).flat(1);
    if (value.includes(ApplyToAll)) {
      if (filteredModels.length && value.length === filteredModels.length + 1) {
        setSelectedModels([]);
        updatedModels = [];
      } else {
        setSelectedModels(filteredModels);
        updatedModels = filteredModels;
      }
    } else {
      const selectedModelByCheckbox = filteredMakes.flatMap(make =>
        make.models.filter(model => value.includes(model.name)).map(model => model.id)
      );
      setSelectedModels(selectedModelByCheckbox);
      updatedModels = selectedModelByCheckbox;
    }
    handleRuleChange(index, 'value', updatedModels.join(', '));
    handleRuleChange(index, 'operator', 'Equal');
  };

  return (
    <div style={{ width: !isEdit ? '42%' : '39%' }}>
      <Autocomplete
        multiple
        style={{ marginBottom: 10 }}
        classes={classes}
        disablePortal
        disabled={!isEdit}
        options={getFilteredModels()}
        disableCloseOnSelect
        onChange={onModelChange}
        renderOption={renderModelOption}
        getOptionLabel={o => o ?? null}
        isOptionEqualToValue={(o, v) => o.toLowerCase() === v.toLowerCase()}
        value={selectedModelValues}
        renderInput={autocompleteRender({
          label: 'Vehicle Model',
          placeholder: 'Select Vehicle Model',
        })}
      />
    </div>
  );
};

export default RuleModels;
