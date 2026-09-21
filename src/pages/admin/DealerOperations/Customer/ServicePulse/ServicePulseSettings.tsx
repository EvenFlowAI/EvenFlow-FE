import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useStyles } from '../../styles';
import { RootState } from '../../../../../store/rootReducer';
import { TitleContainerForDealerOperation } from '../../../../../components/wrappers/TitleContainer/TitleContainer';
import { dealerOperationsCustomer, dealerOperationsRoot } from '../../../../../utils/constants';
import {
  setEventIdForRulesConfiguration,
  setSelectedPlay,
} from '../../../../../store/reducers/dealerOperations/actions';
import { Button } from '@mui/material';
import { useModal } from '../../../../../hooks/useModal/useModal';
import LeaveWithoutSaving from '../../../../../components/modals/admin/LeaveWithoutSaving/LeaveWithoutSaving';
import { Loading } from '../../../../../components/wrappers/Loading/Loading';
import { CriteriaI, TriggerI } from '../types';
import { ReactComponent as ArrowLeft } from '../../../../../assets/img/arrow-left.svg';
import AudienceForm from '../Configuration/Forms/AudienceForm';
import RulesForm from '../Configuration/Forms/RulesForm';
import { loadMakes } from '../../../../../store/reducers/vehicleDetails/actions';
import { useSCs } from '../../../../../hooks/useSCs/useSCs';
import Triggers from '../Configuration/Forms/Triggers';

const ServicePulseSettings = () => {
  const dispatch = useDispatch();
  const { selectedPlay, plays } = useSelector((state: RootState) => state.dealerOperations);
  // const [eventForConfiguration, setEventForConfiguration] = useState<IPlayWithServiceBook | null>(
  //   null
  // );
  const [isEditTable, setIsEditTable] = React.useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [criterias, setCriteria] = useState<CriteriaI[]>([]);
  const [criteriaOperatorErrors, setCriteriaOperatorErrors] = useState<{
    [index: number]: boolean;
  }>({});
  const [ruleOperatorErrors, setRuleOperatorErrors] = useState<{ [index: number]: boolean }>({});
  const [triggerDateErrors, setTriggerDateErrors] = useState<{ [index: number]: boolean }>({});
  const [ruleTypeErrors, setRuleTypeErrors] = useState<{ [index: number]: boolean }>({});
  const [firstTriggerDateError, setFirstTriggerDateError] = useState<boolean>(false);
  const [criteriaTypeErrors, setCriteriaTypeErrors] = useState<{ [index: number]: boolean }>({});
  const [rules, setRules] = useState<CriteriaI[]>([]);
  const [triggers, setTriggers] = useState<TriggerI[]>([]);
  const [selectedMakes, setSelectedMakes] = useState<number[]>([]);
  const [selectedModels, setSelectedModels] = useState<number[]>([]);

  const {
    onOpen: onOpenLeaveWithoutSavingModal,
    onClose: onCloseLeaveWithoutSavingModal,
    isOpen: isOpenLeaveWithoutSavingModal,
  } = useModal();

  const { classes } = useStyles();
  const { selectedSC } = useSCs();

  useEffect(() => {
    if (!selectedSC) return;
    dispatch(loadMakes(selectedSC.id));
  }, [selectedSC]);

  useEffect(() => {
    if (plays.length) {
      const event = plays.find(item => item.id === selectedPlay?.id);
      if (event) {
        // setEventForConfiguration(event);
        if (selectedPlay) {
          const updatedFilterRules: CriteriaI[] = selectedPlay?.filterRules.map(rule => ({
            ...rule,
            value: rule.value ? rule.value : '',
          }));

          // handleUpdateMakesAndModels(updatedFilterRules);

          setCriteria(updatedFilterRules.filter(rule => rule.isCriteria));
          setRules(updatedFilterRules.filter(rule => !rule.isCriteria));
          setTriggers(event.triggers);
        }
      }
    }
  }, [plays]);

  const handleCancelChanges = () => {
    setIsEditTable(false);
    if (selectedPlay?.filterRules) {
      const updatedFilterRules: CriteriaI[] = selectedPlay.filterRules.map(rule => ({
        ...rule,
        value: rule.value ? rule.value : '',
      }));

      // handleUpdateMakesAndModels(updatedFilterRules);

      setCriteria(updatedFilterRules.filter(rule => rule.isCriteria));
      setRules(updatedFilterRules.filter(rule => !rule.isCriteria));
      setTriggers(selectedPlay.triggers);
    }
    // for reset all errors
    setCriteriaTypeErrors({});
    setCriteriaOperatorErrors({});
    setRuleOperatorErrors({});
    setTriggerDateErrors({});
    setRuleTypeErrors({});
    setFirstTriggerDateError(false);
  };

  const validateChangesBeforeSave = () => {
    setIsLoading(true);
  };

  if (!selectedPlay) return <div></div>;

  return (
    <div className={classes.settingsContainer}>
      <TitleContainerForDealerOperation
        title={`${selectedPlay.name}`}
        pad
        parent={dealerOperationsCustomer}
        secondParent={dealerOperationsRoot}
        actions={() => dispatch(setSelectedPlay(null))}
      />

      <div className={classes.backButton}>
        <Button
          variant="text"
          className={classes.backWrapper}
          onClick={() =>
            isEditTable ? onOpenLeaveWithoutSavingModal() : dispatch(setSelectedPlay(null))
          }
        >
          <ArrowLeft />
          <span>Back to Service Pulse</span>
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
                <Button
                  disabled={!criterias.length && !rules.length && !triggers.length}
                  variant="text"
                  onClick={validateChangesBeforeSave}
                >
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
                isOutboundMode
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
                disableAdd={criterias.length === 0}
                setRules={setRules}
                selectedMakes={selectedMakes}
                selectedModels={selectedModels}
                setSelectedMakes={setSelectedMakes}
                setSelectedModels={setSelectedModels}
              />
            </div>

            <hr className={classes.line} />

            <div className={classes.triggersWrapper}>
              <Triggers
                isOutboundMode
                setTriggerDateErrors={setTriggerDateErrors}
                triggerDateErrors={triggerDateErrors}
                firstTriggerDateError={firstTriggerDateError}
                setFirstTriggerDateError={setFirstTriggerDateError}
                triggers={triggers}
                setTriggers={setTriggers}
                isEditTable={isEditTable}
                disableAdd={criterias.length === 0}
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
};

export default ServicePulseSettings;
