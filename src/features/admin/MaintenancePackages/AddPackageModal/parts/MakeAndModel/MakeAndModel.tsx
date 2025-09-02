import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { autocompleteRender } from '../../../../../../utils/autocompleteRenders';
import { Autocomplete } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../store/rootReducer';
import Checkbox from '../../../../../../components/formControls/Checkbox/Checkbox';
import { CheckBoxOutlineBlank, CheckBoxOutlined } from '@mui/icons-material';
import { IMake } from '../../../../../../api/types';
import { removeDuplicates, upperCase } from './utils';
import { useAutocompleteStyles } from '../../../../../../hooks/styling/useAutocompleteStyles';
import { ApplyToAll } from '../constants';

type MakeAndModelProps = {
  setSelectedMakes: Dispatch<SetStateAction<number[]>>;
  setSelectedModels: Dispatch<SetStateAction<number[]>>;
  selectedModels: number[];
  selectedMakes: number[];
  setFormIsChecked: Dispatch<SetStateAction<boolean>>;
  disabled: boolean;
};

const MakeAndModel: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<MakeAndModelProps>>
> = ({
  disabled,
  setSelectedMakes,
  selectedModels,
  selectedMakes,
  setSelectedModels,
  setFormIsChecked,
}) => {
  const { makes: makesFromDB } = useSelector((state: RootState) => state.packages);
  const [models, setModels] = useState<string[]>([]);
  const { classes } = useAutocompleteStyles();

  const filteredMakes = useMemo(
    () => makesFromDB.filter(item => selectedMakes.includes(item.id)),
    [makesFromDB, selectedMakes]
  );

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

  const sortMakes = (a: string, b: string) => {
    return upperCase(selectedMakeValues).includes(a.toUpperCase())
      ? upperCase(selectedMakeValues).includes(b.toUpperCase())
        ? 0
        : -1
      : 1;
  };

  const sortModels = (a: string, b: string) => {
    return upperCase(selectedModelValues).includes(a.toUpperCase())
      ? upperCase(selectedModelValues).includes(b.toUpperCase())
        ? 0
        : -1
      : 1;
  };

  const getSortedMakesOptions = useCallback(
    (makesFromDB: IMake[]): string[] => {
      const data: string[] = makesFromDB.map(make => make.name).sort(sortMakes);
      if (data.length) data.unshift(ApplyToAll);
      return data;
    },
    [selectedMakeValues]
  );

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

  const renderMakeOption = useCallback(
    (props: any, option: any) => {
      const currentOptionSelected = upperCase(selectedMakeValues).includes(option.toUpperCase());
      const allSelected = Boolean(
        !makesFromDB.find(make => !upperCase(selectedMakeValues).includes(make.name.toUpperCase()))
      );
      const checked = currentOptionSelected || allSelected;
      return (
        <li style={{ display: 'flex', alignItems: 'center' }} {...props} key={option}>
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
    [makesFromDB, selectedMakeValues]
  );

  const getFilteredModels = (): string[] => {
    const data = models.filter(el => el !== ApplyToAll).sort(sortModels);
    if (data.length) data.unshift(ApplyToAll);
    return data;
  };

  const setInitialModels = () => {
    const sorted = getSortedModelsOptions(makesFromDB);
    setModels(removeDuplicates(sorted));
  };

  const renderModelOption = useCallback(
    (props: any, option: any) => {
      const filteredMakes = makesFromDB.filter(item =>
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
    [selectedModelValues, selectedMakeValues]
  );

  const onMakeChange = (e: React.SyntheticEvent, value: string[]) => {
    setFormIsChecked(false);
    if (value.includes(ApplyToAll)) {
      if (makesFromDB.length && value.length === makesFromDB.length + 1) {
        setSelectedModels([]);
        setSelectedMakes([]);
      } else {
        setSelectedMakes(() => makesFromDB.map(item => item.id));
        setInitialModels();
      }
    } else {
      const selectedMakeIds = value.map(
        make => makesFromDB.find(makeFromDB => makeFromDB.name === make)?.id || 0
      );
      setSelectedMakes(selectedMakeIds);

      // for clear models when delete makes
      setSelectedModels(prev =>
        prev.filter(modelId => {
          return filteredMakes.some(
            make => value.includes(make.name) && make.models.some(model => model.id === modelId)
          );
        })
      );

      // for all clears
      if (value.length === 0) {
        setSelectedModels([]);
      }
    }
  };

  const onModelChange = (e: React.SyntheticEvent, value: string[]) => {
    setFormIsChecked(false);
    const filteredModels = filteredMakes.map(item => item.models.map(model => model.id)).flat(1);
    if (value.includes(ApplyToAll)) {
      if (filteredModels.length && value.length === filteredModels.length + 1) {
        setSelectedModels([]);
      } else {
        setSelectedModels(filteredModels);
      }
    } else {
      setSelectedModels(
        filteredMakes.flatMap(make =>
          make.models.filter(model => value.includes(model.name)).map(model => model.id)
        )
      );
    }
  };

  return (
    <div>
      <Autocomplete
        multiple
        style={{ marginBottom: 10 }}
        classes={classes}
        disabled={disabled}
        options={getSortedMakesOptions(makesFromDB)}
        disableCloseOnSelect
        onChange={onMakeChange}
        getOptionLabel={o => o ?? null}
        isOptionEqualToValue={(o, v) => o.toLowerCase() === v.toLowerCase()}
        renderOption={renderMakeOption}
        value={selectedMakeValues}
        renderInput={autocompleteRender({
          label: 'Vehicle Make',
          placeholder: 'Select Vehicle Make',
        })}
      />
      <Autocomplete
        multiple
        style={{ marginBottom: 10 }}
        classes={classes}
        disabled={disabled}
        disablePortal
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

export default MakeAndModel;
