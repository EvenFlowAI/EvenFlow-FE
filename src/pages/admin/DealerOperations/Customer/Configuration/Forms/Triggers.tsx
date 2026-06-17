import React from 'react';
import clsx from 'clsx';
import { numberToOrdinalWord } from '../../../helper';
import { IconButton } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import { RecallEventStatus, TriggerI } from '../../types';
import ClockTimePicker from '../../../../../../components/pickers/ClockTimePicker/ClockTimePicker';
import { TextField } from '../../../../../../components/formControls/TextFieldStyled/TextField';
import { ReactComponent as CloseNew } from '../../../../../../assets/img/close-new.svg';
import { ReactComponent as Time } from '../../../../../../assets/img/time.svg';
import dayjs from 'dayjs';
import { useStyles } from '../../../styles';
import { useFormStyles } from './styles';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../store/rootReducer';
import { IRecallAlert } from '../../../../../../store/reducers/recall/types';

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
  isOutboundMode?: boolean;
  updatedRecallAlert?: IRecallAlert | null;
}

interface IAddTriggerAction {
  isEditTable: boolean;
  triggersLength: number;
  disableAdd: boolean;
  isOutboundMode?: boolean;
  updatedRecallAlert?: IRecallAlert | null;
  onAddTrigger: () => void;
  classes: ReturnType<typeof useStyles>['classes'];
  formClasses: ReturnType<typeof useFormStyles>['classes'];
}

const AddTriggerAction: React.FC<IAddTriggerAction> = ({
  isEditTable,
  triggersLength,
  disableAdd,
  isOutboundMode,
  updatedRecallAlert,
  onAddTrigger,
  classes,
  formClasses,
}) => {
  if (!isEditTable) {
    return null;
  }

  const isDisabledByLimit = triggersLength === 5;
  const isDisabledByMode = isOutboundMode ? disableAdd : false;
  const isDisabledByStatus = updatedRecallAlert?.status === RecallEventStatus.Running;
  const isDisabled = isDisabledByLimit || isDisabledByMode || isDisabledByStatus;

  return (
    <IconButton
      onClick={onAddTrigger}
      className={classes.iconPlus}
      disabled={isDisabled}
      size="large"
    >
      <AddCircleOutline className={isDisabledByLimit || isDisabledByMode ? 'isDisabled' : ''} />
      <span
        className={clsx(classes.addCriteriaButton, {
          [formClasses.disabledAddButtonText]: isDisabledByLimit || isDisabledByMode,
        })}
      >
        Add {isOutboundMode ? 'Contact' : 'Trigger'}
      </span>
    </IconButton>
  );
};

const Triggers = ({
  updatedRecallAlert,
  triggers,
  triggerDateErrors,
  setTriggerDateErrors,
  setTriggers,
  isEditTable,
  firstTriggerDateError,
  setFirstTriggerDateError,
  disableAdd,
  isOutboundMode,
}: TriggersI) => {
  const { classes } = useStyles();
  const { classes: formClasses } = useFormStyles();
  const { selectedRecallAlert } = useSelector((state: RootState) => state.recalls);
  const formattedListGeneratedDate = selectedRecallAlert?.listGeneratedDate?.length
    ? dayjs(selectedRecallAlert?.listGeneratedDate).add(1, 'day').format('dddd, MMM D, YYYY')
    : '';

  const handleAddTrigger = () => {
    if (isOutboundMode) {
      setTriggers(prev => [...prev, { daysFromListGeneration: 0, scheduledTime: '' }]);
    } else {
      setTriggers(prev => [
        ...prev,
        { daysFromListGeneration: 0, scheduledTime: '', isPaused: true },
      ]);
    }
  };

  const handleRemoveTrigger = (index: number) => {
    if (updatedRecallAlert?.status === RecallEventStatus.Running) return;

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
          [formClasses.triggersTitleWithItems]: !isOutboundMode && triggers.length,
        })}
      >
        Triggers
      </span>
      {!isOutboundMode && selectedRecallAlert?.listGeneratedDate?.length ? (
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
                  [formClasses.triggerItemWrapperWithPadding]: !isOutboundMode,
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
                        [formClasses.triggerDaysFieldRecall]: !isOutboundMode,
                      })}
                    >
                      <TextField
                        fullWidth
                        labelFitContent={true}
                        disabled={
                          !isEditTable || updatedRecallAlert?.status === RecallEventStatus.Running
                        }
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
                        [formClasses.triggerClockFieldRecall]: !isOutboundMode,
                      })}
                    >
                      <ClockTimePicker
                        value={
                          trigger.scheduledTime ? dayjs(trigger.scheduledTime, 'HH:mm:ss') : null
                        }
                        disabled={
                          !isEditTable || updatedRecallAlert?.status === RecallEventStatus.Running
                        }
                        onChange={e =>
                          handleTriggerChange(index, 'scheduledTime', dayjs(e).format('HH:mm:ss'))
                        }
                        label={'Scheduled time'}
                        InputProps={{
                          id: 'Scheduled time',
                          className: !isOutboundMode ? formClasses.scheduledTimeInput : undefined,
                          placeholder: '',
                          error: index === 0 && firstTriggerDateError,
                          endAdornment: !isOutboundMode && isEditTable ? <Time width={26} /> : null,
                        }}
                      />
                    </div>
                  </div>
                  {!isOutboundMode && formattedListGeneratedDate ? (
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
      <AddTriggerAction
        isEditTable={isEditTable}
        triggersLength={triggers.length}
        disableAdd={disableAdd}
        isOutboundMode={isOutboundMode}
        updatedRecallAlert={updatedRecallAlert}
        onAddTrigger={handleAddTrigger}
        classes={classes}
        formClasses={formClasses}
      />
    </>
  );
};

export default Triggers;
