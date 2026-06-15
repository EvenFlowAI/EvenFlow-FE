import { useCallback, useEffect, useState } from 'react';
import {
  IRecallAffectedModel,
  IRecallAlert,
} from '../../../../../../../store/reducers/recall/types';
import { CriteriaI, TriggerI } from '../../../types';
import {
  ComparisonOperatorE,
  EventRulesFilterTypeE,
} from '../../../../../../../store/reducers/dealerOperations/actions';
import {
  mapAllAffectedModelsToSelectedKeys,
  mapModelIdsToGlobalModels,
  toEnumLabel,
  TSelectedModelKey,
} from '../../../../helper';

interface IUseRecallAlertSettingsState {
  selectedRecallAlert: IRecallAlert | null;
  affectedModels: IRecallAffectedModel[];
}

const useRecallAlertSettingsState = ({
  selectedRecallAlert,
  affectedModels,
}: IUseRecallAlertSettingsState) => {
  const [isEditTable, setIsEditTable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [updatedRecallAlert, setUpdatedRecallAlert] = useState<IRecallAlert | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [criterias, setCriteria] = useState<CriteriaI[]>([]);
  const [triggers, setTriggers] = useState<TriggerI[]>([]);
  const [criteriaOperatorErrors, setCriteriaOperatorErrors] = useState<Record<number, boolean>>({});
  const [criteriaTypeErrors, setCriteriaTypeErrors] = useState<Record<number, boolean>>({});
  const [triggerDateErrors, setTriggerDateErrors] = useState<Record<number, boolean>>({});
  const [firstTriggerDateError, setFirstTriggerDateError] = useState<boolean>(false);
  const [selectedModelKeys, setSelectedModelKeys] = useState<TSelectedModelKey[]>([]);

  const setDefaultData = useCallback(() => {
    setUpdatedRecallAlert(selectedRecallAlert);

    const updatedFilterRules = selectedRecallAlert?.filterRules.map(rule => ({
      ...rule,
      value: rule.value || '',
      type: toEnumLabel(rule.type, EventRulesFilterTypeE),
      operator: toEnumLabel(rule.operator, ComparisonOperatorE),
    }));

    setCriteria(updatedFilterRules || []);
    setTriggers(selectedRecallAlert?.triggers || []);
    setSelectedModelKeys(
      mapModelIdsToGlobalModels(selectedRecallAlert?.globalModelIds || [], affectedModels)
    );
  }, [affectedModels, selectedRecallAlert]);

  useEffect(() => {
    setDefaultData();
  }, [setDefaultData]);

  useEffect(() => {
    if (isEditTable || !selectedRecallAlert?.globalModelIds?.length || !affectedModels.length) {
      return;
    }

    setSelectedModelKeys(
      mapModelIdsToGlobalModels(selectedRecallAlert.globalModelIds, affectedModels)
    );
  }, [affectedModels, isEditTable, selectedRecallAlert]);

  useEffect(() => {
    if (!isEditTable || !updatedRecallAlert?.recallCampaignId || !affectedModels.length) {
      return;
    }

    const isKeyPresentInAffectedModels = ({ globalVehicleModelId, year }: TSelectedModelKey) =>
      affectedModels.some(
        model => model.globalVehicleModelId === globalVehicleModelId && model.year === year
      );

    const hasSelectionForCurrentCampaign = selectedModelKeys.some(isKeyPresentInAffectedModels);
    const hasOutdatedSelection = selectedModelKeys.some(
      selectedModel => !isKeyPresentInAffectedModels(selectedModel)
    );

    if (!hasOutdatedSelection && hasSelectionForCurrentCampaign) {
      return;
    }

    setSelectedModelKeys(mapAllAffectedModelsToSelectedKeys(affectedModels));
  }, [affectedModels, isEditTable, selectedModelKeys, updatedRecallAlert?.recallCampaignId]);

  const resetValidationErrors = () => {
    setCriteriaTypeErrors({});
    setCriteriaOperatorErrors({});
    setFirstTriggerDateError(false);
    setTriggerDateErrors({});
  };

  const handleCancelChanges = () => {
    setIsLoading(false);
    setIsEditTable(false);
    setDefaultData();
    resetValidationErrors();
  };

  return {
    isEditTable,
    setIsEditTable,
    isLoading,
    setIsLoading,
    updatedRecallAlert,
    setUpdatedRecallAlert,
    file,
    setFile,
    criterias,
    setCriteria,
    triggers,
    setTriggers,
    criteriaOperatorErrors,
    setCriteriaOperatorErrors,
    criteriaTypeErrors,
    setCriteriaTypeErrors,
    triggerDateErrors,
    setTriggerDateErrors,
    firstTriggerDateError,
    setFirstTriggerDateError,
    selectedModelKeys,
    setSelectedModelKeys,
    handleCancelChanges,
  };
};

export default useRecallAlertSettingsState;
