import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';
import {
  createMake,
  loadGlobalModels,
  loadMakeModelCodes,
  setCurrentMake,
  setMakeModelCodes,
  updateModel,
} from '../../../../store/reducers/vehicleDetails/actions';
import { IData } from '../../../../components/DragAndDrop/types';
import { SystemIntegrationType } from '../../../../store/reducers/serviceCenters/types';
import { useModal } from '../../../../hooks/useModal/useModal';
import { useConfirm } from '../../../../hooks/useConfirm/useConfirm';
import { ModelsTitle } from './modelsTitle';
import { RemoveMakeTitle } from './RemoveMakeTitle';

type TProps = {
  onClose: () => void;
};

export const useAddMakeModelModal = ({ onClose }: TProps) => {
  const dispatch = useDispatch();
  const { askConfirm } = useConfirm();
  const { currentMake, allMakes, makeModelCodes } = useSelector(
    (state: RootState) => state.vehicleDetails
  );
  const { selectedSC } = useSelector((state: RootState) => state.serviceCenters);

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

  const [configuredMakes, setConfiguredMakes] = useState<IData[]>([]);
  const [configuredModels, setConfiguredModels] = useState<IData[]>([]);
  const [makesToAdd, setMakesToAdd] = useState<IData[]>([]);
  const [modelsToAdd, setModelsToAdd] = useState<IData[]>([]);

  useEffect(() => {
    if (!currentMake) {
      return;
    }

    if (
      selectedSC?.integration === SystemIntegrationType.Fortellis ||
      selectedSC?.integration === SystemIntegrationType.XTime
    ) {
      if (currentMake.makeCode) {
        dispatch(loadMakeModelCodes(selectedSC.id, currentMake.makeCode));
      } else {
        dispatch(setMakeModelCodes([]));
      }
    }

    dispatch(loadGlobalModels(currentMake.globalId));
  }, [currentMake, dispatch, selectedSC]);

  useEffect(() => {
    setConfiguredMakes(
      allMakes.map(make => ({
        id: make.globalId,
        text: make.name,
        code: make.makeCode,
      }))
    );
  }, [allMakes]);

  useEffect(() => {
    const mappedModels =
      currentMake?.models.map(model => ({
        id: model.globalId,
        text: model.name,
        code: model.modelCode?.modelCode,
      })) ?? [];

    setConfiguredModels(mappedModels);
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
    .filter(make => !make.isReadOnly)
    .filter(make => !configuredMakes.some(configured => configured.id === make.globalId));

  const removedModels =
    currentMake?.models
      .filter(model => !model.isReadOnly)
      .filter(model => !configuredModels.some(configured => configured.id === model.globalId)) ??
    [];

  const othersLast = (arr: IData[]) => {
    const idx = arr.findIndex(item => item.text === 'OTHER');
    if (idx === -1) {
      return arr.map(item => item.id);
    }

    const copy = [...arr];
    const [other] = copy.splice(idx, 1);
    return [...copy.map(item => item.id), other.id];
  };

  const getGlobalIds = () => othersLast(configuredMakes);
  const getModelIds = () => othersLast(configuredModels);

  const saveMakes = (globalIds: number[]) => {
    if (!globalIds.length || !selectedSC) {
      return;
    }

    if (selectedSC.integration === SystemIntegrationType.Fortellis) {
      const makeCodes = Object.fromEntries(configuredMakes.map(make => [make.id, make.code ?? '']));
      dispatch(
        createMake({ serviceCenterId: selectedSC.id, globalIds, makeCodes }, () => {
          onCloseModal();
          onCloseConfigurationModal();
        })
      );
      return;
    }

    dispatch(
      createMake({ serviceCenterId: selectedSC.id, globalIds }, () => {
        onCloseModal();
        onCloseConfigurationModal();
      })
    );
  };

  const onSaveMakes = () => {
    if (!selectedSC?.id) {
      return;
    }

    const globalIds = getGlobalIds();
    if (removedMakes.length) {
      askConfirm({
        isRemove: true,
        title: RemoveMakeTitle(removedMakes),
        content:
          'After removing, please check configuration settings for Packages, Service Books, Consent Messages, and Recalls which may have been impacted.',
        onConfirm: () => saveMakes(globalIds),
      });
      return;
    }

    saveMakes(globalIds);
  };

  const saveModels = () => {
    if (!selectedSC || !currentMake) {
      return;
    }

    const onSuccess = () => {
      onCloseModal();
      onCloseModelConfigurationModal();
    };

    if (selectedSC.integration === SystemIntegrationType.Fortellis) {
      const modelCodes: Record<string, string> = Object.fromEntries(
        configuredModels.map(model => {
          const found = makeModelCodes.find(item => item.modelCode === model.code);
          return [model.id, found?.id?.toString() ?? ''];
        })
      );

      dispatch(
        updateModel(selectedSC.id, currentMake.globalId, getModelIds(), onSuccess, modelCodes)
      );
      return;
    }

    dispatch(updateModel(selectedSC.id, currentMake.globalId, getModelIds(), onSuccess));
  };

  const onSaveModels = () => {
    if (!selectedSC?.id || !currentMake?.globalId) {
      return;
    }

    if (removedModels.length) {
      askConfirm({
        isRemove: true,
        title: ModelsTitle(removedModels),
        content:
          'After removing, please check configuration settings for Packages, Service Books, Consent Messages, and Recalls which may have been impacted.',
        onConfirm: saveModels,
      });
      return;
    }

    saveModels();
  };

  const handleSaveMakes = () => {
    if (
      selectedSC?.integration === SystemIntegrationType.Fortellis ||
      selectedSC?.integration === SystemIntegrationType.XTime
    ) {
      onOpenConfigurationModal();
      return;
    }

    onSaveMakes();
  };

  const handleSaveModels = () => {
    if (
      selectedSC?.integration === SystemIntegrationType.Fortellis ||
      selectedSC?.integration === SystemIntegrationType.XTime
    ) {
      onOpenModelConfigurationModal();
      return;
    }

    onSaveModels();
  };

  return {
    currentMake,
    selectedSC,
    configuredMakes,
    configuredModels,
    makesToAdd,
    modelsToAdd,
    setConfiguredMakes,
    setConfiguredModels,
    setMakesToAdd,
    setModelsToAdd,
    onCloseModal,
    handleSaveMakes,
    handleSaveModels,
    isOpenConfigurationModal,
    onCloseConfigurationModal,
    isOpenModelConfigurationModal,
    onCloseModelConfigurationModal,
    onSaveMakes,
    onSaveModels,
  };
};
