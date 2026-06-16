import React, { useEffect } from 'react';
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
} from '../../../../../../../store/reducers/recall/actions';
import { useStyles } from '../../../../styles';
import { Button } from '@mui/material';
import { ReactComponent as ArrowLeft } from '../../../../../../../assets/img/arrow-left.svg';
import { useModal } from '../../../../../../../hooks/useModal/useModal';
import LeaveWithoutSaving from '../../../../../../../components/modals/admin/LeaveWithoutSaving/LeaveWithoutSaving';
import { Loading } from '../../../../../../../components/wrappers/Loading/Loading';
import RecallAlertAudience from './RecallAlertAudience';
import { RecallListType } from '../../../../../../../store/reducers/recall/types';
import { useSCs } from '../../../../../../../hooks/useSCs/useSCs';
import StatisticData from './StatisticData';
import AudienceForm from '../../../Configuration/Forms/AudienceForm';
import Triggers from '../../../Configuration/Forms/Triggers';
import { useRecallAlertSettingsStyles } from './styles';
import AffectedModels from './AffectedModels';
import useRecallAlertSettingsState from './useRecallAlertSettingsState';
import useRecallAlertSettingsSave from './useRecallAlertSettingsSave';

const RecallAlertSettings: React.FC = () => {
  const { selectedRecallAlert, affectedModels } = useSelector((state: RootState) => state.recalls);
  const dispatch = useDispatch();
  const { classes } = useStyles();
  const { classes: recallAlertSettingsClasses } = useRecallAlertSettingsStyles();
  const { selectedSC } = useSCs();
  const {
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
  } = useRecallAlertSettingsState({
    selectedRecallAlert,
    affectedModels,
  });

  const { validateChangesBeforeSave } = useRecallAlertSettingsSave({
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
  });

  useEffect(() => {
    if (!selectedSC) return;
    if (updatedRecallAlert?.recallCampaignId) {
      setIsLoading(true);
      dispatch(
        getAffectedModels(
          updatedRecallAlert?.recallCampaignId,
          selectedSC.id,
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
                setIsLoading={setIsLoading}
              />
              {updatedRecallAlert?.recallCampaignId ? (
                <div className={recallAlertSettingsClasses.affectedModelsWrapper}>
                  <AffectedModels
                    updatedRecallAlert={updatedRecallAlert}
                    isEditTable={isEditTable}
                    setSelectedModelKeys={setSelectedModelKeys}
                    selectedModelKeys={selectedModelKeys}
                  />
                  {updatedRecallAlert.listType === RecallListType.UPLOAD_CSV && (
                    <div className={recallAlertSettingsClasses.uploadCsvHintText}>
                      Model selection does not affect VIN processing when using CSV upload.
                    </div>
                  )}
                </div>
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
                  updatedRecallAlert={updatedRecallAlert}
                />
              </div>
            </div>
            <div className={recallAlertSettingsClasses.triggers}>
              <Triggers
                updatedRecallAlert={updatedRecallAlert}
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
