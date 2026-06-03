/* eslint-disable max-lines */

import React, { useEffect, useState } from 'react';
import {
  dealerOperationsCustomer,
  dealerOperationsRoot,
} from '../../../../../../../utils/constants';
import { TitleContainerForDealerOperation } from '../../../../../../../components/wrappers/TitleContainer/TitleContainer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../../../store/rootReducer';
import {
  getAffectedModels,
  setSelectedRecallAlert,
  updateRecallAlert,
  uploadCSV,
} from '../../../../../../../store/reducers/recall/actions';
import { useStyles } from '../../../../styles';
import { Button } from '@mui/material';
import { ReactComponent as ArrowLeft } from '../../../../../../../assets/img/arrow-left.svg';
import { useModal } from '../../../../../../../hooks/useModal/useModal';
import LeaveWithoutSaving from '../../../../../../../components/modals/admin/LeaveWithoutSaving/LeaveWithoutSaving';
import { Loading } from '../../../../../../../components/wrappers/Loading/Loading';
import RecallAlertAudience from './RecallAlertAudience';
import { IRecallAlert, RecallListType } from '../../../../../../../store/reducers/recall/types';
import { useSCs } from '../../../../../../../hooks/useSCs/useSCs';
import { useException } from '../../../../../../../hooks/useException/useException';
import StatisticData from './StatisticData';
import AudienceForm from '../../../Configuration/Forms/AudienceForm';
import { CriteriaI, TriggerI } from '../../../types';
import {
  ComparisonOperatorE,
  EventRulesFilterTypeE,
} from '../../../../../../../store/reducers/dealerOperations/actions';
import {
  mapModelIdsToGlobalModels,
  toEnumLabel,
  TSelectedModelKey,
  validateCriteriaOperator,
  validateCriteriaType,
  validateTriggers,
} from '../../../../helper';
import Triggers from '../../../Configuration/Forms/Triggers';
import { useRecallAlertSettingsStyles } from './styles';
import AffectedModels from './AffectedModels';

