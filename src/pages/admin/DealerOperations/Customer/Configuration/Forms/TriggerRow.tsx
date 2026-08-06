import React from 'react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { RecallEventStatus, TriggerI } from '../../types';
import ClockTimePicker from '../../../../../../components/pickers/ClockTimePicker/ClockTimePicker';
import { TextField } from '../../../../../../components/formControls/TextFieldStyled/TextField';
import { ReactComponent as CloseNew } from '../../../../../../assets/img/close-new.svg';
import { ReactComponent as Time } from '../../../../../../assets/img/time.svg';
import { numberToOrdinalWord } from '../../../helper';
import { useStyles } from '../../../styles';
import { useFormStyles } from './styles';
import { IRecallAlert } from '../../../../../../store/reducers/recall/types';

interface ITriggerRow {
  trigger: TriggerI;
  index: number;
  isOutboundMode?: boolean;
  isEditTable: boolean;
  updatedRecallAlert?: IRecallAlert | null;
  triggerDateErrors: {
    [index: number]: boolean;
  };
  firstTriggerDateError: boolean;
  formattedListGeneratedDate: string;
  classes: ReturnType<typeof useStyles>['classes'];
  formClasses: ReturnType<typeof useFormStyles>['classes'];
  onRemoveTrigger: (index: number) => void;
  onTriggerChange: (index: number, field: keyof TriggerI, newValue: string) => void;
}

const TriggerRow: React.FC<ITriggerRow> = ({
  trigger,
  index,
  isOutboundMode,
  isEditTable,
  updatedRecallAlert,
  triggerDateErrors,
  firstTriggerDateError,
  formattedListGeneratedDate,
  classes,
  formClasses,
  onRemoveTrigger,
  onTriggerChange,
}) => {
  return (
    <div
      className={clsx(classes.triggerItemWrapper, {
        [formClasses.triggerItemWrapperWithPadding]: !isOutboundMode,
      })}
    >
      <div className={classes.triggerItem}>
        <span className={classes.contactCounter}>{numberToOrdinalWord(index + 1)} Contact</span>
        {isEditTable ? (
          <div className={formClasses.removeTriggerButton} onClick={() => onRemoveTrigger(index)}>
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
              disabled={!isEditTable}
              type="number"
              inputProps={{ min: 0 }}
              error={
                !Number.isInteger(Number(trigger.daysFromListGeneration)) ||
                triggerDateErrors[index]
              }
              label="Days from list generation"
              placeholder=""
              onChange={e => onTriggerChange(index, 'daysFromListGeneration', e.target.value || '')}
              value={+trigger.daysFromListGeneration}
            />
          </div>
          <div
            className={clsx(classes.triggerClockWrapper, {
              [formClasses.triggerClockFieldRecall]: !isOutboundMode,
            })}
          >
            <ClockTimePicker
              value={trigger.scheduledTime ? dayjs(trigger.scheduledTime, 'HH:mm:ss') : null}
              disabled={!isEditTable}
              onChange={e => onTriggerChange(index, 'scheduledTime', dayjs(e).format('HH:mm:ss'))}
              label={'Scheduled time'}
              InputProps={{
                id: 'Scheduled time',
                className: !isOutboundMode ? formClasses.scheduledTimeInput : undefined,
                placeholder: '',
                error: index === 0 && firstTriggerDateError,
                endAdornment:
                  !isOutboundMode &&
                  isEditTable &&
                  updatedRecallAlert?.status !== RecallEventStatus.Running ? (
                    <Time width={26} />
                  ) : null,
              }}
            />
          </div>
        </div>
        {!isOutboundMode && formattedListGeneratedDate ? (
          <div className={formClasses.recallTriggerStats}>
            <span className={formClasses.recallTriggerStatsDate}>
              {dayjs(formattedListGeneratedDate)
                .add(trigger.daysFromListGeneration, 'day')
                .format('dddd, MMM D, YYYY')}
            </span>
            <div className={formClasses.recallTriggerStatsCounters}>
              <span className={formClasses.recallTriggerStatsCounter}>
                Estimated Recipients: {trigger?.estimatedRecipients || 0}
              </span>
              <span className={formClasses.recallTriggerStatsCounter}>
                Actual Recipients: {trigger?.actualRecipients || 0}
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TriggerRow;
