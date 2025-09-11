import React, { useEffect, useState } from 'react';
import { TitleContainerForDealerOperation } from '../../../../../components/wrappers/TitleContainer/TitleContainer';
import { dealerOperationsCustomer, dealerOperationsRoot } from '../../../../../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';
import { DashboardItemI } from '../../../../../store/reducers/dealerOperations/types';
import { Button } from '@mui/material';
import { useStyles } from '../../styles';
import { ReactComponent as ArrowLeft } from '../../../../../assets/img/arrow-left.svg';
import {
  ComparisonOperatorE,
  EventRulesFilterTypeE,
  setEventIdForRulesConfiguration,
  updateCustomerEventRulesC,
} from '../../../../../store/reducers/dealerOperations/actions';
import { useSCs } from '../../../../../hooks/useSCs/useSCs';
import { CriteriaI, TriggerI } from '../types';
import { useException } from '../../../../../hooks/useException/useException';
import {
  checkRulesWithoutCriteria,
  filterValidRulesAndTriggers,
  validateGroup,
  validateTriggersSequence,
} from '../../helper';
import { useModal } from '../../../../../hooks/useModal/useModal';
import LeaveWithoutSaving from '../../../../../components/modals/admin/LeaveWithoutSaving/LeaveWithoutSaving';
import { Loading } from '../../../../../components/wrappers/Loading/Loading';

import {
  validateCriteriaOperator,
  validateCriteriaType,
  validateRuleOperator,
  validateRuleType,
  validateTriggers,
} from '../../helper';
import AudienceForm from './Forms/AudienceForm';
import RulesForm from './Forms/RulesForm';
import Triggers from './Forms/Triggers';