const RecallAlertSettings: React.FC = () => {
  const { selectedRecallAlert, affectedModels } = useSelector((state: RootState) => state.recalls);
  const dispatch = useDispatch();
  const { classes } = useStyles();
  const { classes: recallAlertSettingsClasses } = useRecallAlertSettingsStyles();
  const [isEditTable, setIsEditTable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [updatedRecallAlert, setUpdatedRecallAlert] = React.useState<IRecallAlert | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const { selectedSC } = useSCs();
  const showError = useException();
  const [criterias, setCriteria] = useState<CriteriaI[]>([]);
  const [triggers, setTriggers] = useState<TriggerI[]>([]);
  const [criteriaOperatorErrors, setCriteriaOperatorErrors] = useState<{
    [index: number]: boolean;
  }>({});
  const [criteriaTypeErrors, setCriteriaTypeErrors] = useState<{ [index: number]: boolean }>({});
  const [triggerDateErrors, setTriggerDateErrors] = useState<{ [index: number]: boolean }>({});
  const [firstTriggerDateError, setFirstTriggerDateError] = useState<boolean>(false);
  const [selectedModelKeys, setSelectedModelKeys] = useState<TSelectedModelKey[]>([]);

  const setDefaultData = () => {
    setUpdatedRecallAlert(selectedRecallAlert);

    const updatedFilterRules = selectedRecallAlert?.filterRules.map(rule => {
      return {
        ...rule,
        value: rule.value ? rule.value : '',
        type: toEnumLabel(rule.type, EventRulesFilterTypeE),
        operator: toEnumLabel(rule.operator, ComparisonOperatorE),
      };
    });

    setCriteria(updatedFilterRules || []);
    setTriggers(selectedRecallAlert?.triggers || []);
    setSelectedModelKeys(
      mapModelIdsToGlobalModels(selectedRecallAlert?.globalModelIds || [], affectedModels)
    );
  };

  useEffect(() => {
    setDefaultData();
  }, [selectedRecallAlert]);

  useEffect(() => {
    if (isEditTable || !selectedRecallAlert?.globalModelIds?.length || !affectedModels.length) {
      return;
    }

    setSelectedModelKeys(
      mapModelIdsToGlobalModels(selectedRecallAlert.globalModelIds, affectedModels)
    );
  }, [affectedModels, selectedRecallAlert, isEditTable]);

  useEffect(() => {
    if (!selectedSC) return;
    if (updatedRecallAlert?.recallCampaignId) {
      setIsLoading(true);
      // TODO: replace hardcoded values with real ones after BE changes for affected models will be done
      // dispatch(
      //   getAffectedModels(
      //     updatedRecallAlert?.recallCampaignId,
      //     selectedSC.id,
      //     () => {},
      //     () => {}
      //   )
      // );
      dispatch(
        getAffectedModels(
          11634,
          123,
          () => {
            setIsLoading(false);
          },
          () => {
            setIsLoading(false);
          }
        )
      );
    }
  }, [updatedRecallAlert?.recallCampaignId]);

  const {
    onOpen: onOpenLeaveWithoutSavingModal,
    onClose: onCloseLeaveWithoutSavingModal,
    isOpen: isOpenLeaveWithoutSavingModal,
  } = useModal();

  const handleCancelChanges = () => {
    setIsLoading(false);
    setIsEditTable(false);
    setDefaultData();
    setCriteriaTypeErrors({});
    setCriteriaOperatorErrors({});
    setFirstTriggerDateError(false);
    setTriggerDateErrors({});
  };

  const saveRecallAlert = () => {
    if (!updatedRecallAlert || !selectedSC) return;
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

    if (triggersError) haveErrors = true;

    if (!haveErrors) {
      const triggersWithPause = triggers.map(trigger => ({ ...trigger, isPaused: true }));
      setIsLoading(true);
      dispatch(
        updateRecallAlert(
          {
            serviceCenterId: selectedSC.id,
            recallCampaignId: updatedRecallAlert.recallCampaignId,
            id: updatedRecallAlert.id,
            listType: updatedRecallAlert.listType,
            filterRules: criterias,
            triggers: triggersWithPause,
            globalModels: selectedModelKeys,
          },
          () => {
            setIsEditTable(false);
            setFile(null);
            setIsLoading(false);
          },
          () => {}
        )
      );
    }
  };

  const validateChangesBeforeSave = () => {
    if (!updatedRecallAlert || !selectedSC) return;
    if (updatedRecallAlert.listType === RecallListType.UPLOAD_CSV) {
      if (file) {
        dispatch(
          uploadCSV(updatedRecallAlert.id, file, saveRecallAlert, e => {
            showError(e);
          })
        );
      } else {
        showError('Please select a CSV file.');
      }
    } else {
      saveRecallAlert();
    }
  };

  if (!selectedRecallAlert) return null;

  return (
    <div className={classes.settingsContainer}>
      <TitleContainerForDealerOperation
        title={`${selectedRecallAlert.name}`}
        pad
        parent={dealerOperationsCustomer}
        secondParent={dealerOperationsRoot}
        actions={() => dispatch(setSelectedRecallAlert(null))}
      />

      <div className={classes.backButton}>
        <Button
          variant="text"
          className={classes.backWrapper}
          onClick={() =>
            isEditTable ? onOpenLeaveWithoutSavingModal() : dispatch(setSelectedRecallAlert(null))
          }
        >
          <ArrowLeft />
          <span>Back to Recall Alerts</span>
        </Button>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <div className={classes.editButtonsWrapper}>
          <div className={classes.tableWrapper}>
            {isEditTable ? (
              <>
                <Button variant="text" onClick={handleCancelChanges} color="secondary">
                  Cancel
                </Button>
                <Button variant="text" onClick={validateChangesBeforeSave}>
                  Save
                </Button>
              </>
            ) : (
              <Button variant="text" onClick={() => setIsEditTable(true)}>
                Edit
              </Button>
            )}
          </div>

          <div className={classes.settingsBlock}>
            <div className={classes.audienceWrapper}>
              <RecallAlertAudience
                isEditTable={isEditTable}
                updatedRecallAlert={updatedRecallAlert}
                setUpdatedRecallAlert={setUpdatedRecallAlert}
                onFileChange={setFile}
                file={file}
              />
              {updatedRecallAlert?.recallCampaignId ? (
                <AffectedModels
                  isEditTable={isEditTable}
                  setSelectedModelKeys={setSelectedModelKeys}
                  selectedModelKeys={selectedModelKeys}
                />
              ) : null}
              <StatisticData updatedRecallAlert={updatedRecallAlert} />
              <hr className={recallAlertSettingsClasses.divider} />
              <div className={recallAlertSettingsClasses.audienceForm}>
                <AudienceForm
                  criterias={criterias}
                  setCriteria={setCriteria}
                  isEditTable={isEditTable}
                  criteriaOperatorErrors={criteriaOperatorErrors}
                  setCriteriaOperatorErrors={setCriteriaOperatorErrors}
                  criteriaTypeErrors={criteriaTypeErrors}
                  setCriteriaTypeErrors={setCriteriaTypeErrors}
                />
              </div>
            </div>
            <div className={recallAlertSettingsClasses.triggers}>
              <Triggers
                setTriggerDateErrors={setTriggerDateErrors}
                triggerDateErrors={triggerDateErrors}
                firstTriggerDateError={firstTriggerDateError}
                setFirstTriggerDateError={setFirstTriggerDateError}
                triggers={triggers}
                setTriggers={setTriggers}
                isEditTable={isEditTable}
                disableAdd={criterias.length === 0 || triggers.length === 5}
              />
            </div>
          </div>
        </div>
      )}
      <LeaveWithoutSaving
        open={isOpenLeaveWithoutSavingModal}
        onClose={onCloseLeaveWithoutSavingModal}
        handleLeave={() => dispatch(setSelectedRecallAlert(null))}
      />
    </div>
  );
};

export default RecallAlertSettings;
