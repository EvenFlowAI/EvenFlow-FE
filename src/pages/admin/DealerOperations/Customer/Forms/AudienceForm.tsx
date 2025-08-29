import React from 'react';
import { TextField } from '../../../../../components/formControls/TextFieldStyled/TextField';
import { Autocomplete, IconButton } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import { autocompleteRender } from '../../../../../utils/autocompleteRenders';
import { ReactComponent as CloseNew } from '../../../../../assets/img/close-new.svg';
import { useStyles } from '../../styles';
import { CriteriaI } from '../types';

interface AudienceFormI {
  criterias: CriteriaI[];
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
    setCriteria(prev => [...prev, { type: '', operator: '', value: '', isCriteria: true }]);
  };

  const handleRemoveCriteria = (index: number) => {
    if (criterias.length > 1) {
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
      <span style={{ textTransform: 'uppercase', fontSize: '18px', fontWeight: 700 }}>
        Audience
      </span>

      {criterias.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {criterias.map((criteria, index) => {
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
                  value={criteria.type}
                  options={['DaysFromLastNoShowAppointment']}
                  isOptionEqualToValue={(o, v) => String(o) === String(v)}
                  getOptionLabel={o => o}
                  onChange={(e, v) => handleCriteriaChange(index, 'type', v || '')}
                  renderInput={autocompleteRender({
                    error: criteriaTypeErrors[index], // <- підсвічуємо, якщо є помилка
                    label: 'Audience Criteria',
                    placeholder: 'Not selected',
                  })}
                />
                <Autocomplete
                  style={{ width: '25%' }}
                  disabled={!isEditTable}
                  value={criteria.operator}
                  options={['Equal']}
                  isOptionEqualToValue={(o, v) => String(o) === String(v)}
                  getOptionLabel={o => o}
                  onChange={(e, v) => handleCriteriaChange(index, 'operator', v || '')}
                  renderInput={autocompleteRender({
                    label: 'Operator',
                    placeholder: '',
                    error: criteriaOperatorErrors[index], // <- підсвічуємо, якщо є помилка
                  })}
                />
                <div style={{ display: 'flex', flexDirection: 'column', width: '15%' }}>
                  <TextField
                    fullWidth
                    disabled={!isEditTable}
                    type="number"
                    error={!Number.isInteger(Number(criteria.value))}
                    inputProps={{ min: 0 }}
                    label="Value"
                    placeholder=""
                    onChange={e => handleCriteriaChange(index, 'value', e.target.value || '')}
                    value={+criteria.value}
                  />
                </div>
                {isEditTable ? (
                  <div
                    style={{ marginTop: '30px', cursor: 'pointer' }}
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
          disabled={!!criterias.length}
          className={classes.iconPlus}
          size="large"
        >
          <AddCircleOutline className={criterias.length ? 'isDisabled' : ''} />
          <span
            className={criterias.length ? 'isDisabled' : ''}
            style={{ fontWeight: 700, color: '#7898FF' }}
          >
            Audience Criteria
          </span>
        </IconButton>
      ) : null}
    </>
  );
};

export default AudienceForm;