const DealerCustomerSettings = () => {
  const { dashboardItems, eventIdForRulesConfiguration } = useSelector(
    (state: RootState) => state.dealerOperations
  );
  const dispatch = useDispatch();
  const { selectedSC } = useSCs();

  useEffect(() => {
    if (dashboardItems.length) {
      const event = dashboardItems.find(item => item.id === eventIdForRulesConfiguration);
      if (event) {
        setEventForConfiguration(event);
        const updatedFilterRules = event?.filterRules.map(rule => {
          return {
            ...rule,
            value: rule.value ? rule.value : '',
            type: EventRulesFilterTypeE[rule.type],
            operator: ComparisonOperatorE[rule.operator],
          };
        });
        setCriteria(updatedFilterRules.filter(rule => rule.isCriteria));
        setRules(updatedFilterRules.filter(rule => !rule.isCriteria));
        setTriggers(event.triggers);
      }
    }
  }, [dashboardItems]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [eventForConfiguration, setEventForConfiguration] = useState<DashboardItemI | null>(null);
  const [isEditTable, setIsEditTable] = useState<boolean>(false);
  const [criterias, setCriteria] = useState<CriteriaI[]>([]);
  const [rules, setRules] = useState<CriteriaI[]>([]);
  const [triggers, setTriggers] = useState<TriggerI[]>([]);
  const showError = useException();
  const [criteriaOperatorErrors, setCriteriaOperatorErrors] = useState<{
    [index: number]: boolean;
  }>({});
  const [criteriaTypeErrors, setCriteriaTypeErrors] = useState<{ [index: number]: boolean }>({});
  const [ruleOperatorErrors, setRuleOperatorErrors] = useState<{ [index: number]: boolean }>({});
  const [ruleTypeErrors, setRuleTypeErrors] = useState<{ [index: number]: boolean }>({});
  const [firstTriggerDateError, setFirstTriggerDateError] = useState<boolean>(false);
  const {
    onOpen: onOpenLeaveWithoutSavingModal,
    onClose: onCloseLeaveWithoutSavingModal,
    isOpen: isOpenLeaveWithoutSavingModal,
  } = useModal();

  const handleCancelChanges = () => {
    setIsEditTable(false);
    if (eventForConfiguration?.filterRules) {
      const updatedFilterRules = eventForConfiguration?.filterRules.map(rule => {
        return {
          ...rule,
          value: rule.value ? rule.value : '',
          type: EventRulesFilterTypeE[rule.type],
          operator: ComparisonOperatorE[rule.operator],
        };
      });
      setCriteria(updatedFilterRules.filter(rule => rule.isCriteria));
      setRules(updatedFilterRules.filter(rule => !rule.isCriteria));
      setTriggers(eventForConfiguration.triggers);
    }
    // for reset all errors
    setCriteriaTypeErrors({});
    setCriteriaOperatorErrors({});
    setRuleOperatorErrors({});
    setRuleTypeErrors({});
    setFirstTriggerDateError(false);
  };

  const handleOnSuccess = () => {
    setIsEditTable(false);
    setIsLoading(false);
  };

  const validateChangesBeforeSave = () => {
    let haveErrors = false;

    const errorsCriteriaOperator = validateCriteriaOperator(criterias, setCriteriaOperatorErrors);
    const errorsCriteriaType = validateCriteriaType(criterias, setCriteriaTypeErrors);
    const errorsRuleOperator = validateRuleOperator(rules, setRuleOperatorErrors);
    const errorsRuleType = validateRuleType(rules, setRuleTypeErrors);
    const triggersError = validateTriggers(triggers, setFirstTriggerDateError, showError);

    if (Object.keys(errorsCriteriaOperator).length || Object.keys(errorsRuleOperator).length) {
      showError('The operator selection is required.');
      haveErrors = true;
    }

    if (Object.keys(errorsCriteriaType).length) {
      showError("The ‘Audience Criteria' selection is required.");
      haveErrors = true;
    }

    if (Object.keys(errorsRuleType).length) {
      showError("The ‘Filter Rule' selection is required.");
      haveErrors = true;
    }

    if (triggersError) haveErrors = true;

    if (!haveErrors) handleSaveChanges();
  };

  const handleSaveChanges = () => {
    if (!selectedSC || !eventForConfiguration) {
      throw new Error('Selected SC is not defined');
    }
    if (!checkRulesWithoutCriteria(rules, criterias, showError)) return;

    if (
      validateGroup(criterias, c => Number.isInteger(Number(c.value)) && !!c?.operator) &&
      validateGroup(rules, r => Number.isInteger(Number(r.value)) && !!r?.operator) &&
      validateGroup(triggers, t => Number.isInteger(Number(t.daysFromListGeneration)))
    ) {
      if (!validateTriggersSequence(triggers, showError)) return;

      const { filterRules, triggers: validTriggers } = filterValidRulesAndTriggers(
        criterias,
        rules,
        triggers
      );

      setIsLoading(true);
      dispatch(
        updateCustomerEventRulesC(
          {
            serviceCenterId: selectedSC.id,
            eventId: eventForConfiguration.id,
            filterRules,
            triggers: validTriggers,
          },
          handleOnSuccess
        )
      );
    }
  };

  const { classes } = useStyles();

  if (eventForConfiguration) {
    return (
      <div className={classes.settingsContainer}>
        <TitleContainerForDealerOperation
          title={`${eventForConfiguration.name}`}
          pad
          parent={dealerOperationsCustomer}
          secondParent={dealerOperationsRoot}
          actions={() => dispatch(setEventIdForRulesConfiguration(null))}
        />

        <div className={classes.backButton}>
          <Button
            variant="text"
            className={classes.backWrapper}
            onClick={() =>
              isEditTable
                ? onOpenLeaveWithoutSavingModal()
                : dispatch(setEventIdForRulesConfiguration(null))
            }
          >
            <ArrowLeft />
            <span>Back to Communication Dashboard</span>
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
              <div className={classes.rulesWrapper}>
                <AudienceForm
                  criteriaOperatorErrors={criteriaOperatorErrors}
                  setCriteriaOperatorErrors={setCriteriaOperatorErrors}
                  criteriaTypeErrors={criteriaTypeErrors}
                  setCriteriaTypeErrors={setCriteriaTypeErrors}
                  criterias={criterias}
                  isEditTable={isEditTable}
                  setCriteria={setCriteria}
                />
                <RulesForm
                  ruleOperatorErrors={ruleOperatorErrors}
                  setRuleOperatorErrors={setRuleOperatorErrors}
                  ruleTypeErrors={ruleTypeErrors}
                  setRuleTypeErrors={setRuleTypeErrors}
                  rules={rules}
                  isEditTable={isEditTable}
                  setRules={setRules}
                />
              </div>

              <hr className={classes.line} />

              <div className={classes.triggersWrapper}>
                <Triggers
                  firstTriggerDateError={firstTriggerDateError}
                  setFirstTriggerDateError={setFirstTriggerDateError}
                  triggers={triggers}
                  setTriggers={setTriggers}
                  isEditTable={isEditTable}
                />
              </div>
            </div>
          </div>
        )}
        <LeaveWithoutSaving
          open={isOpenLeaveWithoutSavingModal}
          onClose={onCloseLeaveWithoutSavingModal}
          handleLeave={() => dispatch(setEventIdForRulesConfiguration(null))}
        />
      </div>
    );
  }

  return <></>;
};

export default DealerCustomerSettings;
