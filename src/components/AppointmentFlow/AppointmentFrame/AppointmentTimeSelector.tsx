import React, {useMemo} from 'react';
import moment from "moment";
import {IAppointmentSlot} from "../../../store/reducers/appointment/types";
import {TimeSlotCard} from "./TimeSlotCard";
import {styled} from "@material-ui/core";


const TimeSlotsWrapper = styled('div')({
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: "20px 12px",
    alignItems: "center",
    justifyContent: "center",
    "&>div": {
        flexGrow: 1
    }
})

type TProps = {
    date: moment.Moment;
    slot: IAppointmentSlot|null
}
export const AppointmentTimeSelector: React.FC<TProps> = ({date, slot}) => {
    const slots = useMemo(() => {
        // TODO: Start end dates?
        const start = moment.utc(date).hour(8).minute(0).second(0).millisecond(0);
        const end = moment.utc(start).hour(18);
        const slots: string[] = [];
        let cDate = moment.utc(start);
        while (cDate.isSameOrBefore(end, 'minute')) {
            slots.push(cDate.format("h:mm a"));
            cDate = moment.utc(cDate).add(30, 'minutes');
        }
        return slots;
    }, [date]);
    return (
        <div>
            <h4>Select Time</h4>
            <TimeSlotsWrapper>
                {slots.map(timeSlot =>
                    <TimeSlotCard
                        timeSlot={timeSlot}
                        slot={slot}
                        key={timeSlot}
                    />)}
            </TimeSlotsWrapper>
        </div>
    );
};