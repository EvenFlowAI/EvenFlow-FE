import React, { useEffect, useMemo, useState } from 'react';
import {
  BaseModal,
  DialogContent,
  DialogTitle,
} from '../../../../components/modals/BaseModal/BaseModal';
import { DialogProps } from '../../../../components/modals/BaseModal/types';
import {
  ETransportationDays,
  ETransportationType,
  ITransportationOptionFull,
} from '../../../../store/reducers/transportationNeeds/types';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadAllAssignedServiceRequests,
  setFormIsChecked,
  setRules,
} from '../../../../store/reducers/serviceRequests/actions';
import { RootState } from '../../../../store/rootReducer';
import { Divider } from '@mui/material';
import { removeTransportationOptionRule } from '../../../../store/reducers/transportationNeeds/actions';
import { TextField } from '../../../../components/formControls/TextFieldStyled/TextField';
import { getOptions } from '../../../../utils/utils';
import { useStyles } from './styles';
import { TOption } from '../types';
import { useException } from '../../../../hooks/useException/useException';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { useMessage } from '../../../../hooks/useMessage/useMessage';
import RemoveRule from '../../../../components/modals/admin/RemoveRule/RemoveRule';
import { useModal } from '../../../../hooks/useModal/useModal';
import { TError } from '../../../booking/CustomerSelect/ReturningCustomerForAdmin/types';
import { transformTransportationRules, TRuleState } from './helper';
import ExpandedRulesRender from './layouts/ExpandedRulesRender';
import ClocksRender from './layouts/ClocksRender';
import OpCodeFieldsAndDayOfWeekRender from './layouts/OpCodeFieldsAndDayOfWeekRender';
import ModalButtons from './layouts/ModalButtons';
import RuleHeaderWrapper from './layouts/RuleHeaderWrapper';
import AddRuleRender from './layouts/AddRuleRender';
import { EFilterMode } from '../../../../store/reducers/pods/types';

type TEditTransportationOptionDialogProps = {
  editingElement: ITransportationOptionFull | null;
};

export const EditTransportationModal: React.FC<
  DialogProps & TEditTransportationOptionDialogProps
