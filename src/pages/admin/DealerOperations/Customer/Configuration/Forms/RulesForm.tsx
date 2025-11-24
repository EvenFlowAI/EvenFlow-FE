import React, { Dispatch, SetStateAction } from 'react';
import { Autocomplete, IconButton } from '@mui/material';
import { autocompleteRender } from '../../../../../../utils/autocompleteRenders';
import { TextField } from '../../../../../../components/formControls/TextFieldStyled/TextField';
import { CriteriaI } from '../../types';
import { EventRulesFilterTypeE } from '../../../../../../store/reducers/dealerOperations/actions';
import { AddCircleOutline } from '@mui/icons-material';
import { useStyles } from '../../../styles';
import { ReactComponent as CloseNew } from '../../../../../../assets/img/close-new.svg';
import RuleMakes from './Makes';
import RuleModels from './Models';

interface RulesFormI {
  rules: CriteriaI[];
  isEditTable: boolean;
  setRules: React.Dispatch<React.SetStateAction<CriteriaI[]>>;
  ruleOperatorErrors: {
    [index: number]: boolean;
  };
  setRuleOperatorErrors: React.Dispatch<
    React.SetStateAction<{
      [index: number]: boolean;
    }>
  >;
  ruleTypeErrors: {
    [index: number]: boolean;
  };
  setRuleTypeErrors: React.Dispatch<
    React.SetStateAction<{
      [index: number]: boolean;
    }>
  >;
  selectedMakes: number[];
  setSelectedMakes: Dispatch<SetStateAction<number[]>>;
  selectedModels: number[];
  setSelectedModels: React.Dispatch<React.SetStateAction<number[]>>;
}

const RulesForm = ({
  rules,
  isEditTable,
  setRules,
  ruleOperatorErrors,
  setRuleOperatorErrors,
  ruleTypeErrors,
  setRuleTypeErrors,
  selectedMakes,
  setSelectedMakes,
  selectedModels,
  setSelectedModels,
}: RulesFormI) => {
  const { classes } = useStyles();

  const getAvailableFilterRules = () => {
    const allValues = Object.values(EventRulesFilterTypeE).filter(
      v => typeof v === 'string'
    ) as string[];

    const isModelAdded = rules.some(rule => rule.type === 'Vehicle Model');
    if (isModelAdded) {
      const modelIndex = allValues.indexOf('Vehicle Model');
      if (modelIndex !== -1) {
        allValues.splice(modelIndex, 1);
      }
    }

    const isMakeAdded = rules.some(rule => rule.type === 'Vehicle Make');
    if (isMakeAdded) {
      const makeIndex = allValues.indexOf('Vehicle Make');
      if (makeIndex !== -1) {
        allValues.splice(makeIndex, 1);
      }
    }

    return allValues;
  };

  const handleAddRule = () => {
    setRules(prev => [...prev, { type: '', operator: '', value: '' }]);
  };

  const handleRemoveRule = (index: number, ruleType?: string) => {
    setRuleOperatorErrors(prev => ({
      ...prev,
      [index]: false,
    }));

    setRuleTypeErrors(prev => ({
      ...prev,
      [index]: false,
    }));

    setRules(prev => prev.filter((rule, i) => i !== index));
    if (ruleType === 'Vehicle Make') {
      setSelectedMakes([]);
    }
    if (ruleType === 'Vehicle Model') {
      setSelectedModels([]);
    }
  };

  const handleRuleChange = (index: number, field: keyof CriteriaI, newValue: string) => {
    const updated = [...rules];
    if (field === 'type' || field === 'operator' || field === 'value') {
      if (field === 'operator') {
        setRuleOperatorErrors(prev => ({
          ...prev,
          [index]: false,
        }));
      }

      if (field === 'type') {
        setRuleTypeErrors(prev => ({
          ...prev,
          [index]: false,
        }));
      }

      updated[index][field] = newValue;
      setRules(updated);
    }
  };

  return (
    <>
      <span className={classes.filterRulesWrapper}>Audience Filter Rules</span>

      {rules.length ? (
        <div className={classes.criteriaWrapper}>
          {rules.map((rule, index) => {
            return (
              <div key={index} className={classes.filterRuleItem}>
                <Autocomplete
                  disabled={!isEditTable}
                  style={{ width: '52%' }}
                  value={rule.type}
                  disableClearable
                  options={getAvailableFilterRules()}
                  isOptionEqualToValue={(o, v) => String(o) === String(v)}
                  getOptionLabel={o => o}
                  onChange={(e, v) => handleRuleChange(index, 'type', v || '')}
                  renderInput={autocompleteRender({
                    isCustomFontSize: true,
                    label: 'Filter Rule',
                    placeholder: 'Not selected',
                    error: ruleTypeErrors[index],
                  })}
                />

                {rule.type === 'Vehicle Make' ? (
                  <RuleMakes
                    selectedMakes={selectedMakes}
                    setSelectedMakes={setSelectedMakes}
                    handleRuleChange={handleRuleChange}
                    index={index}
                    isEdit={isEditTable}
                  />
                ) : rule.type === 'Vehicle Model' ? (
                  <RuleModels
                    selectedModels={selectedModels}
                    setSelectedModels={setSelectedModels}
                    handleRuleChange={handleRuleChange}
                    index={index}
                    isEdit={isEditTable}
                  />
                ) : (
                  <>
                    <Autocomplete
                      style={{ width: '25%' }}
                      disabled={!isEditTable}
                      value={rule.operator}
                      disableClearable
                      options={['Less than', 'Equal', 'Greater than']}
                      isOptionEqualToValue={(o, v) => String(o) === String(v)}
                      getOptionLabel={o => o}
                      onChange={(e, v) => handleRuleChange(index, 'operator', v || '')}
                      renderInput={autocompleteRender({
                        label: 'Operator',
                        placeholder: '',
                        error: ruleOperatorErrors[index],
                      })}
                    />
                    <div className={classes.criteriaValue}>
                      <TextField
                        fullWidth
                        disabled={!isEditTable}
                        type="number"
                        inputProps={{ min: 0 }}
                        error={!Number.isInteger(Number(rule.value))}
                        label="Value"
                        placeholder=""
                        onChange={e => handleRuleChange(index, 'value', e.target.value || '')}
                        value={+rule.value}
                      />
                    </div>
                  </>
                )}

                {isEditTable ? (
                  <div
                    className={classes.removeCriteriaIcon}
                    onClick={() => handleRemoveRule(index, rule.type)}
                  >
                    <CloseNew />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}

      {isEditTable ? (
        <IconButton
          onClick={handleAddRule}
          disabled={rules.length === 5}
          className={classes.iconPlus}
          size="large"
        >
          <AddCircleOutline className={rules.length === 5 ? 'isDisabled' : ''} />
          <span
            style={rules.length === 5 ? { color: 'grey' } : {}}
            className={classes.addCriteriaButton}
          >
            Add Filter Criteria
          </span>
        </IconButton>
      ) : null}
    </>
  );
};

export default RulesForm;
