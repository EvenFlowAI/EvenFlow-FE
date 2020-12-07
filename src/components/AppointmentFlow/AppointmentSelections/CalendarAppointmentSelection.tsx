import React, {useMemo, useState} from 'react';
import {getAppointmentList, TAppointment} from "./mock";
import moment from "moment";
import {MonthSelector} from "./MonthSelector";
import {Box, Divider, Grid, IconButton, styled} from "@material-ui/core";
import {DayPlate} from "./DayPlate";
import {ChevronLeft, ChevronRight} from "@material-ui/icons";
import {AppointmentPlate} from "./AppointmentPlate";

type TGroupedAppointments = {
    date: moment.Moment;
    lowestPrice: number;
    idx: number;
    offers: boolean;
    appointments: TAppointment[];
}

const DateSelectorContainer = styled("div")(({theme}) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexFlow: "row nowrap"
}));

const Title = styled("h5")({
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 16,
    margin: 0
});

const DaysWrapper = styled("div")(({theme}) => ({
    marginTop: theme.spacing(2),
    display: "flex",
    flexFlow: "row nowrap",
    alignItems: "center",
    justifyContent: "space-between",
}));

export const CalendarAppointmentSelection = () => {
    const displayItems = 6;
    const [date, setDate] = useState<moment.Moment>(moment());
    const [sliceIdx, setSliceIdx] = useState<number>(0);
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
                if (appointment.price < appointments[idx].lowestPrice) {
                    appointments[idx].lowestPrice = appointment.price;
                }
            } else {
                appointments[idx] = {
                    date,
                    idx,
                    lowestPrice: appointment.price,
                    appointments: [appointment],
                    offers: Boolean(appointment.offer)
                };
            }
        }
        return appointments.filter(v => Boolean(v));
    }, [data]);

    const getAppointments = () => {
        if (selectedIdx) {
            const app = groupedAppointments.find(a => a.idx === selectedIdx);
            return app?.appointments || [];
        } else {
            return [];
        }
    }

    const handleSetDate = (nDate: moment.Moment) => {
        setDate(nDate);
    }
    const handleDateClick = (idx: number) => () => {
        setSelectedIdx(idx);
    }
    const handleSlide = (direction: "right"|"left") => () => {
        if (
            (sliceIdx + displayItems < groupedAppointments.length && direction === "right")
            || (sliceIdx > 0 && direction === "left")
        ) {
            setSliceIdx(direction === "right" ? sliceIdx + displayItems : sliceIdx - displayItems);
        }
    }

    return <div>
        <DateSelectorContainer>
            <Box mr={2}><Title>Select date</Title></Box>
            <MonthSelector date={date} onChange={handleSetDate} />
        </DateSelectorContainer>
        <DaysWrapper>
            <IconButton
                disabled={sliceIdx <= 0}
                onClick={handleSlide("left")}>
                <ChevronLeft />
            </IconButton>
            <Grid container style={{flexGrow: 1}} spacing={4}>
            {groupedAppointments
                .slice(sliceIdx, sliceIdx + displayItems)
                .map(({date, appointments, lowestPrice, offers, idx}) => {
                return <Grid item xs={2} key={date.date()}>
                    <DayPlate
                        date={date}
                        selected={selectedIdx === idx}
                        offers={offers}
                        price={lowestPrice}
                        onClick={handleDateClick(idx)}
                    />
                </Grid>;
            })}
            </Grid>
            <IconButton
                disabled={sliceIdx + displayItems >= groupedAppointments.length}
                onClick={handleSlide("right")}>
                <ChevronRight />
            </IconButton>
        </DaysWrapper>
        {selectedIdx ? <Box>
            <Box my={2}>
                <Divider />
            </Box>
            <Title>Select time</Title>
            <Grid container spacing={3}>
                {getAppointments().map(appointment =>
                    <Grid key={appointment.id} item xs={2}>
                        <AppointmentPlate appointment={appointment} />
                    </Grid>
                )}
            </Grid>
        </Box> : null}
    </div>
};