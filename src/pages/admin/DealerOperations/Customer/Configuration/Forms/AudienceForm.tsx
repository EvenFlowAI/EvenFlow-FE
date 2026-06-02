import React from 'react';
import { TextField } from '../../../../../../components/formControls/TextFieldStyled/TextField';
import { Autocomplete, IconButton } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import { autocompleteRender } from '../../../../../../utils/autocompleteRenders';
import { ReactComponent as CloseNew } from '../../../../../../assets/img/close-new.svg';
import { useStyles } from '../../../styles';
import { CriteriaI } from '../../types';

interface AudienceFormI {
  criterias: CriteriaI[];
  isDisabled?: boolean;
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
  isDisabled,
  criterias,
  isEditTable,
  setCriteria,
  criteriaOperatorErrors,
  setCriteriaOperatorErrors,
  criteriaTypeErrors,
  setCriteriaTypeErrors,
}: AudienceFormI) => {
  const { classes } = useStyles();

  const handleAddCriteria = () => {
    setCriteria(prev => [...prev, { type: '', operator: '', value: '', isCriteria: !!isDisabled }]);
  };

  const handleRemoveCriteria = (index: number) => {
    if (isDisabled) {
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
      {!isDisabled ? (
        <span
          style={{
            display: 'block',
            marginBottom: criterias.length ? '24px' : '4px',
            marginTop: '14px',
          }}
          className={classes.audienceParagraph}
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
                  disabled={!isEditTable}
                  style={{ width: '52%' }}
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
                    label: isDisabled ? 'Audience Criteria' : '',
                    placeholder: 'Not selected',
                  })}
                />
                <Autocomplete
                  style={{ width: '25%' }}
                  disabled={!isEditTable}
                  value={criteria.operator}
                  options={['Less than', 'Equal', 'Greater than']}
                  disableClearable
                  isOptionEqualToValue={(o, v) => String(o) === String(v)}
                  getOptionLabel={o => o}
                  onChange={(e, v) => handleCriteriaChange(index, 'operator', v || '')}
                  renderInput={autocompleteRender({
                    label: isDisabled ? 'Operator' : '',
                    placeholder: '',
                    error: criteriaOperatorErrors[index],
                  })}
                />
                <div className={classes.criteriaValue}>
                  <TextField
                    fullWidth
                    disabled={!isEditTable}
                    type="number"
                    error={!Number.isInteger(Number(criteria.value))}
                    inputProps={{ min: 0 }}
                    label={isDisabled ? 'Value' : ''}
                    placeholder=""
                    onChange={e => handleCriteriaChange(index, 'value', e.target.value || '')}
                    value={+criteria.value}
                  />
                </div>
                {isEditTable ? (
                  <div
                    style={!isDisabled ? { marginTop: 0 } : {}}
                    className={classes.removeCriteriaIcon}
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
          disabled={isDisabled ? !!criterias.length : false}
          className={classes.iconPlus}
          size="large"
        >
          <AddCircleOutline className={isDisabled ? (criterias.length ? 'isDisabled' : '') : ''} />
          <span
            style={isDisabled ? (criterias.length ? { color: 'grey' } : {}) : {}}
            className={classes.addCriteriaButton}
          >
            Audience Criteria
          </span>
        </IconButton>
      ) : null}
    </>
  );
};

export default AudienceForm;
