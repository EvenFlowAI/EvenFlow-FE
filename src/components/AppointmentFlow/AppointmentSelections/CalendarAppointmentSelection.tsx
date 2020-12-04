import React, {useMemo, useState} from 'react';
import {getAppointmentList, TAppointment} from "./mock";
import moment from "moment";
import {timeString} from "../../../config/constants";
import {MonthSelector} from "./MonthSelector";

type TGroupedAppointments = {
    date: moment.Moment;
    appointments: TAppointment[];
}

export const CalendarAppointmentSelection = () => {
    const [date, setDate] = useState<moment.Moment>(moment());
    const data = useMemo(() => {
        return getAppointmentList(30);
    }, []);
    const groupedAppointments: TGroupedAppointments[] = useMemo(() => {
        const appointments: TGroupedAppointments[] = [];
        for (let appointment of data) {
            const date = moment(appointment.date);
            const idx = date.date();
            if (appointments[idx]) {
                appointments[idx].appointments.push(appointment);
            } else {
                appointments[idx] = {date, appointments: [appointment]};
            }
        }
        return appointments;
    }, [data]);

    const handleSetDate = (nDate: moment.Moment) => {
        setDate(nDate);
    }

    return <div>
        <h4>Select date: <MonthSelector date={date} onChange={handleSetDate} /></h4>
        {groupedAppointments.map(({date, appointments}) => {
            if (!date) return null;
            return <div key={date.date()}>
                day: {date.format("MMM, D YYYY - ddd")}
                {appointments.map(appointment => {
                    return <span key={String(appointment.date)}>{moment(appointment.date).format(timeString)}, </span>;
                })}
            </div>
        })}
    </div>
};