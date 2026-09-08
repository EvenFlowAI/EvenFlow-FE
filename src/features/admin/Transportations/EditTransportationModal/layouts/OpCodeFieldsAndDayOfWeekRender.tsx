import React, { useCallback, useMemo, useState } from 'react';
import { Autocomplete, Checkbox } from '@mui/material';
import { renderChipTags } from './ChipTagRender';
import { autocompleteRender } from '../../../../../utils/autocompleteRenders';
import { useMultipleACStyles } from '../styles';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../store/rootReducer';
import { TOption } from '../../types';
import { CheckBoxOutlineBlank, CheckBoxOutlined } from '@mui/icons-material';
import { setFormIsChecked } from '../../../../../store/reducers/serviceRequests/actions';
import { TRuleState } from '../helper';

interface IOpCodeFieldsAndDayOfWeekRender {
  updateLocalRule: (index: number, rule: Partial<TRuleState>) => void;
  index: number;
  errors: string[];
  dayOFWeekOptions: TOption[];
  filterModeOptions: TOption[];
}

const OpCodeFieldsAndDayOfWeekRender = ({
  updateLocalRule,
  index,
  errors,
  dayOFWeekOptions,
  filterModeOptions,
}: IOpCodeFieldsAndDayOfWeekRender) => {
  const { allAssignedList, rules, formIsChecked } = useSelector(
    (state: RootState) => state.serviceRequests
  );
  const dispatch = useDispatch();
  const { classes: multipleACSClasses } = useMultipleACStyles();
  const currentRule = rules[index];

  const requestsOptions = useMemo(() => {
    return allAssignedList.map(item => ({
      name: item.serviceRequest.code,
      value: item.id,
    }));
  }, [allAssignedList]);

  const onRequestCheckboxChange = useCallback(
    (ruleIdx: number, option: TOption) => {
      const current = rules[ruleIdx].serviceRequests ?? [];

      const exists = current.some(o => o.value === option.value);
      const next = exists ? current.filter(o => o.value !== option.value) : [...current, option];

      updateLocalRule(ruleIdx, { serviceRequests: next });
      dispatch(setFormIsChecked(false));
    },
    [rules, updateLocalRule, dispatch]
  );

  const makeRenderRequestOption = useCallback(
    (ruleIdx: number) => (props: React.HTMLAttributes<HTMLLIElement>, option: TOption) => {
      const selected = rules[ruleIdx].serviceRequests ?? [];
      const checked = selected.some(item => item.value === option.value);

      return (
        <li
          {...props}
          key={`${option.name}-${option.value}`}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Checkbox
            color="primary"
            icon={
              checked ? (
                <CheckBoxOutlined htmlColor="#3855FE" />
              ) : (
                <CheckBoxOutlineBlank htmlColor="#DADADA" />
              )
            }
            checked={checked}
            onClick={e => e.stopPropagation()}
            onChange={() => onRequestCheckboxChange(ruleIdx, option)}
          />
          {option.name}
        </li>
      );
    },
    [rules, onRequestCheckboxChange]
  );

  const onRequestChange = useCallback(
    (ruleIdx: number, _e: any, value: TOption[]) => {
      dispatch(setFormIsChecked(false));
      if (value.length > 0) {
        updateLocalRule(ruleIdx, { serviceRequests: value });
      } else {
        updateLocalRule(ruleIdx, { serviceRequests: value, serviceRequestFilterMode: null });
      }
    },
    [dispatch, updateLocalRule]
  );

  const onDayCheckboxChange = useCallback(
    (ruleIdx: number, option: TOption) => {
      const current = rules[ruleIdx].daysOfWeek ?? [];

      const exists = current.some(o => o.value === option.value);
      const next = exists ? current.filter(o => o.value !== option.value) : [...current, option];

      updateLocalRule(ruleIdx, { daysOfWeek: next });
      dispatch(setFormIsChecked(false));
    },
    [rules, updateLocalRule, dispatch]
  );

  const makeRenderDayOption = useCallback(
    (ruleIdx: number) => (props: React.HTMLAttributes<HTMLLIElement>, option: TOption) => {
      const selected = rules[ruleIdx].daysOfWeek ?? [];

      const checked = selected.some(item => item.value === option.value);

      return (
        <li
          {...props}
          key={`${option.name}-${option.value}`}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Checkbox
            color="primary"
            icon={
              checked ? (
                <CheckBoxOutlined htmlColor="#3855FE" />
              ) : (
                <CheckBoxOutlineBlank htmlColor="#DADADA" />
              )
            }
            checked={checked}
            onClick={e => e.stopPropagation()}
            onChange={() => onDayCheckboxChange(ruleIdx, option)}
          />
          {option.name}
        </li>
      );
    },
    [rules, onDayCheckboxChange]
  );

  const onDaysChange = useCallback(
    (ruleIdx: number, _e: any, value: TOption[]) => {
      dispatch(setFormIsChecked(false));
      updateLocalRule(ruleIdx, { daysOfWeek: value });
    },
    [dispatch, updateLocalRule]
  );

  const onFilterModeChange = useCallback(
    (ruleIdx: number, _e: any, value: TOption | null) => {
      dispatch(setFormIsChecked(false));
      updateLocalRule(ruleIdx, { serviceRequestFilterMode: value });
    },
    [dispatch, updateLocalRule]
  );

  return (
    <>
      <Autocomplete
        multiple
        style={{ marginBottom: 20, marginTop: 20 }}
        classes={multipleACSClasses}
        options={requestsOptions}
        disableCloseOnSelect
        disableClearable
        getOptionLabel={option => option.name}
        isOptionEqualToValue={(o, v) => o.value === v.value}
        renderOption={makeRenderRequestOption(index)}
        value={currentRule.serviceRequests}
        onChange={(e, value) => onRequestChange(index, e, value)}
        renderTags={(selected, getTagProps) => renderChipTags(selected, getTagProps)}
        renderInput={autocompleteRender({
          label: 'Service Requests',
          placeholder: 'Select Service',
          error:
            errors.some(e => e.includes('service request') || e.includes('configuration')) &&
            formIsChecked,
        })}
      />

      {currentRule.serviceRequests?.length > 0 && (
        <Autocomplete
          style={{ marginBottom: 20 }}
          options={filterModeOptions}
          getOptionLabel={i => i.name}
          value={currentRule.serviceRequestFilterMode}
          isOptionEqualToValue={(o, v) => o.value === v.value}
          onChange={(e, value) => onFilterModeChange(index, e, value)}
          renderInput={autocompleteRender({
            label: 'Type',
            placeholder: 'Select Type',
            error:
              errors.some(e => e.includes('Type') || e.includes('configuration')) && formIsChecked,
          })}
        />
      )}

      <Autocomplete
        multiple
        fullWidth
        classes={multipleACSClasses}
        options={dayOFWeekOptions}
        style={{ marginBottom: 20 }}
        getOptionLabel={option => option.name}
        isOptionEqualToValue={(o, v) => o.value === v.value}
        disableClearable
        disableCloseOnSelect
        renderOption={makeRenderDayOption(index)}
        value={currentRule.daysOfWeek}
        onChange={(e, v) => onDaysChange(index, e, v)}
        renderTags={(selected, getTagProps) => renderChipTags(selected, getTagProps)}
        renderInput={autocompleteRender({
          label: 'Day Of Week',
          placeholder: 'Select Day Of Week',
          error:
            errors.some(e => e.includes('Days of week') || e.includes('configuration')) &&
            formIsChecked,
        })}
      />
    </>
  );
};

export default OpCodeFieldsAndDayOfWeekRender;
