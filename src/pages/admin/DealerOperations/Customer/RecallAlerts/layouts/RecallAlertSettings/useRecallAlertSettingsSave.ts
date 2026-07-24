import { Dispatch, SetStateAction } from 'react';
import { useDispatch } from 'react-redux';
import {
  getRecallEvents,
  setRecallAlertSettingsEditMode,
  setSelectedRecallAlert,
  updateRecallAlert,
  uploadCSV,
} from '../../../../../../../store/reducers/recall/actions';
import { IRecallAlert, RecallListType } from '../../../../../../../store/reducers/recall/types';
import { useSCs } from '../../../../../../../hooks/useSCs/useSCs';
import { useException } from '../../../../../../../hooks/useException/useException';
import {
  TSelectedModelKey,
  validateCriteriaOperator,
  validateCriteriaType,
  validateTriggers,
} from '../../../../helper';
import { CriteriaI, TriggerI } from '../../../types';
import { TCallback } from '../../../../../../../types/types';

interface IUseRecallAlertSettingsSave {
  updatedRecallAlert: IRecallAlert | null;
  criterias: CriteriaI[];
  triggers: TriggerI[];
  selectedModelKeys: TSelectedModelKey[];
  file: File | null;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setIsEditTable: Dispatch<SetStateAction<boolean>>;
  setFile: Dispatch<SetStateAction<File | null>>;
  setCriteriaOperatorErrors: Dispatch<SetStateAction<Record<number, boolean>>>;
  setCriteriaTypeErrors: Dispatch<SetStateAction<Record<number, boolean>>>;
  setFirstTriggerDateError: Dispatch<SetStateAction<boolean>>;
  setTriggerDateErrors: Dispatch<SetStateAction<Record<number, boolean>>>;
}

const useRecallAlertSettingsSave = ({
  updatedRecallAlert,
  criterias,
  triggers,
  selectedModelKeys,
  file,
  setIsLoading,
  setIsEditTable,
  setFile,
  setCriteriaOperatorErrors,
  setCriteriaTypeErrors,
  setFirstTriggerDateError,
  setTriggerDateErrors,
}: IUseRecallAlertSettingsSave) => {
  const dispatch = useDispatch();
  const { selectedSC } = useSCs();
  const showError = useException();

  const handleFile = (callback: TCallback) => {
    if (!updatedRecallAlert || !selectedSC || !file) {
      return;
    }

    dispatch(
      uploadCSV(updatedRecallAlert.id, file, callback, e => {
        showError(e);
        setIsLoading(false);
      })
    );
  };

  const saveRecallAlert = (shouldHandleFile?: boolean) => {
    if (!updatedRecallAlert || !selectedSC) {
      return;
    }

    let haveErrors = false;

    const errorsCriteriaOperator = validateCriteriaOperator(criterias, setCriteriaOperatorErrors);
    const errorsCriteriaType = validateCriteriaType(criterias, setCriteriaTypeErrors);
    const triggersError = validateTriggers(
      criterias,
      triggers,
      setFirstTriggerDateError,
      showError,
      setTriggerDateErrors
    );

    if (Object.keys(errorsCriteriaOperator).length) {
      showError('The operator selection is required.');
      haveErrors = true;
    }

    if (Object.keys(errorsCriteriaType).length) {
      showError("The ‘Audience Criteria' selection is required.");
      haveErrors = true;
    }

    if (triggersError) {
      haveErrors = true;
    }

    if (haveErrors) {
      setIsLoading(false);
      return;
    }

    const triggersWithPause = triggers.map(trigger => ({
      ...trigger,
      isPaused: trigger.isPaused ?? true,
    }));

    dispatch(
      updateRecallAlert(
        {
          serviceCenterId: selectedSC.id,
          recallCampaignId: updatedRecallAlert.recallCampaignId,
          id: updatedRecallAlert.id,
          listType: updatedRecallAlert.listType,
          filterRules: criterias,
          triggers: triggersWithPause,
          globalModels: !updatedRecallAlert.recallCampaignId
            ? []
            : updatedRecallAlert.listType === RecallListType.CSV_UPLOADED
              ? null
              : selectedModelKeys,
        },
        () => {
          setIsEditTable(false);
          setFile(null);
          setIsLoading(false);
          dispatch(setRecallAlertSettingsEditMode(false));
          dispatch(setSelectedRecallAlert(null));
        },
        shouldHandleFile
          ? (callback: TCallback) => {
              handleFile(callback);
            }
          : undefined,
        (error: string) => {
          showError(error);
          dispatch(
            getRecallEvents(
              selectedSC.id,
              'workflow',
              () => {},
              () => {
                setIsEditTable(false);
                setFile(null);
                setIsLoading(false);
              }
            )
          );
        }
      )
    );
  };

  const validateChangesBeforeSave = () => {
    if (!updatedRecallAlert || !selectedSC) {
      return;
    }

    if (updatedRecallAlert.recallCampaignId && !selectedModelKeys.length) {
      showError('At least one model must be selected');
      return;
    }

    setIsLoading(true);

    if (updatedRecallAlert.listType === RecallListType.CSV_UPLOADED) {
      saveRecallAlert(Boolean(file));
      return;
    }

    saveRecallAlert();
  };

  return {
    validateChangesBeforeSave,
  };
};

export default useRecallAlertSettingsSave;
