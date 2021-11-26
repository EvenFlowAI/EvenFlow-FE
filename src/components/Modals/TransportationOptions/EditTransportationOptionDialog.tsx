import React, {useEffect, useState} from 'react';
import {BaseModal, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import {
    ECustomerSegment,
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
    start?: moment.Moment;
    end?: moment.Moment;
}

const useAutocompleteStyles = makeStyles(() => ({
    clearIndicator: {
        width: 0,
    }
}))

const segmentOptions = Object.keys(ECustomerSegment).filter(key => Number.isNaN(+key));
const daysOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const EditTransportationOptionDialog:React.FC<DialogProps&TEditTransportationOptionDialogProps> = (props) => {
    const { assignedList } = useSelector((state: RootState) => state.serviceRequests);
    const [customerSegment, setCustomerSegment] = useState<string | null>('');
    const [dayOfWeek, setDayOfWeek] = useState<string>('');
    const [timeOfDay, setTimeOfDay] = useState<TTimeObject | null>(null);
    const [duration, setDuration] = useState<TTimeObject | null>(null);
    const [serviceRequests, setServiceRequests] = useState<ITrOptionServiceTRequest[]>([]);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();
    const autoCompleteStyles = useAutocompleteStyles();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadAssignedServiceRequests(selectedSC.id))
        }
    }, [selectedSC])

    const onCustomerSegmentChange = (e: React.ChangeEvent<{}>, value: string[] | string | null): void => {
        if (!Array.isArray(value)) setCustomerSegment(value)
    }

    useEffect(() => {
        if (props.editingElement) {
            const {rules} = props.editingElement;
            setCustomerSegment(rules.customerSegments[0]);
            setServiceRequests(rules.serviceRequests);
            setDayOfWeek(rules.dayOfWeeks[0]);
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

    const handleTimeChange = (type: keyof TTimeObject) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const date = event.target.value;
        setTimeOfDay((prev) => {
            if (prev) {
                return {...prev, [type as keyof TTimeObject]: moment(date)};
            } else {
                return {[type as keyof TTimeObject]: moment(date)}
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
                options={segmentOptions}
                getOptionSelected={(option, value) => option === ECustomerSegment[+value]}
                value={customerSegment ? ECustomerSegment[+customerSegment].toString() : ''}
                onChange={onCustomerSegmentChange}
                renderInput={autocompleteRender({label: 'Applicable Customer Segment', placeholder: 'Select Customer Segment'})}
            />
            <Autocomplete
                fullWidth
                classes={autoCompleteStyles}
                options={daysOptions}
                value={dayOfWeek}
                onChange={onCustomerSegmentChange}
                renderInput={autocompleteRender({label: 'Day Of Week', placeholder: 'Select Day Of Week'})}
            />
            <TextField
                style={{width: '47%'}}
                type="time"
                value={timeOfDay?.start ?? null}
                onChange={handleTimeChange('start')}
                placeholder="Select Time"
                label="Time Of Day"
            />
            <TextField
                style={{width: '47%'}}
                type="time"
                value={timeOfDay?.end ?? null}
                placeholder="Select Time"
                onChange={handleTimeChange('end')}
            />
            <TextField
                style={{width: '47%'}}
                type="date"
                value={duration?.start ?? null}
                onChange={handleDateChange('start')}
                placeholder="Select Date"
                label="Duration"
            />
            <TextField
                style={{width: '47%'}}
                type="date"
                value={duration?.end ?? null}
                placeholder="Select Date"
                onChange={handleDateChange('end')}
            />
        </DialogContent>
    </BaseModal>;
};

export default EditTransportationOptionDialog;