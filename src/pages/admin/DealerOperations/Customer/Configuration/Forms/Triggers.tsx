import React from 'react';
import { numberToOrdinalWord } from '../../../helper';
import { IconButton } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import { TriggerI } from '../../types';
import ClockTimePicker from '../../../../../../components/pickers/ClockTimePicker/ClockTimePicker';
import { TextField } from '../../../../../../components/formControls/TextFieldStyled/TextField';
import { ReactComponent as CloseNew } from '../../../../../../assets/img/close-new.svg';
import dayjs from 'dayjs';
import { useStyles } from '../../../styles';

interface TriggersI {
  triggers: TriggerI[];
  setTriggers: React.Dispatch<React.SetStateAction<TriggerI[]>>;
  isEditTable: boolean;
  firstTriggerDateError: boolean;
  setFirstTriggerDateError: React.Dispatch<React.SetStateAction<boolean>>;
}

const Triggers = ({
  triggers,
  setTriggers,
  isEditTable,
  firstTriggerDateError,
  setFirstTriggerDateError,
}: TriggersI) => {
  const { classes } = useStyles();

  const handleAddTrigger = () => {
    setTriggers(prev => [...prev, { daysFromListGeneration: 0, scheduledTime: '' }]);
  };

  const handleRemoveTrigger = (index: number) => {
    setFirstTriggerDateError(false);
    setTriggers(prev => prev.filter((trigger, i) => i !== index));
  };

  const handleTriggerChange = (index: number, field: keyof TriggerI, newValue: string) => {
    const updated = triggers.map(trigger => ({ ...trigger }));
    if (field === 'scheduledTime') {
      if (index === 0) {
        setFirstTriggerDateError(false);
      }
      updated[index][field] = newValue;
    }
    if (field === 'daysFromListGeneration') {
      updated[index][field] = +newValue;
    }
    setTriggers(updated);
  };

  return (
    <>
      <span className={classes.audienceParagraph}>Triggers</span>

      {triggers.length ? (
        <div className={classes.criteriaWrapper}>
          {triggers.map((trigger, index) => {
            return (
              <div key={index} className={classes.triggerItemWrapper}>
                <div className={classes.triggerItem}>
                  <span className={classes.contactCounter}>
                    {numberToOrdinalWord(index + 1)} Contact
                  </span>
                  {isEditTable ? (
                    <div style={{ cursor: 'pointer' }} onClick={() => handleRemoveTrigger(index)}>
                      <CloseNew />
                    </div>
                  ) : null}
                </div>

                <div className={classes.triggersFormWrapper}>
                  <div className={classes.triggersForm}>
                    <TextField
                      fullWidth
                      labelFitContent={true}
                      disabled={!isEditTable}
                      type="number"
                      inputProps={{ min: 0 }}
                      error={!Number.isInteger(Number(trigger.daysFromListGeneration))}
                      label="Days from list generation"
                      placeholder=""
                      onChange={e =>
                        handleTriggerChange(index, 'daysFromListGeneration', e.target.value || '')
                      }
                      value={+trigger.daysFromListGeneration}
                    />
                  </div>
                  <div className={classes.triggerClockWrapper}>
                    <ClockTimePicker
                      value={
                        trigger.scheduledTime ? dayjs(trigger.scheduledTime, 'HH:mm:ss') : null
                      }
                      disabled={!isEditTable}
                      onChange={e =>
                        handleTriggerChange(index, 'scheduledTime', dayjs(e).format('HH:mm:ss'))
                      }
                      label={'Scheduled time'}
                      InputProps={{
                        className: 'ClockTimeTriggers',
                        id: 'Scheduled time',
                        placeholder: '',
                        error: index === 0 && firstTriggerDateError,
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
            style={triggers.length === 5 ? { color: 'grey' } : {}}
            className={classes.addCriteriaButton}
          >
            Add Contact
          </span>
        </IconButton>
      ) : null}
    </>
  );
};

export default Triggers;
