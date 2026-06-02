import React from 'react';
import clsx from 'clsx';
import { numberToOrdinalWord } from '../../../helper';
import { IconButton } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import { TriggerI } from '../../types';
import ClockTimePicker from '../../../../../../components/pickers/ClockTimePicker/ClockTimePicker';
import { TextField } from '../../../../../../components/formControls/TextFieldStyled/TextField';
import { ReactComponent as CloseNew } from '../../../../../../assets/img/close-new.svg';
import { ReactComponent as Time } from '../../../../../../assets/img/time.svg';
import dayjs from 'dayjs';
import { useStyles } from '../../../styles';
import { useFormStyles } from './styles';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../store/rootReducer';

interface TriggersI {
  triggers: TriggerI[];
  triggerDateErrors: {
    [index: number]: boolean;
  };
  setTriggerDateErrors: React.Dispatch<
    React.SetStateAction<{
      [index: number]: boolean;
    }>
  >;
  setTriggers: React.Dispatch<React.SetStateAction<TriggerI[]>>;
  isEditTable: boolean;
  firstTriggerDateError: boolean;
  setFirstTriggerDateError: React.Dispatch<React.SetStateAction<boolean>>;
  disableAdd: boolean;
  isOutbondMode?: boolean;
}

const Triggers = ({
  triggers,
  triggerDateErrors,
  setTriggerDateErrors,
  setTriggers,
  isEditTable,
  firstTriggerDateError,
  setFirstTriggerDateError,
  disableAdd,
  isOutbondMode,
}: TriggersI) => {
  const { classes } = useStyles();
  const { classes: formClasses } = useFormStyles();
  const { selectedRecallAlert } = useSelector((state: RootState) => state.recalls);
  const formattedListGeneratedDate = selectedRecallAlert?.listGeneratedDate?.length
    ? dayjs(selectedRecallAlert?.listGeneratedDate).add(1, 'day').format('dddd, MMM D, YYYY')
    : '';

  const handleAddTrigger = () => {
    if (isOutbondMode) {
      setTriggers(prev => [...prev, { daysFromListGeneration: 0, scheduledTime: '' }]);
    } else {
      setTriggers(prev => [
        ...prev,
        { daysFromListGeneration: 0, scheduledTime: '', isPaused: true },
      ]);
    }
  };

  const handleRemoveTrigger = (index: number) => {
    setFirstTriggerDateError(false);
    setTriggerDateErrors(prev => ({
      ...prev,
      [index]: false,
    }));
    setTriggers(prev => prev.filter((trigger, i) => i !== index));
  };

  const handleTriggerChange = (index: number, field: keyof TriggerI, newValue: string) => {
    setTriggerDateErrors(prev => ({
      ...prev,
      [index]: false,
    }));

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
      <span
        className={clsx(classes.audienceParagraph, {
          [formClasses.triggersTitleWithItems]: !isOutbondMode && triggers.length,
        })}
      >
        Triggers
      </span>
      {!isOutbondMode && selectedRecallAlert?.listGeneratedDate?.length ? (
        <>
          <div className={formClasses.listGeneratedInfo}>
            <p className={formClasses.listGeneratedLabel}>List Generated On</p>
            <p className={formClasses.listGeneratedValue}>{formattedListGeneratedDate}</p>
          </div>
        </>
      ) : (
        <></>
      )}
      {triggers.length ? (
        <div className={classes.criteriaWrapper}>
          {triggers.map((trigger, index) => {
            return (
              <div
                key={index}
                className={clsx(classes.triggerItemWrapper, {
                  [formClasses.triggerItemWrapperWithPadding]: !isOutbondMode,
                })}
              >
                <div className={classes.triggerItem}>
                  <span className={classes.contactCounter}>
                    {numberToOrdinalWord(index + 1)} Contact
                  </span>
                  {isEditTable ? (
                    <div
                      className={formClasses.removeTriggerButton}
                      onClick={() => handleRemoveTrigger(index)}
                    >
                      <CloseNew />
                    </div>
                  ) : null}
                </div>

                <div className={classes.triggersFormWrapper}>
                  <div className={formClasses.triggerControlsRow}>
                    <div
                      className={clsx(classes.triggersForm, {
                        [formClasses.triggerDaysFieldRecall]: !isOutbondMode,
                      })}
                    >
                      <TextField
                        fullWidth
                        labelFitContent={true}
                        disabled={!isEditTable}
                        type="number"
                        inputProps={{ min: 0 }}
                        error={
                          !Number.isInteger(Number(trigger.daysFromListGeneration)) ||
                          triggerDateErrors[index]
                        }
                        label="Days from list generation"
                        placeholder=""
                        onChange={e =>
                          handleTriggerChange(index, 'daysFromListGeneration', e.target.value || '')
                        }
                        value={+trigger.daysFromListGeneration}
                      />
                    </div>
                    <div
                      className={clsx(classes.triggerClockWrapper, {
                        [formClasses.triggerClockFieldRecall]: !isOutbondMode,
                      })}
                    >
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
                          id: 'Scheduled time',
                          className: !isOutbondMode ? formClasses.scheduledTimeInput : undefined,
                          placeholder: '',
                          error: index === 0 && firstTriggerDateError,
                          endAdornment: !isOutbondMode && isEditTable ? <Time width={26} /> : null,
                        }}
                      />
                    </div>
                  </div>
                  {!isOutbondMode && formattedListGeneratedDate ? (
                    <div className={formClasses.recallTriggerStats}>
                      <span className={formClasses.recallTriggerStatsDate}>
                        {formattedListGeneratedDate}
                      </span>
                      <div className={formClasses.recallTriggerStatsCounters}>
                        <span className={formClasses.recallTriggerStatsCounter}>
                          Estimated Recipients: {selectedRecallAlert?.estimatedRecipients || 0}
                        </span>
                        <span className={formClasses.recallTriggerStatsCounter}>
                          Actual Recipients: {selectedRecallAlert?.actualRecipients || 0}
                        </span>
                      </div>
                    </div>
                  ) : null}
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
          disabled={triggers.length === 5 || disableAdd}
          size="large"
        >
          <AddCircleOutline className={triggers.length === 5 || disableAdd ? 'isDisabled' : ''} />
          <span
            className={clsx(classes.addCriteriaButton, {
              [formClasses.disabledAddButtonText]: triggers.length === 5 || disableAdd,
            })}
          >
            Add {isOutbondMode ? 'Contact' : 'Trigger'}
          </span>
        </IconButton>
      ) : null}
    </>
  );
};

export default Triggers;
