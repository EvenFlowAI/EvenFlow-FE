import React from 'react';
import clsx from 'clsx';
import { IconButton } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import { RecallEventStatus, TriggerI } from '../../types';
import { ReactComponent as EmptyCalendar } from '../../../../../../assets/img/empthyCalendar.svg';
import dayjs from 'dayjs';
import { useStyles } from '../../../styles';
import { useFormStyles } from './styles';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../store/rootReducer';
import { IRecallAlert } from '../../../../../../store/reducers/recall/types';
import TriggerRow from './TriggerRow';

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
  onAddTrigger,
  classes,
  formClasses,
}) => {
  if (!isEditTable) {
    return null;
  }

  const isDisabledByLimit = triggersLength === 5;
  const isDisabledByMode = isOutboundMode ? disableAdd : false;
  const isDisabled = isDisabledByLimit || isDisabledByMode;

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
        Add Contact
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
    ? dayjs(selectedRecallAlert?.listGeneratedDate).format('dddd, MMM D, YYYY')
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
    if (updatedRecallAlert?.status === RecallEventStatus.Running && triggers?.length <= 1) return;
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
          {triggers.map((trigger, index) => (
            <TriggerRow
              key={index}
              trigger={trigger}
              index={index}
              isOutboundMode={isOutboundMode}
              isEditTable={isEditTable}
              updatedRecallAlert={updatedRecallAlert}
              triggerDateErrors={triggerDateErrors}
              firstTriggerDateError={firstTriggerDateError}
              formattedListGeneratedDate={formattedListGeneratedDate}
              classes={classes}
              formClasses={formClasses}
              onRemoveTrigger={handleRemoveTrigger}
              onTriggerChange={handleTriggerChange}
            />
          ))}
        </div>
      ) : isOutboundMode ? null : (
        <div className={formClasses.emptyTriggersState}>
          <EmptyCalendar />
          <span className={formClasses.emptyTriggersStateText}>No triggers configured yet</span>
        </div>
      )}
      <AddTriggerAction
        isEditTable={isEditTable}
        triggersLength={triggers.length}
        disableAdd={disableAdd}
        isOutboundMode={isOutboundMode}
        onAddTrigger={handleAddTrigger}
        classes={classes}
        formClasses={formClasses}
      />
    </>
  );
};

export default Triggers;
