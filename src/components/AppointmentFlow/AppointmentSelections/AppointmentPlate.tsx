import React from 'react';
import {TAppointment} from "./mock";
import {styled} from "@material-ui/core";
import {timeString} from "../../../config/constants";
import moment from "moment";
import {SquarePaper} from "../../UI/Paper";
import {CalendarOfferChip, CalendarWaitChip} from "./UI";
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";

const Wrapper = styled("div")(({theme}) => ({
    display: "flex",
    flexFlow: "column nowrap",
    height: "100%"
}));
const Paper = styled(SquarePaper)({
    flexGrow: 1,
    display: "flex",
    flexFlow: "row nowrap",
    alignItems: "stretch",
    minWidth: 80,
    minHeight: 80
});
const Time = styled("div")(({theme}) => ({
    textAlign: "center",
    textTransform: "uppercase",
    fontSize: 15
}));
const Price = styled("div")({
    display: "flex",
    flexFlow: "row nowrap",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    fontWeight: "bold",
    "& sup": {
        fontSize: 18,
        position: "relative",
        top: 2
    }
});
const OfferContainer = styled("div")({
    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "stretch"
});

const useStyles = makeStyles({
    width: (w: number) => ({
        width: !w ? "100%" : "50%"
    }),
    height: (w: number) => ({
        height: w === 1 ? "100%" : "50%"
    }),
    border: (w: number) => ({
        borderBottom: w !== 1 ? "1px solid #fff" : "none",
    })
});

type TProps = {
    appointment: TAppointment
}
export const AppointmentPlate: React.FC<TProps> = ({appointment}) => {
    const classes = useStyles(
        (appointment.offer ? 1 : 0)
        + (appointment.shortWait ? 1 : 0)
    );
    return <Wrapper>
        <Time>{moment(appointment.date).format(timeString)}</Time>
        <Paper variant="outlined">
            <Price className={classes.width}>
                <span><sup>$</sup>{appointment.price.toFixed(0)}</span>
            </Price>
            {(appointment.offer || appointment.shortWait) ?
                <OfferContainer className={classes.width}>
                    {appointment.offer ? <CalendarOfferChip className={clsx(classes.height, classes.border)} offer={appointment.offer} /> : null}
                    {appointment.shortWait ? <CalendarWaitChip className={classes.height} />: null}
                </OfferContainer> : null
            }
        </Paper>
    </Wrapper>
};