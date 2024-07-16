import React, {ChangeEvent, HTMLAttributes, useCallback, useEffect, useMemo, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {
    ECustomerSegment, ETransportationDays,
    ITransportationOptionFull, ITransportationOptionRules,
} from "../../../../store/reducers/transportationNeeds/types";
import {useDispatch, useSelector} from "react-redux";
import {
    loadAllAssignedServiceRequests,
} from "../../../../store/reducers/serviceRequests/actions";
import {RootState} from "../../../../store/rootReducer";
import {autocompleteRender} from "../../../../utils/autocompleteRenders";
import { Autocomplete } from '@mui/material';
import Checkbox from "../../../../components/formControls/Checkbox/Checkbox";
import {CheckBoxOutlineBlank, CheckBoxOutlined, QueryBuilder} from "@mui/icons-material";
import {Button, Divider} from "@mui/material";
import {editTransportationOptionRules} from "../../../../store/reducers/transportationNeeds/actions";
import {TextField} from "../../../../components/formControls/TextFieldStyled/TextField";
import {getOptions} from "../../../../utils/utils";
import {useAutocompleteStyles, useMultipleACStyles, useStyles} from "./styles";
import {TOption, TTimeObject} from "../types";
import {useException} from "../../../../hooks/useException/useException";
import {useSCs} from "../../../../hooks/useSCs/useSCs";
import ClockTimePicker from "../../../../components/pickers/ClockTimePicker/ClockTimePicker";
import {TParsableDate} from "../../../../types/types";
import dayjs from "dayjs";

type TEditTransportationOptionDialogProps = {
    editingElement: ITransportationOptionFull | null;
}

export const EditTransportationModal:React.FC<React.PropsWithChildren<React.PropsWithChildren<DialogProps&TEditTransportationOptionDialogProps>>> = ({ editingElement, ...props}) => {
    const { allAssignedList } = useSelector((state: RootState) => state.serviceRequests);
    const [customerSegment, setCustomerSegment] = useState<TOption | null>(null);
    const [daysOfWeek, setDaysOfWeek] = useState<TOption[]>([]);
    const [segmentOptions, setSegmentOptions] = useState<TOption[]>([]);
    const [dayOFWeekOptions, setDayOfWeekOptions] = useState<TOption[]>([]);
    const [timeOfDay, setTimeOfDay] = useState<TTimeObject | null>(null);
    const [serviceRequests, setServiceRequests] = useState<TOption[]>([]);
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const [capacity, setCapacity] = useState<string>('');

    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const { classes: autoCompleteStyles } = useAutocompleteStyles();
    const { classes  } = useStyles();
    const { classes: multipleACSClasses } = useMultipleACStyles();
    const showError = useException();

    const allRequestsSelected = useMemo(() => allAssignedList.length
            ? !allAssignedList.find(item => !serviceRequests.find(el => el.value === item.id))
            : false, [allAssignedList, serviceRequests]);

    const requestsOptions = useMemo(() => {
        const options = allAssignedList.map(item => ({name: item.serviceRequest.code, value: item.id}))
        options.unshift({name: 'All', value: 0});
        return options
    }, [allAssignedList])

    useEffect(() => {
        setSegmentOptions(() => {
            const segments = Object.keys(ECustomerSegment).filter(key => Number.isNaN(+key));
            return getOptions(segments);
        })
        setDayOfWeekOptions(() => {
            const days = Object.keys(ETransportationDays).filter(key => Number.isNaN(+key));
            return getOptions(days);
        })
    }, [ECustomerSegment])

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadAllAssignedServiceRequests(selectedSC.id))
        }
    }, [selectedSC])

    useEffect(() => {
        if (editingElement && props.open) {
            const {rules} = editingElement;
            if (rules) {
                let days = dayOFWeekOptions.filter(item => rules.dayOfWeeks.includes(item.value));
                if (rules.dayOfWeeks.find(item => +item === ETransportationDays.EveryDay)) {
                    days = dayOFWeekOptions.filter(item => item.value !== ETransportationDays.EveryDay);
                }
                setDaysOfWeek(days);

                const segment = segmentOptions.find(item => item.value === +rules.customerSegments[0]);
                if (segment) setCustomerSegment(segment);

                if (rules.isAllServiceRequestsIncluded) {
                    setServiceRequests(allAssignedList.map(item => ({ name: item.serviceRequest.code, value: item.id})));
                } else {
                    setServiceRequests(rules.serviceRequests.map(item => ({ value: item.id, name: item.code})));
                }
                if (rules.capacity) setCapacity(rules.capacity.toString())

                const [startHours, startMinutes, startSeconds] = rules.timeOfDay.start.split(':');
                const [endHours, endMinutes, endSeconds] = rules.timeOfDay.end.split(':');

                setTimeOfDay(() => ({
                    start: dayjs.utc()
                        .hour(+startHours)
                        .minute(+startMinutes)
                        .second(+startSeconds),
                    end: dayjs.utc()
                        .hour(+endHours)
                        .minute(+endMinutes)
                        .second(+endSeconds),
                }));
            }
        }
    }, [editingElement, segmentOptions, dayOFWeekOptions, allAssignedList, props.open])

    const onCustomerSegmentChange = (e: React.ChangeEvent<{}>, value: TOption | null): void => {
        setFormIsChecked(false);
        setCustomerSegment(value)
    }

    const handleTime = useCallback((type: keyof TTimeObject) => (date: TParsableDate): void => {
        setFormIsChecked(false);
        setTimeOfDay((prev) => {
            if (prev) {
                if (prev.start && type === 'end' && dayjs(date).diff(prev.start) < 0) {
                    showError('The End Time needs to be more than the Start Time')
                    return prev;
                }
                return {...prev, [type as keyof TTimeObject]: dayjs(date)};
            } else {
                return {[type as keyof TTimeObject]: dayjs(date)}
            }
        })
    }, [])

    const onDayOfWeekChange = useCallback((e: ChangeEvent<{}>, value: TOption[]) => {
        setFormIsChecked(false);
        if (value.find(option => option.value === ETransportationDays.EveryDay)) {
            setDaysOfWeek(dayOFWeekOptions.filter(item => item.value !== ETransportationDays.EveryDay));
        } else {
            setDaysOfWeek(value);
        }
    }, [dayOFWeekOptions])

    const onRequestChange = useCallback((e: ChangeEvent<{}>, value: TOption[]) => {
        setFormIsChecked(false);
        if (value.find(option => option.name === 'All')) {
            setServiceRequests(allAssignedList.map(item => ({ name: item.serviceRequest.code, value: item.id})));
        } else {
            setServiceRequests(value);
        }
    }, [allAssignedList])

    const onRequestCheckboxChange = useCallback((e: ChangeEvent<HTMLInputElement>, option: TOption) => {
        setFormIsChecked(false);
        if (!e.target.checked) {
            setServiceRequests(prev => {
                let data = option.name === 'All' ? [] : prev;
                return data
                    .filter(item => item.value !== option.value)
                    .sort((a, b) => serviceRequests.find(el => el.value === a.value)
                        ? serviceRequests.find(el => el.value === b.value)
                            ? 0 : -1 : 1)
            })
        }
    }, [serviceRequests])

    const onDayOfWeekCheckboxChange = useCallback((e: ChangeEvent<HTMLInputElement>, option: TOption) => {
        setFormIsChecked(false);
        if (!e.target.checked) {
            setDaysOfWeek(prev => {
                let data = option.value === ETransportationDays.EveryDay ? [] : prev;
                return data
                    .filter(item => item.value !== option.value)
                    .sort((a, b) => daysOfWeek.find(el => el.value === a.value)
                        ? daysOfWeek.find(el => el.value === b.value)
                            ? 0 : -1 : 1)
            })
        }
    }, [daysOfWeek])

    const renderDayOfWeekOption = useCallback((props: HTMLAttributes<HTMLLIElement>, option: TOption) => {
        const allOptionsSelected = Boolean(daysOfWeek.length && daysOfWeek.length === dayOFWeekOptions.length - 1);
        const checked = Boolean(daysOfWeek.find(item => item.value === option.value)) || allOptionsSelected;
        return <li style={{display: 'flex', alignItems: 'center'}} {...props} key={option.name}>
            <Checkbox
                color="primary"
                icon={checked
                    ? <CheckBoxOutlined htmlColor="#3855FE"/>
                    : <CheckBoxOutlineBlank htmlColor="#DADADA"/>}
                checked={checked}
                onChange={e => onDayOfWeekCheckboxChange(e, option)}
            />
            {option.name}
        </li>
    }, [daysOfWeek, dayOFWeekOptions])

    const renderRequestOption = useCallback((props: HTMLAttributes<HTMLLIElement>, option: TOption) => {
        const checked = !!serviceRequests.find(item => item.value === option.value) || allRequestsSelected;
        return <li style={{display: 'flex', alignItems: 'center'}} {...props} key={option.name}>
            <Checkbox
                color="primary"
                icon={checked
                    ? <CheckBoxOutlined htmlColor="#3855FE"/>
                    : <CheckBoxOutlineBlank htmlColor="#DADADA"/>}
                checked={checked}
                onChange={e => onRequestCheckboxChange(e, option)}
            />
            {option.name}
        </li>
    }, [serviceRequests, allAssignedList]);

    const onCancel = () => {
        setFormIsChecked(false);
        setCustomerSegment(null);
        setTimeOfDay(null);
        setServiceRequests([]);
        setDaysOfWeek([]);
        setCapacity('');
        props.onClose();
    }

    const isValid = () => {
        return (serviceRequests.length || allRequestsSelected) && timeOfDay?.start && timeOfDay?.end && daysOfWeek.length && customerSegment;
    }

    const onSave = useCallback(() => {
        setFormIsChecked(true);
        if (selectedSC && editingElement && isValid()) {
            const data: ITransportationOptionRules = {
                isAllServiceRequestsIncluded: allRequestsSelected,
            }
            if (timeOfDay) data.timeOfDay = {
                start: dayjs(timeOfDay.start).format("HH:mm:ss"),
                end: dayjs(timeOfDay.end).format("HH:mm:ss"),
            }
            if (customerSegment) data.customerSegments = [customerSegment.value];
            if (serviceRequests.length && !allRequestsSelected) {
                data.serviceRequests = serviceRequests.map(item => item.value);
            }
            if (daysOfWeek.length && daysOfWeek.length === dayOFWeekOptions.length - 1) {
                data.dayOfWeeks = [ETransportationDays.EveryDay];
            } else {
                data.dayOfWeeks = daysOfWeek.map(item => item.value);
            }
            if (capacity) data.capacity = Number(capacity);

            if (editingElement.id) {
                dispatch(editTransportationOptionRules(editingElement.id, selectedSC.id, data, onCancel, showError))
            }
        } else {
            showError('Please fill all required fields')
        }
    }, [selectedSC, editingElement, isValid, allRequestsSelected, timeOfDay, customerSegment,
        serviceRequests, daysOfWeek, dayOFWeekOptions, onCancel])

    const onCapacityChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (Number.isInteger(+e.target.value) && +e.target.value >= 0) setCapacity(e.target.value);
    }

    return (
        <BaseModal {...props} width={500} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>Manage Rules</DialogTitle>
            <DialogContent>
                <div className={classes.wrapper}>
                    <Autocomplete
                        fullWidth
                        classes={autoCompleteStyles}
                        style={{ marginBottom: 20 }}
                        getOptionLabel={option => option.name}
                        options={segmentOptions}
                        isOptionEqualToValue={(option, value) => option.name === ECustomerSegment[+value]}
                        value={customerSegment}
                        onChange={onCustomerSegmentChange}
                        renderInput={autocompleteRender({
                            label: 'Applicable Customer Segment',
                            placeholder: 'Select Customer Segment',
                            error: !customerSegment && formIsChecked,
                        })}
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
                        renderOption={renderRequestOption}
                        value={serviceRequests}
                        onChange={onRequestChange}
                        renderInput={autocompleteRender({
                            label: "Service Requests",
                            error: !serviceRequests.length && formIsChecked,
                            placeholder: 'Select Service Requests'
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
                            renderOption={renderDayOfWeekOption}
                            value={daysOfWeek}
                            onChange={onDayOfWeekChange}
                            renderInput={autocompleteRender({
                                label: 'Day Of Week',
                                placeholder: 'Select Day Of Week',
                                error: !daysOfWeek.length && formIsChecked,
                            })}
                        />
                    <div className={classes.label}>Time Of Day</div>
                    <div className={classes.smallWrapper}>
                        <ClockTimePicker
                            value={timeOfDay?.start ?? null}
                            onChange={handleTime('start')}
                            fullWidth
                            InputProps={{
                                endAdornment: <QueryBuilder color={"disabled"} cursor="pointer" />,
                                error: !timeOfDay?.start && formIsChecked,
                                id: "Time Of Day From",
                                placeholder: "Start Time"
                            }}
                        />
                        <ClockTimePicker
                            value={timeOfDay?.end ?? null}
                            onChange={handleTime('end')}
                            fullWidth
                            InputProps={{
                                endAdornment: <QueryBuilder color={"disabled"} cursor="pointer" />,
                                error: !timeOfDay?.end && formIsChecked,
                                style: {marginBottom: 20},
                                id: "Time Of Day To",
                                placeholder: "End Time",
                            }}
                        />
                    </div>
                    <div className={classes.bigLabel}>CONSTRAINTS</div>
                    <Divider style={{ margin: '0 0 10px 0' }}/>
                    <TextField
                        fullWidth
                        type="number"
                        inputProps={{min: 1, step: 1}}
                        label='Daily Capacity'
                        style={{ marginBottom: 20}}
                        placeholder='Type Number'
                        error={Boolean(capacity) && !Number.isInteger(+capacity)}
                        onChange={onCapacityChange}
                        value={capacity ?? ''}/>
                </div>
            </DialogContent>
            <Divider style={{ margin: 0 }}/>
            <DialogActions>
                <div className={classes.actionsWrapper}>
                    <div className={classes.buttonsWrapper}>
                        <Button
                            onClick={onCancel}
                            className={classes.cancelButton}>
                            Cancel
                        </Button>
                        <Button
                            onClick={onSave}
                            className={classes.saveButton}>
                            Save
                        </Button>
                    </div>
                </div>
            </DialogActions>
        </BaseModal>
    );
};