> = ({ editingElement, ...props }) => {
  const { rules, formIsChecked } = useSelector((state: RootState) => state.serviceRequests);
  const [dayOFWeekOptions, setDayOfWeekOptions] = useState<TOption[]>([]);
  const [filterModeOptions, setFilterModeOptions] = useState<TOption[]>([]);

  const [errors, setErrors] = useState<string[]>([]);

  const { selectedSC } = useSCs();
  const dispatch = useDispatch();
  const { classes } = useStyles();
  const showError = useException();
  const showMessage = useMessage();
  const { onOpen, isOpen, onClose } = useModal();
  const [ruleForDeleting, setRuleForDeleting] = useState<TRuleState | null>(null);

  useEffect(() => {
    setDayOfWeekOptions(() => {
      const days = Object.keys(ETransportationDays).filter(
        key => Number.isNaN(+key) && key !== 'EveryDay'
      );
      return getOptions(days);
    });

    setFilterModeOptions(() => {
      const filterModes = Object.keys(EFilterMode).filter(key => Number.isNaN(+key));
      return getOptions(filterModes);
    });
  }, []);

  useEffect(() => {
    if (selectedSC) {
      dispatch(loadAllAssignedServiceRequests(selectedSC.id));
    }
  }, [selectedSC]);

  // for adding rules to localState
  useEffect(() => {
    if (editingElement && props.open) {
      const modifiedRules = transformTransportationRules(
        editingElement,
        dayOFWeekOptions,
        filterModeOptions
      );
      dispatch(setRules(modifiedRules));
      setErrors([]);
    }
  }, [editingElement, props.open]);

  const updateLocalRule = (index: number, patch: Partial<TRuleState>) => {
    dispatch(setRules(rules.map((r, i) => (i === index ? { ...r, ...patch, dirty: true } : r))));
    setErrors([]);
  };

  const onError = (e: any) => {
    showError(e);
    if (e.response?.data?.errors) {
      const data = [...e.response.data.errors];
      setErrors(() => data.map((err: TError): string => err.message).filter(el => el !== null));
    }
    if (e.response?.data?.message) {
      setErrors(prevState => [...prevState, e.response.data.message]);
    }
  };

  const handleRemoveRule = () => {
    if (selectedSC?.id && ruleForDeleting) {
      dispatch(
        removeTransportationOptionRule(
          selectedSC.id,
          String(ruleForDeleting?.id),
          () => {
            onClose();
            dispatch(setRules(rules.filter((rule, _) => rule?.id !== ruleForDeleting?.id)));
            setRuleForDeleting(null);
            showMessage('Rule deleted');
            onCancel();
          },
          onError
        )
      );
    }
  };

  const onCancel = () => {
    const expandedIndex = rules.findIndex(rule => rule.expanded);
    if (rules[expandedIndex]?.dirty) {
      showError('Please save or cancel rule changes before closing');
      return;
    }
    dispatch(setFormIsChecked(false));
    dispatch(setRules([]));
    props.onClose();
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reordered = Array.from(rules);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    const updated = reordered.map((item, index) => ({
      ...item,
      orderIndex: index,
    }));

    dispatch(setRules(updated));
  };

  const stableKeys = useMemo(() => {
    return rules.map((rule, index) =>
      rule.id ? `rule-${rule.id}` : `new-rule-${rule.orderIndex || index}`
    );
  }, [rules]);

  return (
    <BaseModal {...props} width={600} onClose={onCancel}>
      <DialogTitle onClose={onCancel}>Manage Rules</DialogTitle>
      {rules.length === 0 && <Divider style={{ margin: '10px 0 20px 0' }} />}
      <DialogContent>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="rules-droppable">
            {provided => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {rules.map((rule, index) => (
                  <Draggable
                    isDragDisabled={!!rules?.find(rule => rule.expanded)}
                    key={stableKeys[index]}
                    draggableId={stableKeys[index]}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          ...provided.draggableProps.style,
                          marginBottom: 16,
                          overflow: 'hidden',
                          background: snapshot.isDragging ? '#e3f2fd' : 'white',
                        }}
                      >
                        {index === 0 ? <Divider style={{ margin: '10px 0 12px 0' }} /> : null}
                        <RuleHeaderWrapper
                          rule={rule}
                          setRuleForDeleting={setRuleForDeleting}
                          updateLocalRule={updateLocalRule}
                          index={index}
                          dragHandleProps={provided.dragHandleProps}
                          onOpen={onOpen}
                        />

                        {rule.expanded && (
                          <div className={classes.expandedRuleWrapper}>
                            <TextField
                              fullWidth
                              className={classes.ruleNameInput}
                              label="RULE NAME"
                              placeholder="Rule Name"
                              value={rule.name ?? ''}
                              error={
                                errors.some(e => e.toLowerCase().includes('name')) && formIsChecked
                              }
                              onChange={e => updateLocalRule(index, { name: e.target.value })}
                            />

                            <OpCodeFieldsAndDayOfWeekRender
                              dayOFWeekOptions={dayOFWeekOptions}
                              filterModeOptions={filterModeOptions}
                              index={index}
                              errors={errors}
                              updateLocalRule={updateLocalRule}
                            />

                            <div className={classes.label}>Time Of Day</div>
                            <ClocksRender
                              disabled={editingElement?.type === ETransportationType.PickUpDelivery}
                              errors={errors}
                              updateLocalRule={updateLocalRule}
                              index={index}
                              rule={rule}
                            />

                            <div className={classes.capacityWrapper}>
                              <TextField
                                fullWidth
                                type="number"
                                inputProps={{ min: 1, step: 1 }}
                                label="Daily Capacity"
                                placeholder="Type Number"
                                value={rule.capacity}
                                error={
                                  errors.some(
                                    e => e.includes('Capacity') || e.includes('configuration')
                                  ) && formIsChecked
                                }
                                onChange={e => {
                                  const value = e.target.value;
                                  updateLocalRule(index, {
                                    capacity: value === '' ? undefined : Number(value),
                                  });
                                }}
                              />
                            </div>
                          </div>
                        )}
                        {rules.length !== index ? (
                          <Divider style={{ margin: '10px 0 0 0' }} />
                        ) : null}
                        {rule.expanded ? (
                          <ExpandedRulesRender
                            rule={rule}
                            editingElement={editingElement}
                            dayOFWeekOptions={dayOFWeekOptions}
                            filterModeOptions={filterModeOptions}
                            index={index}
                            onError={onError}
                            setErrors={setErrors}
                          />
                        ) : null}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {(!rules.length || rules.every(rule => !rule.expanded)) && rules.length < 5 && (
          <AddRuleRender />
        )}
      </DialogContent>
      {rules?.every(rule => !rule.expanded) && (
        <ModalButtons editingElement={editingElement} onError={onError} onCancel={onCancel} />
      )}
      <RemoveRule
        open={isOpen}
        onClose={onClose}
        ruleName={ruleForDeleting?.name || ''}
        handleRemoveRule={handleRemoveRule}
      />
    </BaseModal>
  );
};
