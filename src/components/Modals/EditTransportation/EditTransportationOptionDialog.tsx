import React, {ChangeEvent, useCallback, useEffect, useMemo, useState} from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import {
    ECustomerSegment, ETransportationDays,
    ITransportationOptionFull, ITransportationOptionRules,
} from "../../../store/reducers/transportationNeeds/types";
import {useException, useSCs} from "../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {
    loadAllAssignedServiceRequests,
} from "../../../store/reducers/serviceRequests/actions";
import {RootState} from "../../../store/rootReducer";
import moment from "moment";
import {autocompleteRender} from "../../UI/AutocompleteRender";
import {Autocomplete} from "@material-ui/lab";
import {makeStyles} from "@material-ui/core/styles";
import {DatePicker, TimePicker} from "../../UI/DateTimePickers";
import { ReactComponent as Calendar } from "../../../assets/img/date_range.svg";
import { ReactComponent as Watch } from "../../../assets/img/watch_round.svg";
import Checkbox from "../../UI/Checkbox";
import {CheckBoxOutlineBlank, CheckBoxOutlined} from "@material-ui/icons";
import {Button, Divider} from "@material-ui/core";
import {editTransportationOptionRules} from "../../../store/reducers/transportationNeeds/actions";
import {TextField} from "../../UI/TextField";
import {getOptions} from "../../../utils/utils";

type TEditTransportationOptionDialogProps = {
    editingElement: ITransportationOptionFull | null;
}

type TTimeObject = {
    start?: string | moment.Moment;
    end?: string | moment.Moment;
}

const useAutocompleteStyles = makeStyles(() => ({
    clearIndicator: {
        width: 0,
    }
}))

type TOption = {
    value: number;
    name: string;
}

const useStyles = makeStyles(() => ({
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 48px',
    },
    input: {
        marginBottom: 20,
    },
    smallWrapper: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    label: {
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontSize: 12,
        marginBottom: 5,
    },
    bigLabel: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
    },
    actionsWrapper: {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingTop: 14,
    },
    buttonsWrapper: {
        display: 'flex',
        justifyContent: "space-between",
        alignItems: 'center',
    },
    cancelButton: {
        color: '#9FA2B4',
        marginRight: 20,
        border: 'none',
        outline: 'none',
    },
    saveButton: {
        background: '#7898FF',
        color: 'white',
        border: '1px solid #7898FF',
        outline: 'none',
        '&:hover': {
            color: '#7898FF'
        }
    },
}));

const useMultipleACStyles = makeStyles(() => ({
    tag: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#7898FF',
        borderRadius: 4,
        color: 'white',
        fontWeight: 'bold',
        margin: '1px 2px',
        '& > svg': {
            color: 'white',
        }
    },
    option: {
        padding: 0,
        fontSize: 15,
        height: 28,
    },
    inputRoot: {
        padding: 5,
        paddingRight: 8,
    },
}))

