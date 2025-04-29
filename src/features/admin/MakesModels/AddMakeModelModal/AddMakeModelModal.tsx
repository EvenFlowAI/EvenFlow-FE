import React, { useState, useEffect, ReactNode } from 'react';
import {
  BaseModal,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '../../../../components/modals/BaseModal/BaseModal';
import { Button, Divider, Checkbox, Tooltip } from '@mui/material';
import { DialogProps } from '../../../../components/modals/BaseModal/types';
import { Autocomplete, AutocompleteRenderOptionState } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { useStyles } from './styles';
import { ReactComponent as AttentionIcon } from '../../../../assets/img/attention.svg';
import { ReactComponent as Delete } from '../../../../assets/img/delete.svg';
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
import { useConfirm } from '../../../../hooks/useConfirm/useConfirm';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

type TAddMakeModalProps = DialogProps & {
  isEditing?: boolean;
};

const style = {
  padding: 12,
  backgroundColor: '#F7F8FB',
  border: '1px solid #DADADA',
  width: '317px',
  height: '576px',
  gap: '8px',
  overflowX: 'auto',
  overflowY: 'auto',
};

interface IConfirmParams {
  title: ReactNode;
  content?: ReactNode;
  isRemove?: boolean;
  onConfirm: () => void;
}

export const AddMakeModelModal: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TAddMakeModalProps>>
> = ({ isEditing, onClose, ...props }) => {
  const dispatch = useDispatch();
  const { currentMake, globalMakes, globalModels, allMakes } = useSelector(
    (state: RootState) => state.vehicleDetails
  );
  const { selectedSC } = useSCs();
  const filteredMakes = allMakes
    .filter(el => !el.isReadOnly)
    .map(el => ({
      id: el.globalId,
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
  const { askConfirm } = useConfirm();
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
    setModelsToAdd([]);
    setMakesToAdd([]);
    setConfiguredMakes([]);
    setConfiguredModels([]);
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
      if (option.text === 'Select All') {
        const isAllSelected = isEditing
          ? modelsToAdd.length === filteredGlobalModels.length && modelsToAdd.length > 0
          : makesToAdd.length === filteredGlobalMakes.length && makesToAdd.length > 0;

        return (
          <li
            style={{ display: 'flex', alignItems: 'center' }}
            key={option + new Date()}
            {...props}
          >
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
          key={option + new Date()}
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
  const selectAll = { text: 'Select All', id: 0 } as IData;

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

  const removedMakes = allMakes
    .filter(el => !el.isReadOnly)
    .filter(make => !configuredMakes.some(configured => configured.id === make.globalId));

  const removedModels = currentMake?.models
    .filter(el => !el.isReadOnly)
    .filter(model => !configuredModels.some(configured => configured.id === model.globalId));
  const onSaveMakes = () => {
    if (selectedSC?.id) {
      const globalIds = [
        ...configuredMakes.map(el => el.id),
        ...globalMakes.filter(el => el.isReadOnly).map(el => el.id),
      ];
      if (removedMakes?.length) {
        askConfirm({
          isRemove: true,
          title:
            removedMakes?.length === 1 ? (
              `Please confirm you want to remove make ${removedMakes[0].name}!`
            ) : (
              <div>
                {`Please confirm you want to remove ${removedMakes.length} selected makes!`}
                <Tooltip
                  title={removedMakes.map(make => make.name).join(', ')}
                  arrow
                  placement="top"
                >
                  <InfoOutlinedIcon
                    style={{
                      width: 20,
                      height: 20,
                      color: '#7898FF',
                      cursor: 'help',
                      position: 'relative',
                      top: 3,
                    }}
                  />
                </Tooltip>
              </div>
            ),
          content: (
            <span>
              After removing, please check configuration settings for Packages, Service Books,
              Consent Messages, and Recalls which may have been impacted.
            </span>
          ),
          onConfirm: () =>
            dispatch(
              createMake(
                {
                  serviceCenterId: selectedSC?.id,
                  globalIds,
                },
                onCloseModal
              )
            ),
        });
      } else {
        dispatch(
          createMake(
            {
              serviceCenterId: selectedSC?.id,
              globalIds,
            },
            onCloseModal
          )
        );
      }
    }
  };

  const onSaveModels = () => {
    if (selectedSC?.id && currentMake?.globalId) {
      if (removedModels?.length) {
        askConfirm({
          isRemove: true,
          title:
            removedModels?.length === 1 ? (
              `Please confirm you want to remove model ${removedModels[0].name}!`
            ) : (
              <div>
                {`Please confirm you want to remove ${removedModels?.length} selected models`}
                <Tooltip
                  title={removedModels?.map(model => model.name).join(', ')}
                  arrow
                  placement="top"
                >
                  <InfoOutlinedIcon
                    style={{
                      width: 20,
                      height: 20,
                      color: '#7898FF',
                      cursor: 'help',
                      position: 'relative',
                      top: 3,
                    }}
                  />
                </Tooltip>
                {`!`}
              </div>
            ),
          content: (
            <span>
              After removing, please check configuration settings for Packages, Service Books,
              Consent Messages, and Recalls which may have been impacted.
            </span>
          ),
          onConfirm: () =>
            dispatch(
              updateModel(
                selectedSC?.id,
                currentMake?.globalId,
                [
                  ...configuredModels.map(el => el.id),
                  ...globalModels.filter(el => el.vinModel === 'OTHER').map(el => el.id),
                ],
                onCloseModal
              )
            ),
        });
      } else {
        dispatch(
          updateModel(
            selectedSC?.id,
            currentMake?.globalId,
            [
              ...configuredModels.map(el => el.id),
              ...globalModels.filter(el => el.vinModel === 'OTHER').map(el => el.id),
            ],
            onCloseModal
          )
        );
      }
    }
  };

  useEffect(() => {
    if (currentMake) {
      dispatch(loadGlobalModels(currentMake.globalId));
    }
  }, [currentMake]);

  useEffect(() => {
    const filteredMakes = allMakes
      .filter(el => !el.isReadOnly)
      .map(el => ({
        id: el.globalId,
        text: el.name,
      }));

    setConfiguredMakes(filteredMakes);
  }, [allMakes]);

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
    <BaseModal {...props} width={860} onClose={onCloseModal}>
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

                    // Get the average length of all tags
                    const avgLength =
                      value.reduce((sum, item) => sum + item.text.length, 0) / value.length;

                    // If average length is very long, show only 1 tag
                    if (avgLength > 7) return 1;
                    // If average length is medium, show 2 tags

                    // If average length is short, show 3 tags
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
                                    maxWidth: '230px',
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
                            <div className={autocompleteClasses.classes.tag}>
                              +{remainingCount} others
                            </div>
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
              currentMakeName={currentMake?.name}
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
