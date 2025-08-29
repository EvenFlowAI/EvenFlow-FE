import React from 'react';
import { Autocomplete, IconButton } from '@mui/material';
import { autocompleteRender } from '../../../../../utils/autocompleteRenders';
import { TextField } from '../../../../../components/formControls/TextFieldStyled/TextField';
import { CriteriaI } from '../types';
import { EventRulesFilterTypeE } from '../../../../../store/reducers/dealerOperations/actions';
import { AddCircleOutline } from '@mui/icons-material';
import { useStyles } from '../../styles';
import { ReactComponent as CloseNew } from '../../../../../assets/img/close-new.svg';

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
}

const RulesForm = ({
  rules,
  isEditTable,
  setRules,
  ruleOperatorErrors,
  setRuleOperatorErrors,
  ruleTypeErrors,
  setRuleTypeErrors,
}: RulesFormI) => {
  const { classes } = useStyles();

  const getAvailableFilterRules = () => {
    const allValues = Object.values(EventRulesFilterTypeE).filter(
      v => typeof v === 'string'
    ) as string[];

    return allValues;
  };

  const handleAddRule = () => {
    setRules(prev => [...prev, { type: '', operator: '', value: '' }]);
  };

  const handleRemoveRule = (index: number) => {
    setRules(prev => prev.filter((rule, i) => i !== index));
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
      <span
        style={{
          textTransform: 'uppercase',
          fontSize: '16px',
          fontWeight: 700,
          marginTop: '60px',
        }}
      >
        Audience Filter Rules
      </span>

      {rules.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {rules.map((rule, index) => {
            return (
              <div
                key={index}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '20px',
                }}
              >
                <Autocomplete
                  disabled={!isEditTable}
                  style={{ width: '56%' }}
                  value={rule.type}
                  options={getAvailableFilterRules()}
                  isOptionEqualToValue={(o, v) => String(o) === String(v)}
                  getOptionLabel={o => o}
                  onChange={(e, v) => handleRuleChange(index, 'type', v || '')}
                  renderInput={autocompleteRender({
                    label: 'Filter Rule',
                    placeholder: 'Not selected',
                    error: ruleTypeErrors[index], // <- підсвічуємо, якщо є помилка
                  })}
                />
                <Autocomplete
                  style={{ width: '25%' }}
                  disabled={!isEditTable}
                  // value={criteria.operator}
                  value={rule.operator}
                  options={['Less than', 'Equal', 'Greater than']}
                  isOptionEqualToValue={(o, v) => String(o) === String(v)}
                  getOptionLabel={o => o}
                  onChange={(e, v) => handleRuleChange(index, 'operator', v || '')}
                  renderInput={autocompleteRender({
                    label: 'Operator',
                    placeholder: '',
                    error: ruleOperatorErrors[index], // <- підсвічуємо, якщо є помилка
                  })}
                />
                <div style={{ display: 'flex', flexDirection: 'column', width: '15%' }}>
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
                {isEditTable ? (
                  <div
                    style={{ marginTop: '30px', cursor: 'pointer' }}
                    onClick={() => handleRemoveRule(index)}
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
            className={rules.length === 5 ? 'isDisabled' : ''}
            style={{ fontWeight: 700, color: '#7898FF' }}
          >
            Add Filter Criteria
          </span>
        </IconButton>
      ) : null}
    </>
  );
};

export default RulesForm;
