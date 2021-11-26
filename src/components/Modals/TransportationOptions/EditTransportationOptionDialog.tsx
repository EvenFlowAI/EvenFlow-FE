import React, {useEffect, useState} from 'react';
import {BaseModal, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import {ITransportationOptionFull, ITrOptionServiceTRequest} from "../../../store/reducers/transportationNeeds/types";
import {useSCs} from "../../../utils/hooks";
import {useDispatch, useSelector} from "react-redux";
import {loadAssignedServiceRequests} from "../../../store/reducers/serviceRequests/actions";
import {RootState} from "../../../store/rootReducer";
import moment from "moment";

type TEditTransportationOptionDialogProps = {
    editingElement: ITransportationOptionFull | null;
}

type TTimeObject = {
    start: moment.Moment;
    end: moment.Moment;
}

const EditTransportationOptionDialog:React.FC<DialogProps&TEditTransportationOptionDialogProps> = (props) => {
    const { assignedList } = useSelector((state: RootState) => state.serviceRequests);
    const [customerSegment, setCustomerSegment] = useState<string | number>('');
    const [dayOfWeek, setDayOfWeek] = useState<string | number>('');
    const [timeOfDay, setTimeOfDay] = useState<TTimeObject | null>(null);
    const [duration, setDuration] = useState<TTimeObject | null>(null);
    const [serviceRequests, setServiceRequests] = useState<ITrOptionServiceTRequest[]>([]);
    const {selectedSC} = useSCs();
    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedSC) {
            dispatch(loadAssignedServiceRequests(selectedSC.id))
        }
    }, [selectedSC])

    useEffect(() => {
        if (props.editingElement) {
            const {rules} = props.editingElement;
            setCustomerSegment(rules.customerSegments[0]);
            setServiceRequests(rules.serviceRequests);
            setDayOfWeek(rules.dayOfWeeks[0]);
            setTimeOfDay(() => ({
               start: moment.utc()
                   .hours(rules.timeOfDay.start.hours)
                   .minutes(rules.timeOfDay.start.minutes)
                   .second(rules.timeOfDay.start.seconds),
               end: moment.utc()
                   .hours(rules.timeOfDay.end.hours)
                   .minutes(rules.timeOfDay.end.minutes)
                   .second(rules.timeOfDay.end.seconds),
            }));
            setDuration(() => ({
                start: moment.utc(rules.duration.start),
                end: moment.utc(rules.duration.end),
            }));
        }
    }, [props.editingElement])

    return <BaseModal {...props} width={700}>
        <DialogTitle onClose={props.onClose}>Manage Rules</DialogTitle>
        <DialogContent>
        </DialogContent>
    </BaseModal>;
};

export default EditTransportationOptionDialog;