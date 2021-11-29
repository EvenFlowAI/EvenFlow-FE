import React, {ChangeEvent, useCallback, useEffect, useState} from 'react';
import {BaseModal, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import {
    ECustomerSegment, ETransportationDays,
    ITransportationOptionFull,
    ITrOptionServiceTRequest
} from "../../../store/reducers/transportationNeeds/types";
import {useSCs} from "../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {loadAssignedServiceRequests} from "../../../store/reducers/serviceRequests/actions";
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
    }
}));

const getOptions = (optionsArray: string[]) => {
    const options: TOption[] = [];
    optionsArray.forEach((option, index) => {
        const array = [];
        for (let i = 0; i < option.length; i++) {
            if (option[i] === option[i].toUpperCase() && i > 0) {
                array.push(' ');
            }
            array.push(option[i]);
        }
        options.push({name: array.join(''), value: index});
    })
    return options;
}

const EditTransportationOptionDialog:React.FC<DialogProps&TEditTransportationOptionDialogProps> = (props) => {
    const { assignedList } = useSelector((state: RootState) => state.serviceRequests);
    const [customerSegment, setCustomerSegment] = useState<TOption | null>(null);
    const [dayOfWeek, setDayOfWeek] = useState<TOption | null>(null);
    const [segmentOptions, setSegmentOptions] = useState<TOption[]>([]);
    const [dayOFWeekOptions, setDayOfWeekOptions] = useState<TOption[]>([]);
    const [timeOfDay, setTimeOfDay] = useState<TTimeObject | null>(null);
    const [duration, setDuration] = useState<TTimeObject | null>(null);
    const [serviceRequests, setServiceRequests] = useState<ITrOptionServiceTRequest[]>([]);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const autoCompleteStyles = useAutocompleteStyles();
    const classes = useStyles();

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
            dispatch(loadAssignedServiceRequests(selectedSC.id))
        }
    }, [selectedSC])

    useEffect(() => {
        if (props.editingElement) {
            const {rules} = props.editingElement;

            const segment = segmentOptions.find(item => item.value === +rules.customerSegments[0]);
            if (segment) setCustomerSegment(segment);

            const day = dayOFWeekOptions.find(item => item.value === +rules.dayOfWeeks[0]);
            if (day) setDayOfWeek(day);

            setServiceRequests(rules.serviceRequests);

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
    }, [props.editingElement])

    const onCustomerSegmentChange = (e: React.ChangeEvent<{}>, value: TOption | null): void => {
        setCustomerSegment(value)
    }

    const onDayOfWeekChange = (e: React.ChangeEvent<{}>, value: TOption | null): void => {
        setDayOfWeek(value)
    }

    const handleTime = (type: keyof TTimeObject) => (date: moment.Moment | null): void => {
        setTimeOfDay((prev) => {
            if (prev) {
                return {...prev, [type as keyof TTimeObject]: moment(date).format('HH:mm:SS')};
            } else {
                return {[type as keyof TTimeObject]: moment(date).format('HH:mm:SS')}
            }
        })
    }

    const handleDateChange = (type: keyof TTimeObject) => (date: moment.Moment | null): void => {
        setDuration((prev) => {
            if (prev) {
                return {...prev, [type as keyof TTimeObject]: date};
            } else {
                return {[type as keyof TTimeObject]: date}
            }
        })
    }

    const onRequestCheckboxChange = (e: ChangeEvent<HTMLInputElement>, option: string) => {

    }

    const renderRequestOption = useCallback((option: string) => {
        const allRequestsSelected = false;
        //const checked = !!serviceRequests.find(item => item.id === option) || allRequestsSelected;
        const checked = false;
        return <React.Fragment>
            <Checkbox
                color="primary"
                icon={checked
                    ? <CheckBoxOutlined htmlColor="#3855FE"/>
                    : <CheckBoxOutlineBlank htmlColor="#DADADA"/>}
                checked={checked}
                onChange={e => onRequestCheckboxChange(e, option)}
            />
            {option}
        </React.Fragment>
    }, [serviceRequests, assignedList]);

    return <BaseModal {...props} width={500}>
        <DialogTitle onClose={props.onClose}>Manage Rules</DialogTitle>
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
                    renderInput={autocompleteRender({label: 'Applicable Customer Segment', placeholder: 'Select Customer Segment'})}
                />
                {/*<Autocomplete*/}
                {/*    multiple*/}
                {/*    style={{ marginBottom: 20 }}*/}
                {/*    classes={classes}*/}
                {/*    options={assignedList.map(i)}*/}
                {/*    disableCloseOnSelect*/}
                {/*    renderOption={renderModelOption}*/}
                {/*    value={selectedModels}*/}
                {/*    onChange={onModelChange}*/}
                {/*    renderInput={autocompleteRender({*/}
                {/*        label: "Model",*/}
                {/*        error: !selectedMakes.length && isApplyBusinessRules && formIsChecked,*/}
                {/*        placeholder: 'Select Model'*/}
                {/*    })}*/}
                {/*/>*/}
                    <Autocomplete
                        fullWidth
                        classes={autoCompleteStyles}
                        options={dayOFWeekOptions}
                        style={{ marginBottom: 20 }}
                        getOptionLabel={option => option.name}
                        getOptionSelected={(option, value) => option.name === ETransportationDays[+value]}
                        value={dayOfWeek}
                        onChange={onDayOfWeekChange}
                        renderInput={autocompleteRender({label: 'Day Of Week', placeholder: 'Select Day Of Week'})}
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
                            endAdornment: <Watch />
                        }}
                    />
                    <TimePicker
                        placeholder={"End Time"}
                        value={timeOfDay?.end ?? null}
                        onChange={handleTime('end')}
                        style={{ marginBottom: 20, width: '47%' }}
                        id={"Time Of Day To"}
                        InputProps={{
                            endAdornment: <Watch />
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
                            endAdornment: <Calendar />
                        }}
                    />
                    <DatePicker
                        value={duration?.end ?? null}
                        format="MMM D, YYYY"
                        style={{ marginBottom: 20, width: '47%' }}
                        onChange={handleDateChange('end')}
                        InputProps={{
                            endAdornment: <Calendar />
                        }}
                    />
                </div>
            </div>
        </DialogContent>
    </BaseModal>;
};

export default EditTransportationOptionDialog;