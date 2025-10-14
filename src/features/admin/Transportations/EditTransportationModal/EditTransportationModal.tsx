import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BaseModal,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '../../../../components/modals/BaseModal/BaseModal';
import { DialogProps } from '../../../../components/modals/BaseModal/types';
import {
  ETransportationDays,
  ITransportationOptionFull,
} from '../../../../store/reducers/transportationNeeds/types';
import { useDispatch, useSelector } from 'react-redux';
import { loadAllAssignedServiceRequests } from '../../../../store/reducers/serviceRequests/actions';
import { RootState } from '../../../../store/rootReducer';
import { autocompleteRender } from '../../../../utils/autocompleteRenders';
import {
  Autocomplete,
  Button,
  Checkbox,
  Divider,
  IconButton,
  Switch,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  CheckBoxOutlineBlank,
  CheckBoxOutlined,
  ExpandLess,
  ExpandMore,
  QueryBuilder,
} from '@mui/icons-material';
import {
  addTransportationOptionRule,
  editTransportationOptionRule,
  patchUpdateTransportationRule,
  removeTransportationOptionRule,
} from '../../../../store/reducers/transportationNeeds/actions';
import { TextField } from '../../../../components/formControls/TextFieldStyled/TextField';
import { getOptions } from '../../../../utils/utils';
import { useMultipleACStyles, useStyles } from './styles';
import { TOption, TTimeObject } from '../types';
import { useException } from '../../../../hooks/useException/useException';
import { useSCs } from '../../../../hooks/useSCs/useSCs';
import ClockTimePicker from '../../../../components/pickers/ClockTimePicker/ClockTimePicker';
import dayjs from 'dayjs';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { useMessage } from '../../../../hooks/useMessage/useMessage';
import RemoveRule from '../../../../components/modals/admin/RemoveRule/RemoveRule';
import { useModal } from '../../../../hooks/useModal/useModal';
import { ReactComponent as DotsIcon } from '../../../../assets/img/dots.svg';
import { TError } from '../../../booking/CustomerSelect/ReturningCustomerForAdmin/types';

type TEditTransportationOptionDialogProps = {
  editingElement: ITransportationOptionFull | null;
};

type TRuleState = {
  id?: number;
  name: string;
  daysOfWeek: TOption[];
  timeOfDay: TTimeObject | null;
  serviceRequests: TOption[];
  capacity?: number;
  isAllServiceRequestsIncluded?: boolean;

  expanded: boolean;
  state: number;
  orderIndex: number;
};

export const EditTransportationModal: React.FC<
  DialogProps & TEditTransportationOptionDialogProps
