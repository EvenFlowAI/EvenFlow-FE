import React, { useState, useEffect } from 'react';
import {
  BaseModal,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '../../../../components/modals/BaseModal/BaseModal';
import { Button, Divider } from '@mui/material';
import { DialogProps } from '../../../../components/modals/BaseModal/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import { useStyles } from './styles';
import { ReactComponent as AttentionIcon } from '../../../../assets/img/attention.svg';
import DragAndDrop from '../../../../components/DragAndDrop/DragAndDrop';
import {
  createMake,
  loadGlobalModels,
  loadMakeModelCodes,
  updateModel,
} from '../../../../store/reducers/vehicleDetails/actions';
import { useDispatch } from 'react-redux';
import { IData } from '../../../../components/DragAndDrop/types';
import { setCurrentMake } from '../../../../store/reducers/vehicleDetails/actions';
import { MakeCodesConfiguration } from '../MakeCodesConfiguration/MakeCodesConfiguration';
import { useModal } from '../../../../hooks/useModal/useModal';
import { useConfirm } from '../../../../hooks/useConfirm/useConfirm';
import { SystemIntegrationType } from '../../../../store/reducers/serviceCenters/types';
import MakeModelInput from './MakeModelInput';
import { ModelsTitle } from './modelsTitle';
import { RemoveMakeTitle } from './RemoveMakeTitle';
import ModelCodesConfiguration from '../ModelCodesConfiguration/ModelCodesConfiguration';

type TAddMakeModalProps = DialogProps & {
  isEditing?: boolean;
};

export const AddMakeModelModal: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TAddMakeModalProps>>
> = ({ isEditing, onClose, ...props }) => {
  const dispatch = useDispatch();
  const { currentMake, allMakes, makeModelCodes } = useSelector(
    (state: RootState) => state.vehicleDetails
  );
  const {
    onOpen: onOpenConfigurationModal,
    onClose: onCloseConfigurationModal,
    isOpen: isOpenConfigurationModal,
  } = useModal();
  const {
    onOpen: onOpenModelConfigurationModal,
    onClose: onCloseModelConfigurationModal,
    isOpen: isOpenModelConfigurationModal,
  } = useModal();
  const { selectedSC } = useSelector((state: RootState) => state.serviceCenters);
  const { askConfirm } = useConfirm();

  const [configuredMakes, setConfiguredMakes] = useState<IData[]>([]);
  const [configuredModels, setConfiguredModels] = useState<IData[]>([]);
  const [makesToAdd, setMakesToAdd] = useState<IData[]>([]);
  const [modelsToAdd, setModelsToAdd] = useState<IData[]>([]);
  const { classes } = useStyles();

  useEffect(() => {
    if (currentMake) {
      if (selectedSC?.integration === SystemIntegrationType.Fortellis && currentMake.makeCode) {
        dispatch(loadMakeModelCodes(selectedSC.id, currentMake.makeCode));
      }
      dispatch(loadGlobalModels(currentMake.globalId));
    }
  }, [currentMake, dispatch, selectedSC]);

  useEffect(() => {
    const filteredMakes = allMakes.map(el => ({
      id: el.globalId,
      text: el.name,
      code: el.makeCode,
    }));

    setConfiguredMakes(filteredMakes);
  }, [allMakes]);

  useEffect(() => {
    const filteredModels = currentMake?.models.map(el => ({
      id: el.globalId,
      text: el.name,
      code: el.modelCode?.modelCode,
    }));
    setConfiguredModels(filteredModels ?? []);
  }, [currentMake]);

  const onCloseModal = () => {
    onClose();
    dispatch(setCurrentMake(null));
    setModelsToAdd([]);
    setMakesToAdd([]);
    setConfiguredMakes([]);
    setConfiguredModels([]);
  };

  const removedMakes = allMakes
    .filter(el => !el.isReadOnly)
    .filter(make => !configuredMakes.some(configured => configured.id === make.globalId));

  const removedModels = currentMake?.models
    .filter(el => !el.isReadOnly)
    .filter(model => !configuredModels.some(configured => configured.id === model.globalId));

  const handleSaveMakes = () => {
    if (selectedSC?.integration === SystemIntegrationType.Fortellis) {
      onOpenConfigurationModal();
    } else {
      onSaveMakes();
    }
  };

  const handleSaveModels = () => {
    if (selectedSC?.integration === SystemIntegrationType.Fortellis) {
      onOpenModelConfigurationModal();
    } else {
      onSaveModels();
    }
  };

  const saveMakes = (globalIds: number[]) => {
    const makeCodes = Object.fromEntries(configuredMakes.map(m => [m.id, m.code!]));

    if (globalIds.length && selectedSC) {
      if (selectedSC?.integration === SystemIntegrationType.Fortellis) {
        dispatch(
          createMake(
            {
              serviceCenterId: selectedSC?.id,
              globalIds,
              makeCodes,
            },
            () => {
              onCloseModal();
              onCloseConfigurationModal();
            }
          )
        );
      } else {
        dispatch(
          createMake(
            {
              serviceCenterId: selectedSC?.id,
              globalIds,
            },
            () => {
              onCloseModal();
              onCloseConfigurationModal();
            }
          )
        );
      }
    }
  };

  const onSaveMakes = () => {
    if (selectedSC?.id) {
      const globalIds = getGlobalIds();
      if (removedMakes?.length) {
        askConfirm({
          isRemove: true,
          title: RemoveMakeTitle(removedMakes),
          content: (
            <span>
              After removing, please check configuration settings for Packages, Service Books,
              Consent Messages, and Recalls which may have been impacted.
            </span>
          ),
          onConfirm: () => saveMakes(globalIds),
        });
      } else {
        saveMakes(globalIds);
      }
    }
  };

  const getGlobalIds = () => [...configuredMakes.map(el => el.id)];

  const getModelIds = () => [...configuredModels.map(el => el.id)];

  const saveModels = () => {
    if (selectedSC && currentMake) {
      if (selectedSC?.integration === SystemIntegrationType.Fortellis) {
        const modelCodes: Record<string, string> = Object.fromEntries(
          configuredModels.map(model => {
            const found = makeModelCodes.find(mm => mm.modelCode === model.code);
            return [model.id, found?.id?.toString() ?? ''];
          })
        );

        return dispatch(
          updateModel(
            selectedSC?.id,
            currentMake?.globalId,
            getModelIds(),
            () => {
              onCloseModal();
              onCloseModelConfigurationModal();
            },
            modelCodes
          )
        );
      } else {
        return dispatch(
          updateModel(selectedSC?.id, currentMake?.globalId, getModelIds(), () => {
            onCloseModal();
            onCloseModelConfigurationModal();
          })
        );
      }
    }
  };

  const onSaveModels = () => {
    if (!selectedSC?.id || !currentMake?.globalId) return;

    if (removedModels?.length) {
      askConfirm({
        isRemove: true,
        title: ModelsTitle(removedModels),
        content: (
          <span>
            After removing, please check configuration settings for Packages, Service Books, Consent
            Messages, and Recalls which may have been impacted.
          </span>
        ),
        onConfirm: saveModels,
      });
    } else {
      saveModels();
    }
  };

  return (
    <BaseModal {...props} width={860} onClose={onCloseModal}>
      <DialogTitle onClose={onCloseModal}>
        {isEditing ? `${currentMake?.name} Model Options` : 'Make options'}
      </DialogTitle>
      <DialogContent>
        <div className={classes.wrapper}>
          <div className={classes.firstColumnLayout}>
            <MakeModelInput
              configuredModels={configuredModels}
              configuredMakes={configuredMakes}
              setConfiguredMakes={setConfiguredMakes}
              setConfiguredModels={setConfiguredModels}
              isEditing={isEditing}
              makesToAdd={makesToAdd}
              modelsToAdd={modelsToAdd}
              setMakesToAdd={setMakesToAdd}
              setModelsToAdd={setModelsToAdd}
            />
            <div className={classes.attentionWrapper}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ margin: 0 }}>
                  You can drag and drop the configured {isEditing ? 'models' : 'makes'} to rearrange
                  the
                  <br />
                  order that is presented in the drop-down menu on the booking flow
                </p>
                {selectedSC?.integration === SystemIntegrationType.Fortellis ? (
                  <p style={{ margin: 0 }}>
                    Click <span style={{ fontWeight: 'bold' }}>Next</span> to configure the
                    corresponding{' '}
                    <span style={{ fontWeight: 'bold' }}>
                      CDK {isEditing ? 'Model' : 'Make'} Codes.
                    </span>
                  </p>
                ) : null}
              </div>
              <AttentionIcon />
            </div>
          </div>

          <div>
            <div className={classes.fieldTitle}>
              {isEditing ? 'configured models' : 'configured makes'}
            </div>
            <DragAndDrop
              currentMake={currentMake}
              isEditing={isEditing}
              data={isEditing ? configuredModels : configuredMakes}
              setData={isEditing ? setConfiguredModels : setConfiguredMakes}
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
            onClick={() => (isEditing ? handleSaveModels() : handleSaveMakes())}
            className={classes.saveButton}
          >
            {selectedSC?.integration === SystemIntegrationType.Fortellis ? 'Next' : 'Save'}
          </Button>
        </div>
      </DialogActions>
      <MakeCodesConfiguration
        onClose={onCloseConfigurationModal}
        open={isOpenConfigurationModal}
        configuredMakes={configuredMakes}
        setConfiguredMakes={setConfiguredMakes}
        onSaveMakes={onSaveMakes}
      />
      <ModelCodesConfiguration
        onClose={onCloseModelConfigurationModal}
        open={isOpenModelConfigurationModal}
        configuredModels={configuredModels}
        setConfiguredModels={setConfiguredModels}
        onSaveModels={onSaveModels}
      />
    </BaseModal>
  );
};
