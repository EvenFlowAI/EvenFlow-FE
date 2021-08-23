import React, {useEffect, useState} from 'react';
import {TActionProps} from "./types";
import {StepWrapper} from './StepWrapper';
import {Actions} from './Actions';
import {SelectedAppointment} from "./SelectedAppointment";
import {AppointmentDateSelector} from "./AppointmentDateSelector";
import {AppointmentTimeSelector} from "./AppointmentTimeSelector";
import {styled} from "@material-ui/core";
import moment from "moment";
import {useParams} from "react-router-dom";
import {decodeSCID} from "../../../utils/utils";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {EAppointmentTimingType, IAppointmentSlot} from "../../../store/reducers/appointment/types";
import {loadAppointmentSlots} from "../../../store/reducers/appointment/actions";


const Wrapper = styled('div')({
    display: "flex",
    flexDirection: "column",
    width: "100%",
    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: "20px",
    "&>div": {
        border: "1px solid #DADADA",
        padding: "18px 44px",
        "&>h4": {
            fontSize: 16,
            margin: "0 0 16px",
            padding: 0,
            fontWeight: "bold",
            textTransform: "uppercase"
        }
    }
})

export const AppointmentSelection: React.FC<TActionProps> = ({onBack, onNext}) => {
    const [date, setDate] = useState<moment.Moment>(moment().utc());
    const [loading, setLoading] = useState<boolean>(false);
    const [appointmentSlots, setAppointmentSlots] = useState<IAppointmentSlot[]>([]);
    const [
        selectedTimingType,
        selectedTime,
        customerData,
        selectedVehicle
    ] = useSelector((state: RootState) => [
        state.appointmentFrame.selectedTiming,
        state.appointmentFrame.selectedTime,
        state.appointment.customerLoadedData,
        state.appointment.customerSelectedVehicle
    ]);
    const dispatch = useDispatch();

    const {id} = useParams();

    useEffect(() => {
        if (id) {
            setLoading(true);
            const sd: moment.Moment = selectedTime
                ? moment(selectedTime)
                : moment.utc().startOf("day");
            dispatch(loadAppointmentSlots({
                appointmentTimingType: selectedTimingType ?? EAppointmentTimingType.FirstAvailable,
                serviceCenterId: decodeSCID(id),
                // onlyOffers: filters.offersOnly,
                // shorterWaitTime: filters.waitTimeOnly,
                fromDate: sd.toISOString(),
                // serviceRequestIds: selectedServiceRequests,
                serviceRequestIds: [],
                countOfDays: Math.abs(sd.diff(moment(sd).endOf("month"), "days")) + 1,
                customerId: customerData?.id,
                warrantyExpiration: selectedVehicle?.warrantyExpiration
            }, updateDate));
        }
    }, [
        dispatch, id, selectedTimingType, selectedTime,
        selectedVehicle, customerData
    ]);

    const updateDate = (d: moment.Moment) => {
        setDate(d);
    }

    const handleChangeMonth = (m: moment.Moment) => {
        setDate(m);
    }
    return (
        <StepWrapper>
            <Wrapper>
                <SelectedAppointment />
                <AppointmentDateSelector date={date} onDateChange={handleChangeMonth} />
                <AppointmentTimeSelector date={date} slot={null} />
            </Wrapper>
            <Actions onBack={onBack} onNext={onNext} />
        </StepWrapper>
    );
};