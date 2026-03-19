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
  updateModel,
} from '../../../../store/reducers/vehicleDetails/actions';
import { useDispatch } from 'react-redux';
import { IData } from '../../../../components/DragAndDrop/types';
import { setCurrentMake } from '../../../../store/reducers/vehicleDetails/actions';
import CodesConfiguration from '../CodesConfiguration/CodesConfiguration';
import { useModal } from '../../../../hooks/useModal/useModal';
import { useConfirm } from '../../../../hooks/useConfirm/useConfirm';
import { SystemIntegrationType } from '../../../../store/reducers/serviceCenters/types';
import MakeModelInput from './MakeModelInput';
import { ModelsTitle } from './modelsTitle';
import { RemoveMakeTitle } from './RemoveMakeTitle';

type TAddMakeModalProps = DialogProps & {
  isEditing?: boolean;
};

export const AddMakeModelModal: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<TAddMakeModalProps>>
> = ({ isEditing, onClose, ...props }) => {
  const dispatch = useDispatch();
  const { currentMake, globalMakes, globalModels, allMakes } = useSelector(
    (state: RootState) => state.vehicleDetails
  );
  const {
    onOpen: opOpenConfigurationModal,
    onClose: onCloseConfigurationModal,
    isOpen: isOpenConfigurationModal,
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

  const onCloseModal = () => {
    setModelsToAdd([]);
    setMakesToAdd([]);
    setConfiguredMakes([]);
    setConfiguredModels([]);
    dispatch(setCurrentMake(null));
    onClose();
  };

  const removedMakes = allMakes
    .filter(el => !el.isReadOnly)
    .filter(make => !configuredMakes.some(configured => configured.id === make.globalId));

  const removedModels = currentMake?.models
    .filter(el => !el.isReadOnly)
    .filter(model => !configuredModels.some(configured => configured.id === model.globalId));

  const handleSaveMakes = () => {
    if (selectedSC?.integration === SystemIntegrationType.Fortellis) {
      opOpenConfigurationModal();
    } else {
      onSaveMakes();
    }
  };

  const handleSaveModels = () => {
    if (selectedSC?.integration === SystemIntegrationType.Fortellis) {
      opOpenConfigurationModal();
    } else {
      onSaveModels();
    }
  };

  const saveMakes = (globalIds: number[]) => {
    if (globalIds.length && selectedSC) {
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

  const getGlobalIds = () => [
    ...configuredMakes.map(el => el.id),
    ...globalMakes.filter(el => el.isReadOnly).map(el => el.id),
  ];

  const getModelIds = () => [
    ...configuredModels.map(el => el.id),
    ...globalModels.filter(el => el.vinModel === 'OTHER').map(el => el.id),
  ];

  const saveModels = () => {
    if (selectedSC && currentMake) {
      return dispatch(
        updateModel(selectedSC?.id, currentMake?.globalId, getModelIds(), onCloseModal)
      );
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
                    corresponding CDK{' '}
                    <span style={{ fontWeight: 'bold' }}>{isEditing ? 'Model' : 'Make'}</span>{' '}
                    Codes.
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
              currentMakeName={currentMake?.name}
              isEditing={isEditing ?? false}
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
            Next
          </Button>
        </div>
      </DialogActions>
      <CodesConfiguration
        onClose={onCloseConfigurationModal}
        open={isOpenConfigurationModal}
        isEditing={isEditing}
        onCloseModal={onCloseModal}
        configuredMakes={configuredMakes}
        configuredModels={configuredModels}
        onSaveMakes={onSaveMakes}
        onSaveModels={onSaveModels}
      />
    </BaseModal>
  );
};
