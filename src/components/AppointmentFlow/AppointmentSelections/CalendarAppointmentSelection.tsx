import React, {useEffect, useMemo, useRef, useState} from 'react';
import moment from "moment";
import {Box, Divider, Grid, IconButton, styled} from "@material-ui/core";
import {DayPlate} from "./DayPlate";
import {ChevronLeft, ChevronRight} from "@material-ui/icons";
import {AppointmentPlate} from "./AppointmentPlate";
import {selectAppointment} from "../../../store/reducers/appointment/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {IRemappedAppointmentSlot} from "../../../store/reducers/appointment/types";

type TGroupedAppointments = {
    [k: string]: {
        date: moment.Moment;
        lowestPrice: number;
        idx: string;
        offers: boolean;
        appointments: IRemappedAppointmentSlot[];
    }
}

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

    const [sliceIdx, setSliceIdx] = useState<number>(0);
    const [selectedIdx, setSelectedIdx] = useState<string|null>(null);
    const selectedAppointment = useSelector((state: RootState) => state.appointment.appointment);
    const isMount = useRef(true);

    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedAppointment && isMount.current) {
            setSelectedIdx(selectedAppointment.id.split("|")[0]);
            isMount.current = false;
        }
    }, [selectedAppointment]);

    const data = useSelector((state: RootState) => state.appointment.appointmentSlots);
    const groupedAppointments: TGroupedAppointments = useMemo(() => {
        const appointments: TGroupedAppointments = {};
        for (let appointment of data) {
            const date = moment(appointment.date);
            const idx = appointment.id.split("|")[0];
            if (appointments[idx]) {
                appointments[idx].appointments.push(appointment);
                if (appointment.offer) {
                    appointments[idx].offers = appointments[idx].offers || Boolean(appointment.offer);
                }
                if (appointment.price.value < appointments[idx].lowestPrice) {
                    appointments[idx].lowestPrice = appointment.price.value;
                }
            } else {
                appointments[idx] = {
                    date,
                    idx,
                    lowestPrice: appointment.price.value,
                    appointments: [appointment],
                    offers: Boolean(appointment.offer)
                };
            }
        }
        return appointments;
    }, [data]);

    const dateAppointments = useMemo(() => {
        return selectedIdx ? groupedAppointments[selectedIdx]?.appointments || [] : [];
    }, [selectedIdx, groupedAppointments]);
    const handleDateClick = (idx: string) => () => {
        setSelectedIdx(idx);
    }
    const handleSlide = (direction: "right"|"left") => () => {
        if (
            (sliceIdx + displayItems < Object.values(groupedAppointments).length && direction === "right")
            || (sliceIdx > 0 && direction === "left")
        ) {
            setSliceIdx(direction === "right" ? sliceIdx + displayItems : sliceIdx - displayItems);
        }
    }

    const handleSelectAppointment = (a: IRemappedAppointmentSlot) => () => {
        dispatch(selectAppointment(a));
    }

    return <div>
        <DaysWrapper>
            {groupedAppointments.length ? <IconButton
                disabled={sliceIdx <= 0}
                onClick={handleSlide("left")}>
                <ChevronLeft/>
            </IconButton> : null}
            <Grid container style={{flexGrow: 1}} spacing={4}>
            {Object.values(groupedAppointments)
                .slice(sliceIdx, sliceIdx + displayItems)
                .map(({date, lowestPrice, offers, idx}) => {
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
            {groupedAppointments.length ? <IconButton
                disabled={sliceIdx + displayItems >= Object.values(groupedAppointments).length}
                onClick={handleSlide("right")}>
                <ChevronRight/>
            </IconButton> : null}
        </DaysWrapper>
        {selectedIdx ? <Box>
            <Box my={2}>
                <Divider />
            </Box>
            <Box mb={1}>
                <Title>Select time</Title>
            </Box>
            <Grid container spacing={2}>
                {dateAppointments.map(appointment =>
                    <Grid key={appointment.id} item xs={3}>
                        <AppointmentPlate
                            selected={appointment.id === selectedAppointment?.id}
                            onClick={handleSelectAppointment(appointment)}
                            appointment={appointment}
                        />
                    </Grid>
                )}
            </Grid>
        </Box> : null}
    </div>
};