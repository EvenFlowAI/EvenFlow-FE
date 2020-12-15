import React from 'react';
import {Box, Button, styled} from "@material-ui/core";
import {SquarePaper} from "../../UI/Paper";
import {timeString} from "../../../config/constants";
import {DirectionsCar} from "@material-ui/icons";
import {LoanerCarChip, OfferChip, ShortWaitChip} from "./UI";
import {selectAppointment} from "../../../store/reducers/appointment/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";
import {IRemappedAppointmentSlot} from "../../../store/reducers/appointment/types";

const Appointment = styled(SquarePaper)(({theme}) => ({
    padding: theme.spacing(1),
    display: "grid",
    gridTemplateColumns: "120px 60px 40px 3fr repeat(2, 2fr) 1fr 100px",
    gridGap: theme.spacing(.5),
    fontSize: 14,
    alignItems: "center",
    justifyItems: "center"
}));
const AppointmentHeader = styled(Appointment)(({theme}) => ({
    fontWeight: "bold",
    textTransform: "uppercase",
    "&>span": {
        textAlign: "center",
    },
    "&>span:last-child": {
        gridColumnStart: 6,
        gridColumnEnd: -1,
        justifySelf: "self-start"
    }
}));
const justifyStart = {justifySelf: "self-start"};

const labels: string[] = [
    "Date", "Time", "Price", "Special Offer", "Wait Time", "Loaner Car"
]

export const ListAppointmentSelection = () => {
    const selectedAppointment = useSelector((state: RootState) => state.appointment.appointment);
    const appointments = useSelector((state: RootState) => state.appointment.appointmentSlots);
    const dispatch = useDispatch();

    const handleSelectAppointment = (a: IRemappedAppointmentSlot) => () => {
        if (selectedAppointment?.id === a.id) {
            dispatch(selectAppointment(null));
        } else {
            dispatch(selectAppointment(a));
        }
    }

    return <div>
        <AppointmentHeader elevation={0}>
            {labels.map((label, idx) =>
                <span key={idx} style={!idx ? justifyStart : undefined}>{label}</span>
            )}
        </AppointmentHeader>
        {appointments.map(appointment => {
            const {id, date, offers, isShorterWaitTime, price} = appointment;
            return <Box key={id} mt={.5}>
                <Appointment variant="outlined">
                    <span style={justifyStart}>{date.format("MMM D, YYYY ddd")}</span>
                    <span>{date.format(timeString)}</span>
                    <span><strong>${price.value.toFixed(0)}</strong></span>
                    <span>{offers.length ? <OfferChip white offer={offers[0]}/> : null}</span>
                    <span>{isShorterWaitTime ? <ShortWaitChip white/> : null}</span>
                    <span>{false ? <LoanerCarChip white/> : null}</span>
                    <span>{false ? <DirectionsCar fontSize="small"/> : null}</span>
                    <Button
                        color="primary"
                        fullWidth
                        onClick={handleSelectAppointment(appointment)}
                        variant={selectedAppointment?.id === id ? "contained" : "outlined" }>
                        Schedule
                    </Button>
                </Appointment>
            </Box>;}
        )}
    </div>
};