const EditTransportationOptionDialog:React.FC<DialogProps&TEditTransportationOptionDialogProps> = ({ editingElement, ...props}) => {
    const { allAssignedList } = useSelector((state: RootState) => state.serviceRequests);
    const [customerSegment, setCustomerSegment] = useState<TOption | null>(null);
    const [daysOfWeek, setDaysOfWeek] = useState<TOption[]>([]);
    const [segmentOptions, setSegmentOptions] = useState<TOption[]>([]);
    const [dayOFWeekOptions, setDayOfWeekOptions] = useState<TOption[]>([]);
    const [timeOfDay, setTimeOfDay] = useState<TTimeObject | null>(null);
    const [duration, setDuration] = useState<TTimeObject | null>(null);
    const [serviceRequests, setServiceRequests] = useState<TOption[]>([]);
    const [formIsChecked, setFormIsChecked] = useState<boolean>(false);
    const [capacity, setCapacity] = useState<string>('');
    const [slotsCount, setSlotsCount] = useState<string>('');

    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const autoCompleteStyles = useAutocompleteStyles();
    const classes = useStyles();
    const multipleACSClasses = useMultipleACStyles();
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
                if (rules.slotsCount) setSlotsCount(rules.slotsCount.toString());

                const [startHours, startMinutes, startSeconds] = rules.timeOfDay.start.split(':');
                const [endHours, endMinutes, endSeconds] = rules.timeOfDay.end.split(':');

                setTimeOfDay(() => ({
                    start: moment.utc()
                        .hours(+startHours)
                        .minutes(+startMinutes)
                        .second(+startSeconds),
                    end: moment.utc()
                        .hours(+endHours)
                        .minutes(+endMinutes)
                        .second(+endSeconds),
                }));
                setDuration(() => ({
                    start: moment.utc(rules.duration.start),
                    end: moment.utc(rules.duration.end),
                }));
            }
        }
    }, [editingElement, segmentOptions, dayOFWeekOptions, allAssignedList, props.open])

    const onCustomerSegmentChange = (e: React.ChangeEvent<{}>, value: TOption | null): void => {
        setFormIsChecked(false);
        setCustomerSegment(value)
    }

    const handleTime = useCallback((type: keyof TTimeObject) => (date: moment.Moment | null): void => {
        setFormIsChecked(false);
        setTimeOfDay((prev) => {
            if (prev) {
                if (prev.start && type === 'end' && moment(date).diff(prev.start) < 0) {
                    showError('The End Time Needs To Be More than The Start Time')
                    return prev;
                }
                return {...prev, [type as keyof TTimeObject]: moment(date)};
            } else {
                return {[type as keyof TTimeObject]: moment(date)}
            }
        })
    }, [])

    const handleDateChange = useCallback((type: keyof TTimeObject) => (date: moment.Moment | null): void => {
        setFormIsChecked(false);
        setDuration((prev) => {
            const value = moment.utc(date).hours(type === 'start' ? 0 : 1);
            if (prev) {
                if (prev.start && type === 'end' && moment(date).diff(prev.start) / 1000 / 60 / 60 < -24) {
                    showError('The End Duration Date needs to be more than the Start Date');
                    return prev;
                }
                return {...prev, [type as keyof TTimeObject]: value};
            } else {
                return {[type as keyof TTimeObject]: value}
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

    const renderDayOfWeekOption = useCallback((option: TOption) => {
        const allOptionsSelected = Boolean(daysOfWeek.length && daysOfWeek.length === dayOFWeekOptions.length - 1);
        const checked = Boolean(daysOfWeek.find(item => item.value === option.value)) || allOptionsSelected;
        return <React.Fragment>
            <Checkbox
                color="primary"
                icon={checked
                    ? <CheckBoxOutlined htmlColor="#3855FE"/>
                    : <CheckBoxOutlineBlank htmlColor="#DADADA"/>}
                checked={checked}
                onChange={e => onDayOfWeekCheckboxChange(e, option)}
            />
            {option.name}
        </React.Fragment>
    }, [daysOfWeek, dayOFWeekOptions])

    const renderRequestOption = useCallback((option: TOption) => {
        const checked = !!serviceRequests.find(item => item.value === option.value) || allRequestsSelected;
        return <React.Fragment>
            <Checkbox
                color="primary"
                icon={checked
                    ? <CheckBoxOutlined htmlColor="#3855FE"/>
                    : <CheckBoxOutlineBlank htmlColor="#DADADA"/>}
                checked={checked}
                onChange={e => onRequestCheckboxChange(e, option)}
            />
            {option.name}
        </React.Fragment>
    }, [serviceRequests, allAssignedList]);

    const onCancel = () => {
        setFormIsChecked(false);
        setCustomerSegment(null);
        setDuration(null);
        setTimeOfDay(null);
        setServiceRequests([]);
        setDaysOfWeek([]);
        setSlotsCount('');
        setCapacity('');
        props.onClose();
    }

    const isValid = () => {
        return (serviceRequests.length || allRequestsSelected) && timeOfDay?.start && timeOfDay?.end && duration?.start && duration?.end &&
            daysOfWeek.length && customerSegment;
    }

    const onSave = useCallback(() => {
        setFormIsChecked(true);
        if (selectedSC && editingElement && isValid()) {
            const data: ITransportationOptionRules = {
                isAllServiceRequestsIncluded: allRequestsSelected,
            }
            if (duration) data.duration = {
                start: moment(duration.start).toISOString(),
                end: moment(duration.end).toISOString(),
            }
            if (timeOfDay) data.timeOfDay = {
                start: moment(timeOfDay.start).format("HH:mm:ss"),
                end: moment(timeOfDay.end).format("HH:mm:ss"),
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
            if (slotsCount) data.slotsCount = Number(slotsCount);

            if (editingElement.id) {
                dispatch(editTransportationOptionRules(editingElement.id, selectedSC.id, data, onCancel, showError))
            }
        } else {
            showError('Please fill all required fields')
        }
    }, [selectedSC, editingElement, isValid, allRequestsSelected, duration, timeOfDay, customerSegment,
        serviceRequests, daysOfWeek, dayOFWeekOptions, onCancel])

    const onCapacityChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (Number.isInteger(+e.target.value) && +e.target.value >= 0) setCapacity(e.target.value);
    }

    const onSlotsCountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (Number.isInteger(+e.target.value) && +e.target.value >= 0) setSlotsCount(e.target.value);
    }

    return <BaseModal {...props} width={500} onClose={onCancel}>
        <DialogTitle onClose={onCancel}>Manage Rules</DialogTitle>
        <DialogContent>
            <div className={classes.wrapper}>
                <Autocomplete
                    fullWidth
                    classes={autoCompleteStyles}
                    style={{ marginBottom: 20 }}
                    getOptionLabel={option => option.name}
                    options={segmentOptions}
                    getOptionSelected={(option, value) => option.name === ECustomerSegment[+value]}
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
                    <TimePicker
                        placeholder={"Start Time"}
                        value={timeOfDay?.start ?? null}
                        style={{ marginBottom: 20, width: '47%' }}
                        onChange={handleTime('start')}
                        id={"Time Of Day From"}
                        InputProps={{
                            endAdornment: <Watch />,
                            error: !timeOfDay?.start && formIsChecked,
                        }}
                    />
                    <TimePicker
                        placeholder={"End Time"}
                        value={timeOfDay?.end ?? null}
                        onChange={handleTime('end')}
                        style={{ marginBottom: 20, width: '47%' }}
                        id={"Time Of Day To"}
                        InputProps={{
                            endAdornment: <Watch />,
                            error: !timeOfDay?.end && formIsChecked,
                        }}
                    />
                </div>
                <div className={classes.label}>Duration</div>
                <div className={classes.smallWrapper}>
                    <DatePicker
                        value={duration?.start ?? null}
                        format="MMM D, YYYY"
                        style={{ marginBottom: 20, width: '47%' }}
                        onChange={handleDateChange('start')}
                        InputProps={{
                            endAdornment: <Calendar />,
                            error: !duration?.start && formIsChecked,
                        }}
                    />
                    <DatePicker
                        value={duration?.end ?? null}
                        format="MMM D, YYYY"
                        style={{ marginBottom: 20, width: '47%' }}
                        onChange={handleDateChange('end')}
                        InputProps={{
                            endAdornment: <Calendar />,
                            error: !duration?.end && formIsChecked,
                        }}
                    />
                </div>
                <div className={classes.bigLabel}>CONSTRAINTS</div>
                <Divider style={{ margin: '0 0 10px 0' }}/>
                <TextField
                    fullWidth
                    type="number"
                    inputProps={{min: 1, step: 1}}
                    label='Capacity'
                    style={{ marginBottom: 20}}
                    placeholder='Type Number'
                    error={Boolean(capacity) && !Number.isInteger(+capacity)}
                    onChange={onCapacityChange}
                    value={capacity ?? ''}/>
                <TextField
                    fullWidth
                    type="number"
                    inputProps={{min: 1, step: 1}}
                    label='Per appointment slots'
                    placeholder='Type Number'
                    error={Boolean(slotsCount) && !Number.isInteger(+slotsCount)}
                    onChange={onSlotsCountChange}
                    value={slotsCount ?? ''}/>
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
    </BaseModal>;
};

export default EditTransportationOptionDialog;