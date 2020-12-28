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
import {TPopoverProps} from "../Steps/types";

const Appointment = styled(SquarePaper)(({theme}) => ({
    padding: theme.spacing(1),
    display: "grid",
    gridTemplateColumns: "120px 60px 40px 3fr repeat(2, 2fr) 1fr 100px",
    gridGap: theme.spacing(.5),
    fontSize: 14,
    alignItems: "center",
    minHeight: 54,
    justifyItems: "center",
    [theme.breakpoints.down("xs")]: {
        gridTemplate: `
            "date time . price"
            "offer sw loaner drop"
            "button button button button"
        `,
        padding: theme.spacing(1),
        gridGap: theme.spacing(2),
        "&>.price": {
            justifySelf: "self-end",
            textAlign: "right",
            gridArea: "price"
        },
        "&>span": {
            width: "100%",
            height: "100%"
        },
        "&>.date": {
            gridArea: "date"
        },
        "&>.time": {
            gridArea: "time"
        },
        "&>.offer": {
            gridArea: "offer"
        },
        "&>.sw": {
            gridArea: "sw"
        },
        "&>.loaner": {
            gridArea: "loaner"
        },
        "&>.drop": {
            gridArea: "drop"
        },
        "&>.button": {
            gridArea: "button"
        }
    }
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
    },
    [theme.breakpoints.down("xs")]: {
        display: "none"
    }
}));
const justifyStart = {justifySelf: "self-start"};

const labels: string[] = [
    "Date", "Time", "Price", "Special Offer", "Wait Time", "Loaner Car"
]

export const ListAppointmentSelection: React.FC<TPopoverProps> = ({onPopoverOpen, onPopoverClose}) => {
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
            const {id, date, offer, isShorterWaitTime, price} = appointment;
            return <Box key={id} mt={.5}>
                <Appointment variant="outlined">
                    <span className="date" style={justifyStart}>{date.format("MMM D, YYYY ddd")}</span>
                    <span className="hour">{date.format(timeString)}</span>
                    <span className="price"><strong>${price.value.toFixed(0)}</strong></span>
                    <span className="offer">{offer ? <OfferChip white offer={offer}/> : null}</span>
                    <span className="sw">{isShorterWaitTime ? <ShortWaitChip white/> : null}</span>
                    <span className="loaner">{false ? <LoanerCarChip white/> : null}</span>
                    <span className="drop">{false ? <DirectionsCar fontSize="small"/> : null}</span>
                    <Button
                        className="button"
                        color="primary"
                        onMouseEnter={onPopoverOpen(appointment)}
                        onMouseLeave={onPopoverClose}
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