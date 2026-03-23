import React from 'react';
import {
  Autocomplete,
  AutocompleteRenderOptionState,
  Button,
  Checkbox,
  Tooltip,
} from '@mui/material';
import { IData } from '../../../../components/DragAndDrop/types';
import { autocompleteRender } from '../../../../utils/autocompleteRenders';
import { useStyles } from './styles';
import { useAutocompleteStyles } from '../../../../hooks/styling/useAutocompleteStyles';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { Delete } from '@mui/icons-material';

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
    (label: (el: any) => string) =>
    (
      props: React.HTMLAttributes<HTMLLIElement>,
      option: any,
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
        renderTags={(value: IData[], getTagProps) => {
          const allSelected = isEditing
            ? value.length === filteredGlobalModels.length
            : value.length === filteredGlobalMakes.length;

          if (allSelected) {
            const props = getTagProps({ index: 0 });
            return (
              <div {...props}>
                <div className={autocompleteClasses.classes.tag}>
                  {isEditing ? 'All models' : 'All makes'}
                  <Delete
                    onClick={() => {
                      isEditing ? setModelsToAdd([]) : setMakesToAdd([]);
                    }}
                    style={{ cursor: 'pointer', marginLeft: 4 }}
                  />
                </div>
              </div>
            );
          }

          // Calculate dynamic max visible tags based on text length
          const calculateMaxVisibleTags = () => {
            if (value.length === 0) return 0;

            // Get the total length of all tags
            const totalLength = value.reduce((sum, item) => sum + item.text.length, 0);

            // If we have 3 or fewer items and all are very short (under 5 chars), show all
            if (value.length <= 3 && value.every(item => item.text.length <= 5)) {
              return value.length;
            }

            // If average length is very long (over 15 chars), show only 1 tag
            if (totalLength / value.length > 15) return 1;

            // If average length is medium (over 8 chars), show 2 tags
            if (totalLength / value.length > 8) return 2;

            // For shorter text, show up to 3 tags
            return 2;
          };

          const maxVisibleTags = calculateMaxVisibleTags();
          const visibleTags = value.slice(0, maxVisibleTags);
          const remainingCount = value.length - maxVisibleTags;

          return (
            <>
              {visibleTags.map((option, index) => {
                const props = getTagProps({ index });
                return (
                  <div {...props}>
                    <Tooltip title={option.text} arrow placement="top">
                      <div className={autocompleteClasses.classes.tag}>
                        <div
                          style={{
                            maxWidth: value.length > 1 ? '150px' : '230px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {option.text}
                        </div>
                        {props.onDelete && (
                          <Delete
                            onClick={props.onDelete}
                            style={{ cursor: 'pointer', flexShrink: 0 }}
                          />
                        )}
                      </div>
                    </Tooltip>
                  </div>
                );
              })}
              {remainingCount > 0 && (
                <div {...getTagProps({ index: maxVisibleTags })}>
                  <Tooltip
                    title={
                      <React.Fragment>
                        {value.slice(maxVisibleTags).map(option => (
                          <div key={option.id}>{option.text}</div>
                        ))}
                      </React.Fragment>
                    }
                    arrow
                    placement="top"
                  >
                    <div className={autocompleteClasses.classes.tag}>+{remainingCount} others</div>
                  </Tooltip>
                </div>
              )}
            </>
          );
        }}
        onChange={(_, value) => {
          isEditing ? onChangeModels(value) : onChangeMakes(value);
        }}
        value={isEditing ? modelsToAdd : makesToAdd}
        disabled={false}
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
