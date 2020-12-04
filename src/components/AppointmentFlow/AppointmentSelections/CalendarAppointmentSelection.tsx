import React, {useMemo, useState} from 'react';
import {getAppointmentList, TAppointment} from "./mock";
import moment from "moment";
import {MonthSelector} from "./MonthSelector";
import {Box, styled} from "@material-ui/core";
import {DayPlate} from "./DayPlate";

type TGroupedAppointments = {
    date: moment.Moment;
    offers: boolean;
    appointments: TAppointment[];
}

const DateSelectorContainer = styled("div")(({theme}) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexFlow: "row nowrap",
    fontWeight: "bold",
    textTransform: "uppercase"
}));

const DaysWrapper = styled("div")(({theme}) => ({
    marginTop: theme.spacing(2),
    display: "flex",
    flexFlow: "row nowrap",
    alignItems: "center",
    justifyContent: "flex-start",
    overflowX: "auto",
    "&>div": {
        marginRight: theme.spacing(2)
    }
}))

export const CalendarAppointmentSelection = () => {
    const [date, setDate] = useState<moment.Moment>(moment());
    const [selectedIdx, setSelectedIdx] = useState<number|null>(null);
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
                if (appointment.offer) {
                    appointments[idx].offers = appointments[idx].offers || Boolean(appointment.offer);
                }
            } else {
                appointments[idx] = {
                    date,
                    appointments: [appointment],
                    offers: Boolean(appointment.offer)
                };
            }
        }
        return appointments;
    }, [data]);

    const handleSetDate = (nDate: moment.Moment) => {
        setDate(nDate);
    }
    const handleDateClick = (idx: number) => () => {
        setSelectedIdx(idx);
    }

    return <div>
        <DateSelectorContainer>
            <Box mr={2}>Select date</Box>
            <MonthSelector date={date} onChange={handleSetDate} />
        </DateSelectorContainer>
        <DaysWrapper>
            {groupedAppointments.map(({date, appointments, offers}, idx) => {
                if (!date) return null;
                return <DayPlate
                    key={date.date()}
                    date={date}
                    selected={selectedIdx === idx}
                    offers={offers}
                    onClick={handleDateClick(idx)}
                />;
            })}
        </DaysWrapper>
    </div>
};