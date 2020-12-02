import React, {useMemo} from 'react';
import {getAppointmentList, TAppointment} from "./mock";
import {Box, Button, styled} from "@material-ui/core";
import {SquarePaper} from "../../UI/Paper";
import moment from "moment";
import {timeString} from "../../../config/constants";
import {DirectionsCar} from "@material-ui/icons";
import {LoanerCarChip, OfferChip, ShortWaitChip} from "./UI";
import {selectAppointment} from "../../../store/reducers/appointment/actions";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/rootReducer";

const Appointment = styled(SquarePaper)(({theme}) => ({
    padding: theme.spacing(1),
    display: "grid",
    gridTemplateColumns: "150px repeat(4, 2fr) 1fr 100px",
    gridGap: theme.spacing(.5),
    fontSize: 15,
    alignItems: "center",
    justifyItems: "center"
}));

export const ListAppointmentSelection = () => {
    const selectedAppointment = useSelector((state: RootState) => state.appointment.appointment);
    const appointments = useMemo(() => {
        return getAppointmentList();
    }, []);
    const dispatch = useDispatch();

    const handleSelectAppointment = (a: TAppointment) => () => {
        if (selectedAppointment?.id === a.id) {
            dispatch(selectAppointment(null));
        } else {
            dispatch(selectAppointment(a));
        }
    }

    return <div>
        {appointments.map(appointment => {
            const {id, date, offer, earlyDropOff, shortWait, loanerCar} = appointment;
            return <Box key={id} mt={.5}>
                <Appointment variant="outlined">
                    <span style={{justifySelf: "self-start"}}>{moment(date).format("MMM D, YYYY ddd")}</span>
                    <span>{moment(date).format(timeString)}</span>
                    <span>{offer ? <OfferChip offer={offer}/> : null}</span>
                    <span>{shortWait ? <ShortWaitChip/> : null}</span>
                    <span>{loanerCar ? <LoanerCarChip/> : null}</span>
                    <span>{earlyDropOff ? <DirectionsCar fontSize="small"/> : null}</span>
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