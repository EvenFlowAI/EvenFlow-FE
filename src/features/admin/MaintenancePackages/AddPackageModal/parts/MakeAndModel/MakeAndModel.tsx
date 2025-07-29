import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { autocompleteRender } from '../../../../../../utils/autocompleteRenders';
import { Autocomplete } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../store/rootReducer';
import Checkbox from '../../../../../../components/formControls/Checkbox/Checkbox';
import { CheckBoxOutlineBlank, CheckBoxOutlined } from '@mui/icons-material';
import { IMake } from '../../../../../../api/types';
import { removeDuplicates, removeDuplicatesV2, upperCase } from './utils';
import { useAutocompleteStyles } from '../../../../../../hooks/styling/useAutocompleteStyles';
import { ApplyToAll } from '../constants';

type MakeAndModelProps = {
  setSelectedMakes: Dispatch<SetStateAction<string[]>>;
  setSelectedMakesV2: Dispatch<SetStateAction<number[]>>;
  setSelectedModelsV2: Dispatch<SetStateAction<number[]>>;
  setSelectedModels: Dispatch<SetStateAction<string[]>>;
  selectedModels: string[];
  selectedMakes: string[];
  setFormIsChecked: Dispatch<SetStateAction<boolean>>;
  disabled: boolean;
};

const MakeAndModel: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<MakeAndModelProps>>
> = ({
  disabled,
  setSelectedMakes,
  setSelectedMakesV2,
  setSelectedModelsV2,
  selectedModels,
  selectedMakes,
  setSelectedModels,
  setFormIsChecked,
}) => {
  const { makes: makesFromDB } = useSelector((state: RootState) => state.packages);
  const [models, setModels] = useState<string[]>([]);
  const { classes } = useAutocompleteStyles();

  const filteredMakes = useMemo(
    () => makesFromDB.filter(item => upperCase(selectedMakes).includes(item.name.toUpperCase())),
    [makesFromDB, selectedMakes]
  );

  useEffect(() => {
    const sorted = getSortedModelsOptions(filteredMakes);
    setModels(removeDuplicates(sorted));
  }, [filteredMakes]);

  const sortMakes = (a: string, b: string) => {
    return upperCase(selectedMakes).includes(a.toUpperCase())
      ? upperCase(selectedMakes).includes(b.toUpperCase())
        ? 0
        : -1
      : 1;
  };

  const sortModels = (a: string, b: string) => {
    return upperCase(selectedModels).includes(a.toUpperCase())
      ? upperCase(selectedModels).includes(b.toUpperCase())
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
    [selectedMakes]
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
    [selectedModels]
  );

  const renderMakeOption = useCallback(
    (props: any, option: any) => {
      const currentOptionSelected = upperCase(selectedMakes).includes(option.toUpperCase());
      const allSelected = Boolean(
        !makesFromDB.find(make => !upperCase(selectedMakes).includes(make.name.toUpperCase()))
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
    [makesFromDB, selectedMakes]
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
        upperCase(selectedMakes).includes(item.name.toUpperCase())
      );
      const allModelsSelected = filteredMakes.length
        ? Boolean(
            !filteredMakes
              .map(item => item.models)
              .flat(1)
              .find(model => !upperCase(selectedModels).includes('any'))
          )
        : false;

      const checked = upperCase(selectedModels).includes(option.toUpperCase()) || allModelsSelected;
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
    [selectedModels, selectedMakes]
  );

  const onMakeChange = (e: React.SyntheticEvent, value: string[]) => {
    setFormIsChecked(false);
    if (value.includes(ApplyToAll)) {
      if (makesFromDB.length && value.length === makesFromDB.length + 1) {
        setSelectedModels([]);
        setSelectedMakes([]);
        setSelectedMakesV2([]);
        setSelectedModelsV2([]);
      } else {
        setSelectedMakes(() => makesFromDB.map(item => item.name));
        setSelectedMakesV2(() => makesFromDB.map(item => item.id));
        setInitialModels();
      }
    } else {
      setSelectedMakes(value);

      const selectedMakeIds = value.map(
        make => makesFromDB.find(makeFromDB => makeFromDB.name === make)?.id || 0
      );
      setSelectedMakesV2(selectedMakeIds);

      // for clear models when delete makes
      setSelectedModelsV2(prev =>
        prev.filter(modelId => {
          return filteredMakes.some(
            make => value.includes(make.name) && make.models.some(model => model.id === modelId)
          );
        })
      );

      setSelectedModels(prev =>
        prev.filter(modelName => {
          return filteredMakes.some(
            make => value.includes(make.name) && make.models.some(model => model.name === modelName)
          );
        })
      );

      // for all clears
      if (value.length === 0) {
        setSelectedModelsV2([]);
        setSelectedModels([]);
      }
    }
  };

  const onModelChange = (e: React.SyntheticEvent, value: string[]) => {
    setFormIsChecked(false);
    const filteredModels = filteredMakes.map(item => item.models.map(model => model.name)).flat(1);
    const filteredModelsV2 = filteredMakes.map(item => item.models.map(model => model.id)).flat(1);
    const modelsSet = removeDuplicates(filteredModels);
    const modelsSetV2 = removeDuplicatesV2(filteredModelsV2);
    if (value.includes(ApplyToAll)) {
      if (modelsSet.length && value.length === modelsSet.length + 1) {
        setSelectedModels([]);
        setSelectedModelsV2([]);
      } else {
        setSelectedModels(modelsSet);
        setSelectedModelsV2(modelsSetV2);
      }
    } else {
      setSelectedModels(value);
      setSelectedModelsV2(
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
        value={selectedMakes}
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
        value={selectedModels}
        renderInput={autocompleteRender({
          label: 'Vehicle Model',
          placeholder: 'Select Vehicle Model',
        })}
      />
    </div>
  );
};

export default MakeAndModel;
