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
import { CriteriaI } from '../../../types';
import {
  ComparisonOperatorE,
  EventRulesFilterTypeE,
} from '../../../../../../../store/reducers/dealerOperations/actions';
import { validateCriteriaOperator, validateCriteriaType } from '../../../../helper';

const toEnumLabel = <T extends Record<number, string>>(value: string, enumMap: T): string => {
  const enumIndex = Number(value);

  if (!Number.isNaN(enumIndex) && enumMap[enumIndex] !== undefined) {
    return enumMap[enumIndex];
  }

  return value;
};

const RecallAlertSettings: React.FC = () => {
  const { selectedRecallAlert } = useSelector((state: RootState) => state.recalls);
  const dispatch = useDispatch();
  const { classes } = useStyles();
  const [isEditTable, setIsEditTable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [updatedRecallAlert, setUpdatedRecallAlert] = React.useState<IRecallAlert | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const { selectedSC } = useSCs();
  const showError = useException();
  const [criterias, setCriteria] = useState<CriteriaI[]>([]);
  const [criteriaOperatorErrors, setCriteriaOperatorErrors] = useState<{
    [index: number]: boolean;
  }>({});
  const [criteriaTypeErrors, setCriteriaTypeErrors] = useState<{ [index: number]: boolean }>({});

  useEffect(() => {
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
  }, [selectedRecallAlert]);

  useEffect(() => {
    if (!selectedSC) return;
    if (updatedRecallAlert?.recallCampaignId) {
      dispatch(
        getAffectedModels(
          updatedRecallAlert?.recallCampaignId,
          selectedSC.id,
          () => {},
          () => {}
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
    console.log(selectedRecallAlert);
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
    setCriteriaTypeErrors({});
    setCriteriaOperatorErrors({});
  };

  const saveRecallAlert = () => {
    if (!updatedRecallAlert || !selectedSC) return;
    let haveErrors = false;

    const errorsCriteriaOperator = validateCriteriaOperator(criterias, setCriteriaOperatorErrors);
    const errorsCriteriaType = validateCriteriaType(criterias, setCriteriaTypeErrors);

    if (Object.keys(errorsCriteriaOperator).length) {
      showError('The operator selection is required.');
      haveErrors = true;
    }

    if (Object.keys(errorsCriteriaType).length) {
      showError("The ‘Audience Criteria' selection is required.");
      haveErrors = true;
    }

    if (!haveErrors)
      dispatch(
        updateRecallAlert(
          {
            serviceCenterId: selectedSC.id,
            recallCampaignId: updatedRecallAlert.recallCampaignId,
            id: updatedRecallAlert.id,
            listType: updatedRecallAlert.listType,
            filterRules: criterias,
          },
          () => {
            setIsEditTable(false);
            setFile(null);
          },
          () => {}
        )
      );
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
              <StatisticData updatedRecallAlert={updatedRecallAlert} />
              <hr
                style={{
                  color: '#EAEBEE',
                  height: '1px',
                  width: '100%',
                  opacity: '0.3',
                  margin: 0,
                }}
              />
              <div style={{ marginRight: '25px' }}>
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
