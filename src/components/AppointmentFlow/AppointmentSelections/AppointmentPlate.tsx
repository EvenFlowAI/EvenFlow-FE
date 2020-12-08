import React from 'react';
import {TAppointment} from "./mock";
import {styled} from "@material-ui/core";
import {timeString} from "../../../config/constants";
import moment from "moment";
import {SquarePaper} from "../../UI/Paper";
import {CalendarOfferChip, CalendarWaitChip} from "./UI";
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import {DirectionsCar} from "@material-ui/icons";

const Wrapper = styled("div")(({theme}) => ({
    display: "flex",
    flexFlow: "column nowrap",
    height: "100%"
}));
const Paper = styled(SquarePaper)(({theme}) => ({
    flexGrow: 1,
    cursor: "pointer",
    display: "flex",
    flexFlow: "row nowrap",
    alignItems: "stretch",
    minWidth: 80,
    minHeight: 90,
    background: "#fff",
    borderColor: "#e0e0e0",
    transition: theme.transitions.create(["background", "color"]),
    "&.selected": {
        background: theme.palette.primary.main,
        color: "#fff"
    }
}));
const Time = styled("div")(({theme}) => ({
    textAlign: "center",
    textTransform: "uppercase",
    fontSize: 15
}));
const Price = styled("div")({
    display: "flex",
    position: "relative",
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

const DropOffChip = styled(props => <div {...props}><DirectionsCar fontSize="small"/></div>)({
    position: "absolute",
    bottom: 7,
    left: 0,
    right: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexFlow: "row nowrap"
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
    appointment: TAppointment;
    selected: boolean;
}
export const AppointmentPlate: React.FC<TProps&React.HTMLAttributes<HTMLDivElement>> = ({
    appointment, selected, children, ...htmlAttributes
}) => {
    const classes = useStyles(
        (appointment.offer ? 1 : 0)
        + (appointment.shortWait ? 1 : 0)
    );
    return <Wrapper {...htmlAttributes}>
        <Time>{moment(appointment.date).format(timeString)}</Time>
        <Paper variant="outlined" className={selected ? "selected" : undefined}>
            <Price className={classes.width}>
                <span><sup>$</sup>{appointment.price.toFixed(0)}</span>
                {appointment.earlyDropOff ? <DropOffChip /> : null}
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