import React from 'react';
import clsx from 'clsx';
import { TextField } from '../../../../../../components/formControls/TextFieldStyled/TextField';
import { Autocomplete, IconButton } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import { autocompleteRender } from '../../../../../../utils/autocompleteRenders';
import { ReactComponent as CloseNew } from '../../../../../../assets/img/close-new.svg';
import { useStyles } from '../../../styles';
import { CriteriaI, RecallEventStatus } from '../../types';
import { useFormStyles } from './styles';
import { IRecallAlert } from '../../../../../../store/reducers/recall/types';

interface AudienceFormI {
  updatedRecallAlert?: IRecallAlert | null;
  criterias: CriteriaI[];
  isOutboundMode?: boolean;
  isEditTable: boolean;
  setCriteria: React.Dispatch<React.SetStateAction<CriteriaI[]>>;
  criteriaOperatorErrors: {
    [index: number]: boolean;
  };
  setCriteriaOperatorErrors: React.Dispatch<
    React.SetStateAction<{
      [index: number]: boolean;
    }>
  >;
  criteriaTypeErrors: {
    [index: number]: boolean;
  };
  setCriteriaTypeErrors: React.Dispatch<
    React.SetStateAction<{
      [index: number]: boolean;
    }>
  >;
}

const AudienceForm = ({
  updatedRecallAlert,
  isOutboundMode,
  criterias,
  isEditTable,
  setCriteria,
  criteriaOperatorErrors,
  setCriteriaOperatorErrors,
  criteriaTypeErrors,
  setCriteriaTypeErrors,
}: AudienceFormI) => {
  const { classes } = useStyles();
  const { classes: formClasses } = useFormStyles();

  const handleAddCriteria = () => {
    setCriteria(prev => [
      ...prev,
      { type: '', operator: '', value: '', isCriteria: !!isOutboundMode },
    ]);
  };

  const handleRemoveCriteria = (index: number) => {
    if (updatedRecallAlert?.status === RecallEventStatus.Running) return;
    if (isOutboundMode) {
      if (criterias.length > 1) {
        setCriteria(prev => prev.filter((criteria, i) => i !== index));
      }
    } else {
      setCriteria(prev => prev.filter((criteria, i) => i !== index));
    }
  };

  const handleCriteriaChange = (index: number, field: keyof CriteriaI, newValue: string) => {
    const updated = [...criterias];
    if (field === 'type' || field === 'operator' || field === 'value') {
      if (field === 'operator') {
        setCriteriaOperatorErrors(prev => ({
          ...prev,
          [index]: false,
        }));
      }

      if (field === 'type') {
        setCriteriaTypeErrors(prev => ({
          ...prev,
          [index]: false,
        }));
      }

      updated[index][field] = newValue;
      setCriteria(updated);
    }
  };

  return (
    <>
      {!isOutboundMode ? (
        <span
          className={clsx(classes.audienceParagraph, formClasses.audienceFiltersTitle, {
            [formClasses.audienceFiltersTitleEmpty]: !criterias.length,
          })}
        >
          Audience Filters
        </span>
      ) : (
        <span className={classes.audienceParagraph}>Audience</span>
      )}

      {criterias.length ? (
        <div className={classes.criteriaWrapper}>
          {criterias.map((criteria, index) => {
            return (
              <div key={index} className={classes.criteriaFormWrapper}>
                <Autocomplete
                  disabled={
                    !isEditTable || updatedRecallAlert?.status === RecallEventStatus.Running
                  }
                  className={formClasses.criteriaTypeAutocomplete}
                  value={criteria.type}
                  disableClearable
                  options={[
                    'Days To Future Appointment',
                    'Days From Last No Show Appointment',
                    'Days From Last Cancel Appointment',
                    'Days From Last Showed Appointment',
                    'Days From Last Open Ro',
                    'Days From Last Closed Ro',
                  ]}
                  isOptionEqualToValue={(o, v) => String(o) === String(v)}
                  getOptionLabel={o => o}
                  onChange={(e, v) => handleCriteriaChange(index, 'type', v || '')}
                  renderInput={autocompleteRender({
                    isCustomFontSize: true,
                    error: criteriaTypeErrors[index],
                    label: isOutboundMode ? 'Audience Criteria' : '',
                    placeholder: 'Not selected',
                  })}
                />
                <Autocomplete
                  className={formClasses.criteriaOperatorAutocomplete}
                  disabled={
                    !isEditTable || updatedRecallAlert?.status === RecallEventStatus.Running
                  }
                  value={criteria.operator}
                  options={['Less than', 'Equal', 'Greater than']}
                  disableClearable
                  isOptionEqualToValue={(o, v) => String(o) === String(v)}
                  getOptionLabel={o => o}
                  onChange={(e, v) => handleCriteriaChange(index, 'operator', v || '')}
                  renderInput={autocompleteRender({
                    label: isOutboundMode ? 'Operator' : '',
                    placeholder: '',
                    error: criteriaOperatorErrors[index],
                  })}
                />
                <div className={classes.criteriaValue}>
                  <TextField
                    fullWidth
                    disabled={
                      !isEditTable || updatedRecallAlert?.status === RecallEventStatus.Running
                    }
                    type="number"
                    error={!Number.isInteger(Number(criteria.value))}
                    inputProps={{ min: 0 }}
                    label={isOutboundMode ? 'Value' : ''}
                    placeholder=""
                    onChange={e => handleCriteriaChange(index, 'value', e.target.value || '')}
                    value={+criteria.value}
                  />
                </div>
                {isEditTable ? (
                  <div
                    className={clsx(classes.removeCriteriaIcon, {
                      [formClasses.removeCriteriaIconCompact]: !isOutboundMode,
                    })}
                    onClick={() => handleRemoveCriteria(index)}
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
          onClick={handleAddCriteria}
          disabled={
            (isOutboundMode ? !!criterias.length : criterias.length >= 5) ||
            updatedRecallAlert?.status === RecallEventStatus.Running
          }
          className={classes.iconPlus}
          size="large"
        >
          <AddCircleOutline
            className={
              isOutboundMode
                ? criterias.length
                  ? 'isDisabled'
                  : ''
                : criterias.length >= 5 || updatedRecallAlert?.status === RecallEventStatus.Running
                  ? 'isDisabled'
                  : ''
            }
          />
          <span
            className={clsx(classes.addCriteriaButton, {
              [formClasses.disabledAddButtonText]: isOutboundMode
                ? criterias.length
                : criterias.length >= 5 || updatedRecallAlert?.status === RecallEventStatus.Running,
            })}
          >
            {isOutboundMode ? 'Audience Criteria' : 'Add Filter'}
          </span>
        </IconButton>
      ) : null}
    </>
  );
};

export default AudienceForm;
