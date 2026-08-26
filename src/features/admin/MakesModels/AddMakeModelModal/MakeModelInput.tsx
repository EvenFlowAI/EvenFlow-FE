import React from 'react';
import { Autocomplete, AutocompleteRenderOptionState, Button, Checkbox } from '@mui/material';
import { IData } from '../../../../components/DragAndDrop/types';
import { autocompleteRender } from '../../../../utils/autocompleteRenders';
import { useStyles } from './styles';
import { useAutocompleteStyles } from '../../../../hooks/styling/useAutocompleteStyles';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { renderMakeModelTags } from './makeModelInput.helpers';

interface MakeModelInputProps {
  isEditing?: boolean;
  modelsToAdd: IData[];
  makesToAdd: IData[];
  configuredModels: IData[];
  configuredMakes: IData[];
  setModelsToAdd: (models: IData[]) => void;
  setMakesToAdd: (makes: IData[]) => void;
  setConfiguredMakes: React.Dispatch<React.SetStateAction<IData[]>>;
  setConfiguredModels: React.Dispatch<React.SetStateAction<IData[]>>;
}

const MakeModelInput = ({
  isEditing,
  modelsToAdd,
  makesToAdd,
  configuredModels,
  configuredMakes,
  setModelsToAdd,
  setMakesToAdd,
  setConfiguredMakes,
  setConfiguredModels,
}: MakeModelInputProps) => {
  const { classes } = useStyles();
  const autocompleteClasses = useAutocompleteStyles();
  const { globalMakes, globalModels } = useSelector((state: RootState) => state.vehicleDetails);
  const { currentMake } = useSelector((state: RootState) => state.vehicleDetails);
  const filteredGlobalMakes = globalMakes
    .filter(el => !el.isReadOnly)
    .map(el => ({
      id: el.id,
      text: el.vinMake,
    }));
  const filteredGlobalModels = globalModels
    .filter(el => el.vinModel !== 'OTHER')
    .map(el => ({
      id: el.id,
      text: el.vinModel,
    }));
  const selectAll = { text: 'Select All', id: 0 } as IData;

  const autocompleteOptionsRender =
    (label: (el: IData) => string) =>
    (
      props: React.HTMLAttributes<HTMLLIElement>,
      option: IData,
      state: AutocompleteRenderOptionState
    ) => {
      if (option.text === 'Select All') {
        const isAllSelected = isEditing
          ? modelsToAdd.length === filteredGlobalModels.length && modelsToAdd.length > 0
          : makesToAdd.length === filteredGlobalMakes.length && makesToAdd.length > 0;

        return (
          <li style={{ display: 'flex', alignItems: 'center' }} key={option.id} {...props}>
            <Checkbox size="small" style={{ marginRight: 8, padding: 0 }} checked={isAllSelected} />
            {label(option)}
          </li>
        );
      }

      // Check if option is already configured
      const isAlreadyConfigured = isEditing
        ? configuredModels.some(model => model.id === option.id)
        : configuredMakes.some(make => make.id === option.id);

      return (
        <li
          style={{
            display: 'flex',
            alignItems: 'center',
            opacity: isAlreadyConfigured ? 0.6 : 1,
            pointerEvents: isAlreadyConfigured ? 'none' : 'auto',
          }}
          key={option.id}
          {...props}
        >
          <Checkbox
            size="small"
            style={{ marginRight: 8, padding: 0 }}
            checked={isAlreadyConfigured || state.selected}
            disabled={isAlreadyConfigured}
          />
          {label(option)}
        </li>
      );
    };

  const onChangeMakes = (value: IData[]) => {
    // Check if Select All was clicked
    if (value.find(el => el.text === 'Select All')) {
      // If all makes are already selected, clear the selection
      if (makesToAdd.length === filteredGlobalMakes.length) {
        setMakesToAdd([]);
      } else {
        // Otherwise select all makes
        setMakesToAdd(filteredGlobalMakes);
      }
    } else {
      setMakesToAdd(value);
    }
  };

  const onChangeModels = (value: IData[]) => {
    // Check if Select All was clicked
    if (value.find(el => el.text === 'Select All')) {
      // If all models are already selected, clear the selection
      if (modelsToAdd.length === filteredGlobalModels.length) {
        setModelsToAdd([]);
      } else {
        // Otherwise select all models
        setModelsToAdd(filteredGlobalModels);
      }
    } else {
      setModelsToAdd(value);
    }
  };

  const addMakes = () => {
    const newMakes = makesToAdd.filter(
      newMake => !configuredMakes.some(existingMake => existingMake.id === newMake.id)
    );
    setConfiguredMakes(prev => [...prev, ...newMakes]);
    setMakesToAdd([]);
  };

  const addModels = () => {
    const newModels = modelsToAdd.filter(
      newModel => !configuredModels.some(existingModel => existingModel.id === newModel.id)
    );
    setConfiguredModels(prev => [...prev, ...newModels]);
    setModelsToAdd([]);
  };

  return (
    <div className={classes.inputWrapper}>
      <Autocomplete
        fullWidth
        multiple
        disableCloseOnSelect
        classes={{
          tag: autocompleteClasses.classes.tag,
          option: autocompleteClasses.classes.option,
          inputRoot: autocompleteClasses.classes.inputRoot,
        }}
        ChipProps={{
          color: 'primary',
          style: {
            borderRadius: 4,
            maxWidth: '100%',
          },
          size: 'small',
        }}
        sx={{
          '& .MuiAutocomplete-tag': {
            maxWidth: '100%',
          },
          '& .MuiAutocomplete-inputRoot': {
            flexWrap: 'nowrap',
            width: 469,
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            scrollbarWidth: 'none',
          },
        }}
        options={[selectAll, ...(isEditing ? filteredGlobalModels : filteredGlobalMakes)]}
        getOptionLabel={option => option.text}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderOption={autocompleteOptionsRender(e => e.text)}
        renderTags={(value: IData[], getTagProps) =>
          renderMakeModelTags({
            value,
            getTagProps,
            isEditing,
            filteredGlobalModels,
            filteredGlobalMakes,
            tagClassName: autocompleteClasses.classes.tag,
            setModelsToAdd,
            setMakesToAdd,
          })
        }
        onChange={(_, value) => {
          if (isEditing) {
            onChangeModels(value);
          } else {
            onChangeMakes(value);
          }
        }}
        value={isEditing ? modelsToAdd : makesToAdd}
        disabled={currentMake?.name === 'OTHER'}
        renderInput={params =>
          autocompleteRender({
            ...params,
            label: isEditing ? 'Add Models' : 'Add Makes',
            fullWidth: true,
            placeholder: isEditing
              ? modelsToAdd.length > 0
                ? ''
                : 'Search Models'
              : makesToAdd.length > 0
                ? ''
                : 'Search Makes',
          })(params)
        }
      />

      <Button
        disabled={isEditing ? !modelsToAdd.length : !makesToAdd.length}
        onClick={() => (isEditing ? addModels() : addMakes())}
        className={classes.addmakesBtn}
      >
        Add {isEditing ? 'models' : 'makes'}
      </Button>
    </div>
  );
};

export default MakeModelInput;
