import React, {useEffect, useState} from 'react';
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
import {TextField} from "../../UI/TextField";

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

    const onCustomerSegmentChange = (e: React.ChangeEvent<{}>, value: TOption | null): void => {
        setCustomerSegment(value)
    }

    const onDayOfWeekChange = (e: React.ChangeEvent<{}>, value: TOption | null): void => {
        setDayOfWeek(value)
    }

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
                   .second(+startSeconds)
                   .format('HH:mm:SS'),
               end: moment.utc()
                   .hours(+endHours)
                   .minutes(+endMinutes)
                   .second(+endSeconds)
                   .format('HH:mm:SS'),
            }));
            setDuration(() => ({
                start: moment.utc(rules.duration.start),
                end: moment.utc(rules.duration.end),
            }));
        }
    }, [props.editingElement])

    const handleTimeChange = (type: keyof TTimeObject) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const date = event.target.value;
        setTimeOfDay((prev) => {
            if (prev) {
                return {...prev, [type as keyof TTimeObject]: moment(date).format('HH:mm:SS')};
            } else {
                return {[type as keyof TTimeObject]: moment(date).format('HH:mm:SS')}
            }
        })
    }

    const handleDateChange = (type: keyof TTimeObject) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const date = event.target.value;
        setDuration((prev) => {
            if (prev) {
                return {...prev, [type as keyof TTimeObject]: moment(date)};
            } else {
                return {[type as keyof TTimeObject]: moment(date)}
            }
        })
    }

    return <BaseModal {...props} width={700}>
        <DialogTitle onClose={props.onClose}>Manage Rules</DialogTitle>
        <DialogContent>
            <Autocomplete
                fullWidth
                classes={autoCompleteStyles}
                getOptionLabel={option => option.name}
                options={segmentOptions}
                getOptionSelected={(option, value) => option.name === ECustomerSegment[+value]}
                value={customerSegment}
                onChange={onCustomerSegmentChange}
                renderInput={autocompleteRender({label: 'Applicable Customer Segment', placeholder: 'Select Customer Segment'})}
            />
            <Autocomplete
                fullWidth
                classes={autoCompleteStyles}
                options={dayOFWeekOptions}
                getOptionLabel={option => option.name}
                getOptionSelected={(option, value) => option.name === ETransportationDays[+value]}
                value={dayOfWeek}
                onChange={onDayOfWeekChange}
                renderInput={autocompleteRender({label: 'Day Of Week', placeholder: 'Select Day Of Week'})}
            />
            <TextField
                style={{width: '47%'}}
                type="time"
                value={timeOfDay?.start || null}
                onChange={handleTimeChange('start')}
                placeholder="Select Time"
                label="Time Of Day"
            />
            <TextField
                style={{width: '47%'}}
                type="time"
                value={timeOfDay?.end || null}
                placeholder="Select Time"
                onChange={handleTimeChange('end')}
            />
            <TextField
                style={{width: '47%'}}
                type="date"
                value={duration?.start || null}
                onChange={handleDateChange('start')}
                placeholder="Select Date"
                label="Duration"
            />
            <TextField
                style={{width: '47%'}}
                type="date"
                value={duration?.end || null}
                placeholder="Select Date"
                onChange={handleDateChange('end')}
            />
        </DialogContent>
    </BaseModal>;
};

export default EditTransportationOptionDialog;