> = ({ editingElement, ...props }) => {
  const { allAssignedList } = useSelector((state: RootState) => state.serviceRequests);
  const [dayOFWeekOptions, setDayOfWeekOptions] = useState<TOption[]>([]);
  const [rules, setRules] = useState<TRuleState[]>([]);
  const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);

  const { selectedSC } = useSCs();
  const dispatch = useDispatch();
  const { classes } = useStyles();
  const { classes: multipleACSClasses } = useMultipleACStyles();
  const showError = useException();
  const showMessage = useMessage();
  const { onOpen, isOpen, onClose } = useModal();
  const [ruleForDeleting, setRuleForDeleting] = useState<TRuleState | null>(null);

  const requestsOptions = useMemo(() => {
    return allAssignedList.map(item => ({
      name: item.serviceRequest.code,
      value: item.id,
    }));
  }, [allAssignedList]);

  useEffect(() => {
    setDayOfWeekOptions(() => {
      const days = Object.keys(ETransportationDays).filter(
        key => Number.isNaN(+key) && key !== 'EveryDay'
      );
      return getOptions(days);
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
      if (editingElement.rules?.length) {
        const unblockedRules = [...editingElement.rules];

        const modifiedRules = unblockedRules
          .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
          .map(rule => {
            const [startHours, startMinutes, startSeconds] =
              rule.timeOfDay?.start?.split(':') || [];
            const [endHours, endMinutes, endSeconds] = rule.timeOfDay?.end?.split(':') || [];
            const days =
              dayOFWeekOptions.filter(item => rule.dayOfWeeks?.includes(item.value)) || [];
            const updatedServiceRequests =
              rule.serviceRequests?.map(item => ({
                value: item.id,
                name: item.code,
              })) || [];

            return {
              id: rule.id,
              name: rule.name,
              daysOfWeek: days,
              timeOfDay: {
                start: dayjs.utc().hour(+startHours).minute(+startMinutes).second(+startSeconds),
                end: dayjs.utc().hour(+endHours).minute(+endMinutes).second(+endSeconds),
              },
              serviceRequests: updatedServiceRequests,
              isAllServiceRequestsIncluded: rule?.isAllServiceRequestsIncluded,
              capacity: rule.capacity,
              expanded: false,
              state: rule.state,
              orderIndex: rule.orderIndex,
            };
          });
        setRules(modifiedRules);
        setErrors([]);
      }
    }
  }, [editingElement, props.open]);

  const updateLocalRule = (index: number, patch: Partial<TRuleState>) => {
    setRules(prev => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
    setErrors([]);
  };

  const addRule = () => {
    setRules(prev => [
      ...prev,
      {
        name: '',
        daysOfWeek: [],
        serviceRequests: [],
        timeOfDay: null,
        capacity: undefined,
        expanded: true,
        state: 1,
        orderIndex: rules.length + 1,
      },
    ]);
  };

  const onError = (e: any) => {
    showError(e);
    if (e.response?.data?.errors) {
      const data = [...e.response.data.errors];
      setErrors(() => data.map((err: TError): string => err.message).filter(el => el !== null));
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
            setRules(prev => prev.filter((rule, _) => rule?.id !== ruleForDeleting?.id));
            setRuleForDeleting(null);
          },
          onError
        )
      );
    }
  };

  const removeRule = (id: string) => {
    if (selectedSC?.id) {
      setRuleForDeleting(rules.find(rule => rule?.id === +id) || null);
      onOpen();
    }
  };

  const removeLocalRule = (index: number) => {
    setRules(prev => prev.filter((_, i) => i !== index));
  };

  const toggleExpand = (index: number) => {
    setRules(prev =>
      prev.map((r, i) => ({
        ...r,
        expanded: i === index ? !r.expanded : false,
      }))
    );
  };

  const onAddRule = (ruleIndex: number) => {
    setFormIsChecked(true);
    if (selectedSC && editingElement) {
      let newRule;
      rules.forEach((r, index) => {
        if (index === ruleIndex) {
          newRule = {
            name: r.name,
            transportationOptionId: editingElement.id,
            timeOfDay: r.timeOfDay
              ? {
                  start: dayjs(r.timeOfDay.start).format('HH:mm:ss'),
                  end: dayjs(r.timeOfDay.end).format('HH:mm:ss'),
                }
              : undefined,
            serviceRequests: r.serviceRequests.map(item => item.value),
            dayOfWeeks: r.daysOfWeek.map(item => item.value),
            capacity: r.capacity ? Number(r.capacity) : undefined,
            state: r.state,
            orderIndex: index,
          };
        }
      });

      if (newRule) {
        dispatch(
          addTransportationOptionRule(
            selectedSC.id,
            newRule,
            () => {
              setFormIsChecked(false);
              showMessage('Created new rule');
              toggleExpand(ruleIndex);
            },
            onError
          )
        );
      }
    }
  };

  const onEditRule = (id: number, ruleIndex: number) => {
    setFormIsChecked(true);
    if (selectedSC && editingElement) {
      let newRule;

      rules.forEach((r, index) => {
        if (r.id === id) {
          newRule = {
            name: r.name,
            transportationOptionId: editingElement.id,
            timeOfDay: r.timeOfDay
              ? {
                  start: dayjs(r.timeOfDay.start).format('HH:mm:ss'),
                  end: dayjs(r.timeOfDay.end).format('HH:mm:ss'),
                }
              : undefined,
            serviceRequests: r.serviceRequests.map(item => item.value),
            dayOfWeeks: r.daysOfWeek.map(item => item.value),
            capacity: r.capacity ? Number(r.capacity) : undefined,
            state: r.state,
            orderIndex: index,
          };
        }
      });

      if (newRule) {
        dispatch(
          editTransportationOptionRule(
            selectedSC.id,
            newRule,
            id,
            () => {
              setFormIsChecked(false);
              showMessage('Rule updated');
              toggleExpand(ruleIndex);
            },
            onError
          )
        );
      }
    }
  };

  const patchUpdateRule = () => {
    if (selectedSC && editingElement && rules.length) {
      const rulesWithId = rules.filter(rule => rule.id);
      if (rulesWithId.length) {
        dispatch(
          patchUpdateTransportationRule(
            selectedSC.id,
            rulesWithId.map(rule => {
              return {
                transportationOptionRuleId: rule.id || 0,
                state: rule.state,
                orderIndex: rule.orderIndex,
              };
            }),
            () => {},
            onError
          )
        );
      }
    }
  };

  const onCancel = () => {
    setFormIsChecked(false);
    setRules([]);
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

    setRules(updated);
  };

  const onRequestCheckboxChange = useCallback(
    (ruleIdx: number, option: TOption) => {
      const current = rules[ruleIdx].serviceRequests ?? [];

      const exists = current.some(o => o.value === option.value);
      let next = exists ? current.filter(o => o.value !== option.value) : [...current, option];

      updateLocalRule(ruleIdx, { serviceRequests: next });
      setFormIsChecked(false);
    },
    [rules, requestsOptions]
  );

  const onRequestChange = useCallback(
    (ruleIdx: number, _e: any, value: TOption[]) => {
      setFormIsChecked(false);
      updateLocalRule(ruleIdx, { serviceRequests: value });
    },
    [requestsOptions]
  );

  const makeRenderRequestOption = useCallback(
    (ruleIdx: number) => (props: React.HTMLAttributes<HTMLLIElement>, option: TOption) => {
      const selected = rules[ruleIdx].serviceRequests ?? [];
      const checked = selected.some(item => item.value === option.value);

      return (
        <li
          {...props}
          key={`${option.name}-${option.value}`}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Checkbox
            color="primary"
            icon={
              checked ? (
                <CheckBoxOutlined htmlColor="#3855FE" />
              ) : (
                <CheckBoxOutlineBlank htmlColor="#DADADA" />
              )
            }
            checked={checked}
            onClick={e => e.stopPropagation()}
            onChange={() => onRequestCheckboxChange(ruleIdx, option)}
          />
          {option.name}
        </li>
      );
    },
    [rules, onRequestCheckboxChange]
  );

  const onDayCheckboxChange = useCallback(
    (ruleIdx: number, option: TOption) => {
      const current = rules[ruleIdx].daysOfWeek ?? [];

      const exists = current.some(o => o.value === option.value);
      const next = exists ? current.filter(o => o.value !== option.value) : [...current, option];

      updateLocalRule(ruleIdx, { daysOfWeek: next });
      setFormIsChecked(false);
    },
    [rules]
  );

  const onDaysChange = useCallback((ruleIdx: number, _e: any, value: TOption[]) => {
    setFormIsChecked(false);
    updateLocalRule(ruleIdx, { daysOfWeek: value });
  }, []);

  const makeRenderDayOption = useCallback(
    (ruleIdx: number) => (props: React.HTMLAttributes<HTMLLIElement>, option: TOption) => {
      const selected = rules[ruleIdx].daysOfWeek ?? [];

      const checked = selected.some(item => item.value === option.value);

      return (
        <li
          {...props}
          key={`${option.name}-${option.value}`}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Checkbox
            color="primary"
            icon={
              checked ? (
                <CheckBoxOutlined htmlColor="#3855FE" />
              ) : (
                <CheckBoxOutlineBlank htmlColor="#DADADA" />
              )
            }
            checked={checked}
            onClick={e => e.stopPropagation()}
            onChange={() => onDayCheckboxChange(ruleIdx, option)}
          />
          {option.name}
        </li>
      );
    },
    [rules, onDayCheckboxChange]
  );

  const resetRuleToOriginal = (ruleIndex: number) => {
    if (!editingElement || !editingElement.rules) return;
    const original = editingElement.rules[ruleIndex];
    if (!original) return;

    const [startHours, startMinutes, startSeconds] = original.timeOfDay?.start?.split(':') || [];
    const [endHours, endMinutes, endSeconds] = original.timeOfDay?.end?.split(':') || [];
    const days = dayOFWeekOptions.filter(item => original.dayOfWeeks?.includes(item.value)) || [];
    const updatedServiceRequests =
      original.serviceRequests?.map(item => ({
        value: item.id,
        name: item.code,
      })) || [];

    const resetRule: TRuleState = {
      id: original.id,
      name: original.name,
      daysOfWeek: days,
      timeOfDay: {
        start: dayjs.utc().hour(+startHours).minute(+startMinutes).second(+startSeconds),
        end: dayjs.utc().hour(+endHours).minute(+endMinutes).second(+endSeconds),
      },
      serviceRequests: updatedServiceRequests,
      isAllServiceRequestsIncluded: original?.isAllServiceRequestsIncluded,
      capacity: original.capacity,
      expanded: false,
      state: original.state,
      orderIndex: original.orderIndex,
    };

    setRules(prev => prev.map((rule, idx) => (idx === ruleIndex ? resetRule : rule)));
  };

  const stableKeys = useMemo(() => {
    return rules.map((rule, index) =>
      rule.id ? `rule-${rule.id}` : `new-rule-${rule.orderIndex || index}`
    );
  }, [rules.map(r => r.id || r.orderIndex).join(',')]);

  const calculateMaxVisibleTags = useCallback((selectedValues: TOption[], containerWidth = 500) => {
    if (selectedValues.length === 0) return 0;

    // Estimate average chip width based on text length
    const avgChipWidth =
      selectedValues.reduce((sum, item) => {
        // Base width + character width estimation
        return sum + (55 + item.name.length * 5); // 55 px base + ~5px per character
      }, 0) / selectedValues.length;

    // Calculate how many chips can fit in one row (accounting for margins)
    const availableWidth = containerWidth - 40; // Account for padding
    const chipsPerRow = Math.floor(availableWidth / (avgChipWidth + 4)); // 8px for margins

    // If all chips fit in one row, show all
    if (selectedValues.length <= chipsPerRow) {
      return selectedValues.length;
    }

    // Otherwise, show as many as possible in the first row minus space for "+X others"
    const othersChipWidth = 100; // Estimated width of "+X others" chip
    const maxVisibleWithOthers = Math.floor(
      (availableWidth - othersChipWidth) / (avgChipWidth + 8)
    );

    return Math.max(1, maxVisibleWithOthers);
  }, []);

  const renderChipTags = useCallback(
    (selectedValues: TOption[], getTagProps: any) => {
      const maxVisibleTags = calculateMaxVisibleTags(selectedValues);
      const visibleTags = selectedValues.slice(0, maxVisibleTags);
      const remainingCount = selectedValues.length - maxVisibleTags;

      return (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'nowrap', // Keep chips in single row
              width: '100%',
              overflow: 'hidden',
            }}
          >
            {visibleTags.map((option, tagIndex) => {
              const props = getTagProps({ index: tagIndex });
              return (
                <Chip
                  key={option.value}
                  label={option.name}
                  onDelete={props.onDelete}
                  size="medium"
                  color="primary"
                  variant="filled"
                  style={{
                    margin: '2px 4px 2px 0',
                    flexShrink: 0, // Prevent chips from shrinking
                    maxWidth: '200px',
                  }}
                  {...props}
                />
              );
            })}
            {remainingCount > 0 && (
              <Tooltip
                title={
                  <div>
                    {selectedValues.slice(maxVisibleTags).map(option => (
                      <div key={option.value}>{option.name}</div>
                    ))}
                  </div>
                }
                arrow
                placement="top"
              >
                <Chip
                  key="others"
                  label={`+${remainingCount} others`}
                  size="medium"
                  color="primary"
                  variant="filled"
                  style={{
                    margin: '2px 4px 2px 0',
                    flexShrink: 0,
                  }}
                />
              </Tooltip>
            )}
          </div>
        </div>
      );
    },
    [calculateMaxVisibleTags]
  );

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
                        <div
                          {...provided.dragHandleProps}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 12px',
                            cursor: 'grab',
                            gap: 8,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Tooltip
                              placement="top-start"
                              title="Drag to Reorder"
                              slotProps={{
                                tooltip: {
                                  sx: {
                                    background: 'white',
                                    color: 'black',
                                    fontSize: '19px',
                                    boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.25)',
                                  },
                                },
                              }}
                            >
                              <DotsIcon />
                            </Tooltip>
                            <Switch
                              checked={rule.state === 1}
                              disabled={!rule.id || rule.expanded}
                              onChange={e =>
                                updateLocalRule(index, { state: e.target.checked ? 1 : 0 })
                              }
                              size="small"
                              onClick={e => e.stopPropagation()}
                            />
                            <span style={{ fontWeight: 600 }}>
                              {rule.name?.toUpperCase() || `RULE NAME #${index + 1}`}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {rule.id && (
                              <Button
                                variant="outlined"
                                color="error"
                                size="medium"
                                onClick={e => {
                                  e.stopPropagation();
                                  rule.id ? removeRule(String(rule.id)) : removeLocalRule(index);
                                }}
                                style={{
                                  borderColor: 'red',
                                  color: 'red',
                                  textTransform: 'uppercase',
                                }}
                              >
                                Delete Rule
                              </Button>
                            )}
                            <IconButton
                              disabled={
                                rule.expanded ||
                                rules.some(r => r.orderIndex != index && r.expanded)
                              }
                              onClick={e => {
                                e.stopPropagation();
                                toggleExpand(index);
                              }}
                              size="small"
                            >
                              {rule.expanded ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                          </div>
                        </div>

                        {rule.expanded && (
                          <div style={{ padding: 12 }}>
                            <TextField
                              fullWidth
                              style={{ marginBottom: 20 }}
                              label="RULE NAME"
                              placeholder="Rule Name"
                              value={rule.name ?? ''}
                              error={
                                errors.some(e => e.toLowerCase().includes('name')) && formIsChecked
                              }
                              onChange={e => updateLocalRule(index, { name: e.target.value })}
                            />

                            <Autocomplete
                              multiple
                              style={{ marginBottom: 20 }}
                              classes={multipleACSClasses}
                              options={requestsOptions}
                              disableCloseOnSelect
                              disableClearable
                              getOptionLabel={option => option.name}
                              isOptionEqualToValue={(o, v) => o.value === v.value}
                              renderOption={makeRenderRequestOption(index)}
                              value={rules[index].serviceRequests}
                              onChange={(e, value) => onRequestChange(index, e, value)}
                              renderTags={(selectedValues: TOption[], getTagProps) =>
                                renderChipTags(selectedValues, getTagProps)
                              }
                              renderInput={autocompleteRender({
                                label: 'Op Codes',
                                placeholder: 'Select Op Codes',
                                error:
                                  errors.some(
                                    e =>
                                      e.includes('service request') || e.includes('configuration')
                                  ) && formIsChecked,
                              })}
                            />

                            <Autocomplete
                              multiple
                              fullWidth
                              classes={multipleACSClasses}
                              options={dayOFWeekOptions}
                              style={{ marginBottom: 20 }}
                              getOptionLabel={option => option.name}
                              isOptionEqualToValue={(o, v) => o.value === v.value}
                              disableClearable
                              disableCloseOnSelect
                              renderOption={makeRenderDayOption(index)}
                              value={rules[index].daysOfWeek}
                              onChange={(e, v) => onDaysChange(index, e, v)}
                              renderTags={(selectedValues: TOption[], getTagProps) =>
                                renderChipTags(selectedValues, getTagProps)
                              }
                              renderInput={autocompleteRender({
                                label: 'Day Of Week',
                                placeholder: 'Select Day Of Week',
                                error:
                                  errors.some(
                                    e => e.includes('Days of week') || e.includes('configuration')
                                  ) && formIsChecked,
                              })}
                            />

                            <div className={classes.label}>Time Of Day</div>
                            <div className={classes.smallWrapper}>
                              <ClockTimePicker
                                withClear
                                error={
                                  errors.some(
                                    e =>
                                      e.includes('time') ||
                                      e.includes('Start') ||
                                      e.includes('configuration')
                                  ) && formIsChecked
                                }
                                value={rule.timeOfDay?.start ?? null}
                                onError={(reason, value) => {
                                  if (reason === 'invalidDate' || value === null) {
                                    updateLocalRule(index, {
                                      timeOfDay: {
                                        ...rule.timeOfDay,
                                        start: null,
                                      },
                                    });
                                  }
                                }}
                                onChange={date =>
                                  updateLocalRule(index, {
                                    timeOfDay: {
                                      ...rule.timeOfDay,
                                      start: date ? dayjs(date, 'HH:mm:ss') : null,
                                    },
                                  })
                                }
                                fullWidth
                                InputProps={{
                                  endAdornment: (
                                    <QueryBuilder color={'disabled'} cursor="pointer" />
                                  ),
                                  placeholder: 'Start Time',
                                }}
                              />
                              <span>_</span>
                              <ClockTimePicker
                                withClear
                                error={
                                  errors.some(
                                    e =>
                                      e.includes('time') ||
                                      e.includes('End') ||
                                      e.includes('configuration')
                                  ) && formIsChecked
                                }
                                value={rule.timeOfDay?.end ?? null}
                                onError={(reason, value) => {
                                  if (reason === 'invalidDate' || value === null) {
                                    updateLocalRule(index, {
                                      timeOfDay: {
                                        ...rule.timeOfDay,
                                        start: null,
                                      },
                                    });
                                  }
                                }}
                                onChange={date =>
                                  updateLocalRule(index, {
                                    timeOfDay: {
                                      ...rule.timeOfDay,
                                      end: date ? dayjs(date, 'HH:mm:ss') : null,
                                    },
                                  })
                                }
                                fullWidth
                                InputProps={{
                                  endAdornment: (
                                    <QueryBuilder color={'disabled'} cursor="pointer" />
                                  ),
                                  placeholder: 'End Time',
                                }}
                              />
                            </div>

                            <div style={{ marginTop: 24 }}>
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
                                onChange={e =>
                                  updateLocalRule(index, { capacity: Number(e.target.value) })
                                }
                              />
                            </div>
                          </div>
                        )}
                        {rules.length !== index ? (
                          <Divider style={{ margin: '10px 0 0 0' }} />
                        ) : null}
                        {rule.expanded ? (
                          <DialogActions>
                            <div className={classes.actionsWrapper}>
                              <div className={classes.buttonsWrapper}>
                                <Button
                                  onClick={() => {
                                    if (rule.id) {
                                      toggleExpand(index);
                                      resetRuleToOriginal(index);
                                    } else {
                                      setRules(prevState =>
                                        prevState.filter((_, idx) => idx !== index)
                                      );
                                    }
                                    setFormIsChecked(false);
                                    setErrors([]);
                                  }}
                                  className={classes.cancelButton}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => {
                                    if (rule.id) {
                                      onEditRule(rule.id, index);
                                    } else {
                                      onAddRule(index);
                                    }
                                    setErrors([]);
                                  }}
                                  className={classes.saveButton}
                                >
                                  Save
                                </Button>
                              </div>
                            </div>
                          </DialogActions>
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
          <Button variant="outlined" onClick={addRule} fullWidth>
            Add Rule
          </Button>
        )}
      </DialogContent>
      {rules?.every(rule => !rule.expanded) && (
        <DialogActions>
          <div className={classes.actionsWrapper}>
            <div className={classes.buttonsWrapper}>
              <Button onClick={onCancel} className={classes.cancelButton}>
                Cancel
              </Button>
              <Button onClick={patchUpdateRule} className={classes.saveButton}>
                Save
              </Button>
            </div>
          </div>
        </DialogActions>
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
