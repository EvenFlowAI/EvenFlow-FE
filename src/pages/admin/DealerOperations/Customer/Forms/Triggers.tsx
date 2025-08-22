import React from 'react';
import { numberToOrdinalWord } from '../../helper';
import { IconButton } from '@mui/material';
import { AddCircleOutline, QueryBuilder } from '@mui/icons-material';
import { TriggerI } from '../types';
import ClockTimePicker from '../../../../../components/pickers/ClockTimePicker/ClockTimePicker';
import { TextField } from '../../../../../components/formControls/TextFieldStyled/TextField';
import { ReactComponent as CloseNew } from '../../../../../assets/img/close-new.svg';
import dayjs from 'dayjs';
import { useStyles } from '../../styles';

interface TriggersI {
  triggers: TriggerI[];
  setTriggers: React.Dispatch<React.SetStateAction<TriggerI[]>>;
  isEditTable: boolean;
}

const Triggers = ({ triggers, setTriggers, isEditTable }: TriggersI) => {
  const { classes } = useStyles();

  const handleAddTrigger = () => {
    setTriggers(prev => [...prev, { daysFromListGeneration: 0, scheduledTime: '' }]);
  };

  const handleRemoveTrigger = (index: number) => {
    setTriggers(prev => prev.filter((trigger, i) => i !== index));
  };

  const handleTriggerChange = (index: number, field: keyof TriggerI, newValue: string) => {
    const updated = triggers.map(trigger => ({ ...trigger }));
    if (field === 'scheduledTime') {
      updated[index][field] = newValue;
    }
    if (field === 'daysFromListGeneration') {
      updated[index][field] = +newValue;
    }
    setTriggers(updated);
  };

  return (
    <>
      <span style={{ textTransform: 'uppercase', fontSize: '18px', fontWeight: 700 }}>
        Triggers
      </span>

      {triggers.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {triggers.map((trigger, index) => {
            return (
              <div
                key={index}
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  padding: '20px 24px',
                  border: '1px solid #DADADA',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#546AB3',
                    }}
                  >
                    {numberToOrdinalWord(index + 1)} Contact
                  </span>
                  {isEditTable ? (
                    <div style={{ cursor: 'pointer' }} onClick={() => handleRemoveTrigger(index)}>
                      <CloseNew />
                    </div>
                  ) : null}
                </div>

                <div style={{ display: 'flex', width: '100%', gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', width: '40%' }}>
                    <TextField
                      fullWidth
                      labelFitContent={true}
                      disabled={!isEditTable}
                      type="number"
                      inputProps={{ min: 0 }}
                      label="Days from list generation"
                      placeholder=""
                      onChange={e =>
                        handleTriggerChange(index, 'daysFromListGeneration', e.target.value || '')
                      }
                      value={+trigger.daysFromListGeneration}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', width: '30%' }}>
                    <ClockTimePicker
                      value={
                        trigger.scheduledTime ? dayjs(trigger.scheduledTime, 'HH:mm:ss') : null
                      }
                      disabled={!isEditTable}
                      onChange={e =>
                        handleTriggerChange(index, 'scheduledTime', dayjs(e).format('HH:mm:ss'))
                      }
                      fullWidth
                      label={'Scheduled time'}
                      InputProps={{
                        endAdornment: <QueryBuilder color={'disabled'} cursor="pointer" />,
                        id: 'Scheduled time',
                        placeholder: '',
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {isEditTable ? (
        <IconButton
          onClick={handleAddTrigger}
          className={classes.iconPlus}
          disabled={triggers.length === 5}
          size="large"
        >
          <AddCircleOutline className={triggers.length === 5 ? 'isDisabled' : ''} />
          <span
            className={triggers.length === 5 ? 'isDisabled' : ''}
            style={{ fontWeight: 700, color: '#7898FF' }}
          >
            Add Contact
          </span>
        </IconButton>
      ) : null}
    </>
  );
};

export default Triggers;
