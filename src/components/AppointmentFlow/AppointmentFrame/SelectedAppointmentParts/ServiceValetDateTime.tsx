import React, {useEffect, useState} from "react";
import {IServiceValetAppointment} from "../../../../store/reducers/appointment/types";
import {useSelector} from "react-redux";
import {RootState} from "../../../../store/rootReducer";
import moment from "moment";
import {DateWrapper} from "../SelectedAppointment";

type TDropOffTime = {
    hoursDMin: string;
    minutesDMin: string;
    hoursDMax: string;
    minutesDMax: string;
}

const ServiceValetDateTime: React.FC<{serviceValetAppointment: IServiceValetAppointment}> = ({serviceValetAppointment}) => {
    const { dropOffSettings } = useSelector((state: RootState) => state.appointment);
    const [dropOffTime, setDropOffTime] = useState<TDropOffTime|null>(null);
    const [hoursPMin, minutesPMin] = serviceValetAppointment.pickUpMin.split(":");
    const [hoursPMax, minutesPMax] = serviceValetAppointment.pickUpMax.split(":");

    useEffect(() => {
        if (serviceValetAppointment.dropOffMax && serviceValetAppointment.dropOffMin) {
            setDropOffTime({
                hoursDMin: serviceValetAppointment.dropOffMin.split(":")[0],
                minutesDMin: serviceValetAppointment.dropOffMin.split(":")[1],
                hoursDMax: serviceValetAppointment.dropOffMax.split(":")[0],
                minutesDMax: serviceValetAppointment.dropOffMax.split(":")[1],
            })
        }
    }, [serviceValetAppointment])

    return <DateWrapper>
        <div>Date: <span>{moment.utc(serviceValetAppointment.date).format('MMMM D')}</span></div>
        <div>Pick Up Time:
            <span> {moment(serviceValetAppointment.date).set('hour', +hoursPMin).set('minute', +minutesPMin).format("hh:mm A")} to {moment(serviceValetAppointment.date).set('hour', +hoursPMax).set('minute', +minutesPMax).format("hh:mm A")}</span>
        </div>
        {dropOffSettings?.showDropOffTime && dropOffTime
            ? <div>Drop Off Time:
                <span> {moment(serviceValetAppointment.date).set('hour', +dropOffTime.hoursDMin).set('minute', +dropOffTime.minutesDMin).format("hh:mm A")} to {moment(serviceValetAppointment.date).set('hour', +dropOffTime.hoursDMax).set('minute', +dropOffTime.minutesDMax).format("hh:mm A")}</span>
            </div>
            : null}
    </DateWrapper>
}

export default ServiceValetDateTime;