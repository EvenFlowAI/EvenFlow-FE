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
import { Autocomplete, Button, Checkbox, Divider, IconButton, Switch } from '@mui/material';
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

type TEditTransportationOptionDialogProps = {
  editingElement: ITransportationOptionFull | null;
};

type TRuleState = {
  id?: number;
  name: string;
  daysOfWeek: TOption[];
  timeOfDay: TTimeObject | null;
  serviceRequests: TOption[];
  capacity: string | null;
  isAllServiceRequestsIncluded?: boolean;

  expanded: boolean;
  state: number; // додано
  orderIndex: number;
};

export const EditTransportationModal: React.FC<
  DialogProps & TEditTransportationOptionDialogProps
> = ({ editingElement, ...props }) => {
  const { allAssignedList } = useSelector((state: RootState) => state.serviceRequests);
  const [dayOFWeekOptions, setDayOfWeekOptions] = useState<TOption[]>([]);
  const [rules, setRules] = useState<TRuleState[]>([]);
  const [formIsChecked, setFormIsChecked] = useState<boolean>(false);

  const { selectedSC } = useSCs();
  const dispatch = useDispatch();
  const { classes } = useStyles();
  const { classes: multipleACSClasses } = useMultipleACStyles();
  const showError = useException();
  const showMessage = useMessage();
  const { onOpen, isOpen, onClose } = useModal();
  const [ruleForDeleting, setRuleForDeleting] = useState<TRuleState | null>(null);

  const requestsOptions = useMemo(() => {
    const options = allAssignedList.map(item => ({
      name: item.serviceRequest.code,
      value: item.id,
    }));
    options.unshift({ name: 'All', value: 0 });

    return options;
  }, [allAssignedList]);

  useEffect(() => {
    setDayOfWeekOptions(() => {
      const days = Object.keys(ETransportationDays).filter(key => Number.isNaN(+key));
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
        console.log(editingElement.rules);

        const unblockedRules = [...editingElement.rules];

        const modifiedRules = unblockedRules
          .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)) // ← сортуємо тут
          .map(rule => {
            const [startHours, startMinutes, startSeconds] = rule.timeOfDay.start?.split(':');
            const [endHours, endMinutes, endSeconds] = rule.timeOfDay.end?.split(':');

            let days = dayOFWeekOptions.filter(item => rule.dayOfWeeks.includes(item.value));
            if (rule.dayOfWeeks.find(item => +item === ETransportationDays.EveryDay)) {
              days = dayOFWeekOptions.filter(item => item.value !== ETransportationDays.EveryDay);
            }

            let updatedServiceRequests;
            if (!rule.serviceRequests?.length) {
              updatedServiceRequests = allAssignedList.map(item => ({
                name: item.serviceRequest.code,
                value: item.id,
              }));
            } else {
              updatedServiceRequests = rule.serviceRequests.map(item => ({
                value: item.id,
                name: item.code,
              }));
            }

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
              capacity: rule.capacity ? `${rule.capacity}` : null,
              expanded: false,
              state: rule.state, // додано
              orderIndex: rule.orderIndex,
            };
          });
        setRules(modifiedRules);
      }
    }
  }, [editingElement, props.open]);

  const updateLocalRule = (index: number, patch: Partial<TRuleState>) => {
    setRules(prev => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  };

  const addRule = () => {
    setRules(prev => [
      ...prev,
      {
        name: '',
        daysOfWeek: [],
        serviceRequests: [],
        timeOfDay: null,
        capacity: '',
        expanded: true,
        state: 1,
        orderIndex: rules.length + 1,
      },
    ]);
  };

  const handleRemoveRule = () => {
    if (selectedSC?.id && ruleForDeleting) {
      dispatch(
        removeTransportationOptionRule(
          selectedSC.id,
          String(ruleForDeleting?.id),
          () => {
            onClose();
            setRules(prev => prev.filter((rule, i) => rule?.id !== ruleForDeleting?.id));
            setRuleForDeleting(null);
          },
          showError
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
        expanded: i === index ? !r.expanded : false, // інші завжди закриті
      }))
    );
  };

  const onAddRule = (index2: number) => {
    setFormIsChecked(true);
    if (selectedSC && editingElement) {
      // усі опції запитів без "All"
      const nonAllRequests = requestsOptions.filter(o => o.name !== 'All');

      let newRule;

      rules.forEach((r, index) => {
        if (index === index2) {
          // true, якщо вибрані всі; guard проти кейсу з порожнім списком
          const isAllRequestsIncluded =
            nonAllRequests.length > 0 && r.serviceRequests.length === nonAllRequests.length;

          if (
            r.name?.length < 3 ||
            !editingElement.id ||
            !r.timeOfDay?.start ||
            !r.timeOfDay?.end ||
            !r.serviceRequests.length ||
            !r.daysOfWeek.length
          ) {
            return;
          }

          newRule = {
            name: r.name,
            transportationOptionId: editingElement.id,
            timeOfDay: r.timeOfDay
              ? {
                  start: dayjs(r.timeOfDay.start).format('HH:mm:ss'),
                  end: dayjs(r.timeOfDay.end).format('HH:mm:ss'),
                }
              : undefined,
            serviceRequests: isAllRequestsIncluded ? [] : r.serviceRequests.map(item => item.value),
            dayOfWeeks:
              r.daysOfWeek.length && r.daysOfWeek.length === dayOFWeekOptions.length - 1
                ? [ETransportationDays.EveryDay]
                : r.daysOfWeek.map(item => item.value),
            capacity: r.capacity ? Number(r.capacity) : undefined,
            state: r.state,
            orderIndex: index,
          };
        }
      });

      console.log(newRule);

      if (newRule) {
        dispatch(
          addTransportationOptionRule(
            selectedSC.id,
            newRule,
            () => {
              setFormIsChecked(false);
              showMessage('Created new rule');
              toggleExpand(index2);
            },
            showError
          )
        );
      }
    }
  };

  const onEditRule = (id: number, index2: number) => {
    setFormIsChecked(true);
    if (selectedSC && editingElement) {
      // усі опції запитів без "All"
      const nonAllRequests = requestsOptions.filter(o => o.name !== 'All');

      let newRule;

      rules.forEach((r, index) => {
        if (r.id === id) {
          // true, якщо вибрані всі; guard проти кейсу з порожнім списком
          const isAllRequestsIncluded =
            nonAllRequests.length > 0 && r.serviceRequests.length === nonAllRequests.length;

          if (
            r.name?.length < 3 ||
            !editingElement.id ||
            !r.timeOfDay?.start ||
            !r.timeOfDay?.end ||
            !r.serviceRequests.length ||
            !r.daysOfWeek.length
          ) {
            return;
          }

          newRule = {
            name: r.name,
            transportationOptionId: editingElement.id,
            timeOfDay: r.timeOfDay
              ? {
                  start: dayjs(r.timeOfDay.start).format('HH:mm:ss'),
                  end: dayjs(r.timeOfDay.end).format('HH:mm:ss'),
                }
              : undefined,
            serviceRequests: isAllRequestsIncluded ? [] : r.serviceRequests.map(item => item.value),
            dayOfWeeks:
              r.daysOfWeek.length && r.daysOfWeek.length === dayOFWeekOptions.length - 1
                ? [ETransportationDays.EveryDay]
                : r.daysOfWeek.map(item => item.value),
            capacity: r.capacity ? Number(r.capacity) : undefined,
            state: r.state,
            orderIndex: index,
          };
        }
      });

      console.log(newRule);

      if (newRule) {
        dispatch(
          editTransportationOptionRule(
            selectedSC.id,
            newRule,
            id,
            () => {
              setFormIsChecked(false);
              showMessage('Rule updated');
              toggleExpand(index2);
            },
            showError
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
            showError
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

  // reorder handler for drag & drop
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reordered = Array.from(rules);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    // оновлюємо orderIndex відповідно до нової позиції
    const updated = reordered.map((item, index) => ({
      ...item,
      orderIndex: index,
    }));

    setRules(updated);
  };

  // допоміжний стиль для disabled стану контенту при enabled=false
  const disabledStyle: React.CSSProperties = {
    opacity: 0.6,
    pointerEvents: 'none',
  };

  // усередині компонента EditTransportationModal:

  // чи все вибрано для конкретного rule
  const isAllSelected = (idx: number) => {
    const selected = rules[idx].serviceRequests ?? [];
    // якщо кількість співпадає з кількістю всіх опцій (крім All)
    return selected.length === requestsOptions.filter(o => o.name !== 'All').length;
  };

  // перерахунок значення serviceRequests для "All"
  const selectAllRequests = useCallback(() => {
    return requestsOptions.filter(o => o.name !== 'All'); // беремо всі крім "All"
  }, [requestsOptions]);

  // onChange чекбокса по одній опції (для конкретного rule)
  const onRequestCheckboxChange = useCallback(
    (ruleIdx: number, option: TOption, checked: boolean) => {
      const current = rules[ruleIdx].serviceRequests ?? [];
      const nonAll = requestsOptions.filter(o => o.name !== 'All');

      if (option.name === 'All') {
        // якщо тицнули All
        const next = checked ? nonAll : [];
        updateLocalRule(ruleIdx, { serviceRequests: next });
        setFormIsChecked(false);
        return;
      }

      // для звичайної опції
      const exists = current.some(o => o.value === option.value);
      let next = exists ? current.filter(o => o.value !== option.value) : [...current, option];

      updateLocalRule(ruleIdx, { serviceRequests: next });
      setFormIsChecked(false);
    },
    [rules, requestsOptions]
  );

  // onChange Autocomplete (batch, наприклад при кліку поза item або через клік по "All")
  const onRequestChange = useCallback(
    (ruleIdx: number, _e: any, value: TOption[]) => {
      setFormIsChecked(false);

      if (value.find(opt => opt.name === 'All')) {
        // якщо клікнули All у дропдауні
        const allSelected = isAllSelected(ruleIdx);
        const nonAll = requestsOptions.filter(o => o.name !== 'All');
        const next = allSelected ? [] : nonAll;
        updateLocalRule(ruleIdx, { serviceRequests: next });
        return;
      }

      // інакше звичайний апдейт
      updateLocalRule(ruleIdx, { serviceRequests: value.filter(o => o.name !== 'All') });
    },
    [isAllSelected, requestsOptions]
  );

  // Рендер-опції з чекбоксом для конкретного rule
  const makeRenderRequestOption = useCallback(
    (ruleIdx: number) => (props: React.HTMLAttributes<HTMLLIElement>, option: TOption) => {
      const selected = rules[ruleIdx].serviceRequests ?? [];
      const allSelected = isAllSelected(ruleIdx);

      const checked =
        option.name === 'All' ? allSelected : selected.some(item => item.value === option.value);

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
            onChange={e =>
              onRequestCheckboxChange(ruleIdx, option, (e.target as HTMLInputElement).checked)
            }
          />
          {option.name}
        </li>
      );
    },
    [rules, isAllSelected, onRequestCheckboxChange]
  );

  // усередині компонента EditTransportationModal:

  // значення "EveryDay" з енуму
  const EVERY_DAY_VALUE = ETransportationDays.EveryDay;

  // усі дні без "Every Day"
  const nonEveryDayOptions = useMemo(
    () => dayOFWeekOptions.filter(o => o.value !== EVERY_DAY_VALUE),
    [dayOFWeekOptions]
  );

  // чи вибрані всі (для конкретного rule)
  const isEveryDaySelected = (idx: number) => {
    const selected = rules[idx].daysOfWeek ?? [];
    return selected.length === nonEveryDayOptions.length;
  };

  const onDayCheckboxChange = useCallback(
    (ruleIdx: number, option: TOption, checked: boolean) => {
      const current = rules[ruleIdx].daysOfWeek ?? [];

      if (option.value === EVERY_DAY_VALUE) {
        // клік по "Every Day"
        const next = checked ? nonEveryDayOptions : [];
        updateLocalRule(ruleIdx, { daysOfWeek: next });
        setFormIsChecked(false);
        return;
      }

      const exists = current.some(o => o.value === option.value);
      const next = exists ? current.filter(o => o.value !== option.value) : [...current, option];

      updateLocalRule(ruleIdx, { daysOfWeek: next });
      setFormIsChecked(false);
    },
    [rules, nonEveryDayOptions]
  );

  const onDaysChange = useCallback(
    (ruleIdx: number, _e: any, value: TOption[]) => {
      setFormIsChecked(false);

      // якщо користувач клацнув "Every Day" у списку
      if (value.some(v => v.value === EVERY_DAY_VALUE)) {
        const allSelected = isEveryDaySelected(ruleIdx);
        const next = allSelected ? [] : nonEveryDayOptions;
        updateLocalRule(ruleIdx, { daysOfWeek: next });
        return;
      }

      // звичайний випадок: просто зберігаємо без "Every Day" (на випадок, якщо прослизнув)
      updateLocalRule(ruleIdx, { daysOfWeek: value.filter(o => o.value !== EVERY_DAY_VALUE) });
    },
    [isEveryDaySelected, nonEveryDayOptions]
  );

  const makeRenderDayOption = useCallback(
    (ruleIdx: number) => (props: React.HTMLAttributes<HTMLLIElement>, option: TOption) => {
      const selected = rules[ruleIdx].daysOfWeek ?? [];
      const allSelected = isEveryDaySelected(ruleIdx);

      const checked =
        option.value === EVERY_DAY_VALUE
          ? allSelected
          : selected.some(item => item.value === option.value);

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
            onClick={e => e.stopPropagation()} // щоб список не закривався
            onChange={e =>
              onDayCheckboxChange(ruleIdx, option, (e.target as HTMLInputElement).checked)
            }
          />
          {option.name}
        </li>
      );
    },
    [rules, isEveryDaySelected, onDayCheckboxChange]
  );

  return (
    <BaseModal {...props} width={600} onClose={onCancel}>
      <DialogTitle onClose={onCancel}>Manage Rules</DialogTitle>
      <DialogContent>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="rules-droppable">
            {provided => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {rules.map((rule, index) => (
                  <Draggable key={index.toString()} draggableId={index.toString()} index={index}>
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
                        {/* Заголовок з handle, Switch, назвою і кнопками */}
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
                          {/* Ліва частина: Switch + Назва */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Switch
                              checked={rule.state === 1}
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

                          {/* Права частина: Delete (outlined, червона) + Expand */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
                            <IconButton
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

                        {/* Контент правила */}
                        {rule.expanded && (
                          <div style={{ padding: 12, ...(rule.state ? {} : disabledStyle) }}>
                            <TextField
                              fullWidth
                              style={{ marginBottom: 20 }}
                              label="RULE NAME"
                              placeholder="Rule Name"
                              value={rule.name ?? ''}
                              error={!rule.name && formIsChecked}
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
                              // головне: для кожного rule свій renderOption
                              renderOption={makeRenderRequestOption(index)}
                              // значення — з rules[index]
                              value={rules[index].serviceRequests}
                              onChange={(e, value) => onRequestChange(index, e, value)}
                              renderInput={autocompleteRender({
                                label: 'Op Codes',
                                error: !rules[index].serviceRequests.length && formIsChecked,
                                placeholder: 'Select Op Codes',
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
                              renderInput={autocompleteRender({
                                label: 'Day Of Week',
                                placeholder: 'Select Day Of Week',
                                error: !rules[index].daysOfWeek.length && formIsChecked,
                              })}
                            />

                            <div className={classes.label}>Time Of Day</div>
                            <div className={classes.smallWrapper}>
                              <ClockTimePicker
                                value={rule.timeOfDay?.start ?? null}
                                onChange={date =>
                                  updateLocalRule(index, {
                                    timeOfDay: {
                                      ...rule.timeOfDay,
                                      start: dayjs(date),
                                    },
                                  })
                                }
                                fullWidth
                                InputProps={{
                                  endAdornment: (
                                    <QueryBuilder color={'disabled'} cursor="pointer" />
                                  ),
                                  error: !rule.timeOfDay?.start && formIsChecked,
                                  placeholder: 'Start Time',
                                }}
                              />
                              <span>_</span>
                              <ClockTimePicker
                                value={rule.timeOfDay?.end ?? null}
                                onChange={date =>
                                  updateLocalRule(index, {
                                    timeOfDay: {
                                      ...rule.timeOfDay,
                                      end: dayjs(date),
                                    },
                                  })
                                }
                                fullWidth
                                InputProps={{
                                  endAdornment: (
                                    <QueryBuilder color={'disabled'} cursor="pointer" />
                                  ),
                                  error: !rule.timeOfDay?.end && formIsChecked,
                                  placeholder: 'End Time',
                                }}
                              />
                            </div>

                            <div
                              style={{ marginTop: '36px', marginBottom: '16px' }}
                              className={classes.bigLabel}
                            >
                              CONSTRAINTS
                            </div>
                            <Divider style={{ margin: '0 0 10px 0' }} />

                            <div style={{ marginTop: 24 }}>
                              <TextField
                                fullWidth
                                type="number"
                                inputProps={{ min: 1, step: 1 }}
                                label="Daily Capacity"
                                placeholder="Type Number"
                                value={rule.capacity ?? ''}
                                onChange={e => updateLocalRule(index, { capacity: e.target.value })}
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
                                    } else {
                                      setRules(prevState =>
                                        prevState.filter((rule, idx) => idx !== index)
                                      );
                                    }
                                    setFormIsChecked(false);
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

        {(!rules.length || rules.every(rule => !rule.expanded)) && rules.length < 4 && (
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
