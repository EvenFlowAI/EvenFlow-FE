import React, { useState, useEffect } from 'react';
import {
  BaseModal,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '../../../../components/modals/BaseModal/BaseModal';
import { Button, Divider, Checkbox } from '@mui/material';
import { DialogProps } from '../../../../components/modals/BaseModal/types';
import { Autocomplete, AutocompleteRenderOptionState } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { useStyles } from './styles';
import { ReactComponent as AttentionIcon } from '../../../../assets/img/attention.svg';
import { useAutocompleteStyles } from '../../../../hooks/styling/useAutocompleteStyles';
import DragAndDrop from '../../../../components/DragAndDrop/DragAndDrop';
import { autocompleteRender } from '../../../../utils/autocompleteRenders';
import {
  createMake,
  loadGlobalModels,
  updateModel,
} from '../../../../store/reducers/vehicleDetails/actions';
import { useDispatch } from 'react-redux';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { IData } from '../../../../components/DragAndDrop/types';
import { setCurrentMake } from '../../../../store/reducers/vehicleDetails/actions';
type TAddMakeModalProps = DialogProps & {
  isEditing?: boolean;
};

const style = {
  padding: 12,
  backgroundColor: '#F7F8FB',
  border: '1px solid #DADADA',
  width: '238px',
  height: '576px',
  gap: '8px',
  overflowX: 'auto',
  overflowY: 'auto',
};

export const AddMakeModelModal: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TAddMakeModalProps>>
> = ({ isEditing, onClose, ...props }) => {
  const dispatch = useDispatch();
  const { currentMake, globalMakes, globalModels, makes } = useSelector(
    (state: RootState) => state.vehicleDetails
  );
  const { selectedSC } = useSCs();
  const filteredMakes = makes
    .filter(el => !el.isReadOnly)
    .map(el => ({
      id: el.id,
      text: el.name,
    }));

  const filteredModels = currentMake?.models
    .filter(el => !el.isReadOnly)
    .map(el => ({
      id: el.globalId,
      text: el.name,
    }));
  const [configuredMakes, setConfiguredMakes] = useState<IData[]>(filteredMakes);
  const [configuredModels, setConfiguredModels] = useState<IData[]>(filteredModels ?? []);
  const [makesToAdd, setMakesToAdd] = useState<IData[]>([]);
  const [modelsToAdd, setModelsToAdd] = useState<IData[]>([]);
  const { classes } = useStyles();
  const autocompleteClasses = useAutocompleteStyles();
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

  const onCloseModal = () => {
    dispatch(setCurrentMake(null));
    onClose();
  };

  const autocompleteOptionsRender =
    (label: (el: any) => string) =>
    (
      props: React.HTMLAttributes<HTMLLIElement>,
      option: any,
      state: AutocompleteRenderOptionState
    ) => {
      if (option.name === 'Select All') {
        return (
          <li
            style={{ display: 'flex', alignItems: 'center' }}
            key={option + new Date()}
            {...props}
          >
            <Checkbox
              size="small"
              style={{ marginRight: 8, padding: 0 }}
              checked={filteredGlobalMakes.length === makesToAdd.length}
            />
            {label(option)}
          </li>
        );
      }
      return (
        <li style={{ display: 'flex', alignItems: 'center' }} key={option + new Date()} {...props}>
          <Checkbox size="small" style={{ marginRight: 8, padding: 0 }} checked={state.selected} />
          {label(option)}
        </li>
      );
    };
  const selectAll = { text: 'Select All', id: 0 } as IData;

  const onChangeMakes = (value: IData[]) => {
    if (value.find(el => el.text === 'Select All')) {
      setMakesToAdd(filteredGlobalMakes);
    } else {
      setMakesToAdd(value);
    }
  };

  const onChangeModels = (value: IData[]) => {
    if (value.find(el => el.text === 'Select All')) {
      setModelsToAdd(filteredGlobalModels);
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

  const onSaveMakes = () => {
    if (selectedSC?.id) {
      const globalIds = [
        ...configuredMakes.map(el => el.id),
        ...globalMakes.filter(el => el.isReadOnly).map(el => el.id),
      ];
      dispatch(
        createMake({
          serviceCenterId: selectedSC?.id,
          globalIds,
        })
      );
      onCloseModal();
    }
  };

  const onSaveModels = () => {
    if (selectedSC?.id && currentMake?.globalId) {
      dispatch(
        updateModel(selectedSC?.id, currentMake?.globalId, [
          ...configuredModels.map(el => el.id),
          ...globalModels.filter(el => el.vinModel === 'OTHER').map(el => el.id),
        ])
      );
      onCloseModal();
    }
  };
  useEffect(() => {
    if (currentMake) {
      dispatch(loadGlobalModels(currentMake.globalId));
    }
  }, [currentMake]);

  useEffect(() => {
    const filteredMakes = makes
      .filter(el => !el.isReadOnly)
      .map(el => ({
        id: el.globalId,
        text: el.name,
      }));

    setConfiguredMakes(filteredMakes);
  }, [makes]);

  useEffect(() => {
    const filteredModels = currentMake?.models
      .filter(el => !el.isReadOnly)
      .map(el => ({
        id: el.globalId,
        text: el.name,
      }));
    setConfiguredModels(filteredModels ?? []);
  }, [currentMake]);

  return (
    <BaseModal {...props} width={810} onClose={onCloseModal}>
      <DialogTitle onClose={onCloseModal}>
        {isEditing ? `${currentMake?.name} Model Options` : 'Make options'}
      </DialogTitle>
      <DialogContent>
        <div className={classes.wrapper}>
          <div className={classes.firstColumnLayout}>
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
                  style: { borderRadius: 4 },
                  size: 'small',
                }}
                options={[selectAll, ...(isEditing ? filteredGlobalModels : filteredGlobalMakes)]}
                getOptionLabel={option => option.text}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderOption={autocompleteOptionsRender(e => e.text)}
                onChange={(_, value) => {
                  isEditing ? onChangeModels(value) : onChangeMakes(value);
                }}
                value={isEditing ? modelsToAdd : makesToAdd}
                disabled={false}
                renderInput={params =>
                  autocompleteRender({
                    ...params,
                    label: 'Add Makes',
                    fullWidth: true,
                    placeholder: 'Search Makes',
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
            <div className={classes.attentionWrapper}>
              You can drag and drop the configured {isEditing ? 'models' : 'makes'} to rearrange the
              <br />
              order that is presented in the drop-down menu on the booking flow
              <AttentionIcon />
            </div>
          </div>

          <div>
            <div className={classes.fieldTitle}>
              {isEditing ? 'configured models' : 'configured makes'}
            </div>
            <DragAndDrop
              isEditing={isEditing ?? false}
              data={isEditing ? configuredModels : configuredMakes}
              setData={isEditing ? setConfiguredModels : setConfiguredMakes}
              style={style}
            />
          </div>
        </div>
      </DialogContent>
      <Divider style={{ margin: 0 }} />
      <DialogActions>
        <div className={classes.buttonsWrapper}>
          <Button onClick={onCloseModal} className={classes.cancelButton}>
            Cancel
          </Button>
          <Button
            onClick={() => (isEditing ? onSaveModels() : onSaveMakes())}
            className={classes.saveButton}
          >
            Save
          </Button>
        </div>
      </DialogActions>
    </BaseModal>
  );
};
