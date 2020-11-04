import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Button, Paper} from "@material-ui/core";
import {customerSegmentsMap, dayOfWeekMap, EOfferType, IOffer} from "../../../store/reducers/offers/types";
import moment from "moment";
import {timeSpanString, timeString} from "../../../config/constants";
import {calendarDateFormat} from "../../Optimizer/EmployeeSchedule/utils";

const useStyles = makeStyles({
    wrapper: {
        borderRadius: 0,
        padding: 20,
        position: "relative",
        minHeight: 200,
        height: "100%"
    },
    title: {
        margin: 0,
        fontSize: 14,
        textTransform: "uppercase",
        paddingRight: 46
    },
    edit: {
        position: "absolute",
        top: 8,
        right: 8,
        textTransform: "none",
        zIndex: 2
    },
    label: (t: IOffer["type"]) => ({
        paddingRight: "50%",
        fontSize: t === EOfferType.FreeService ? 18 : 32,
        fontWeight: "bold",
        textTransform: "uppercase"
    }),
    content: {
        height: "100%",
        justifyContent: "space-between",
        display: "flex",
        flexFlow: "column nowrap"
    },
    info: {
        paddingRight: "60%",
        fontSize: 12
    },
    data: {
        position: "absolute",
        top: 0,
        left: "40%",
        right: 0,
        bottom: 0,
        padding: 20,
        fontSize: 13,
        display: "flex",
        zIndex: 1,
        flexFlow: "column",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        "&>span": {
            textAlign: "right",
            marginTop: 18,
        }
    },
    background: (t: IOffer["type"]) => ({
        position: "absolute",
        top: 0,
        left: "20%",
        right: 0,
        lineHeight: `${t === EOfferType.FreeService ? 8 : 11}rem`,
        userSelect: "none",
        fontSize: `${t === EOfferType.FreeService ? 8 : 11}rem`,
        opacity: .05,
        color: "#7898FF",
        fontWeight: "bold",
        textAlign: "center"
    })
});
type TProps = {
    offer: IOffer,
    onClick: (offer: IOffer) => () => void;
}
export const OfferPlate: React.FC<TProps> = ({offer, onClick}) => {
    const classes = useStyles(offer.type);
    return (
        <Paper variant="outlined" className={classes.wrapper}>
            <Button color="primary" onClick={onClick(offer)} className={classes.edit}>Edit</Button>
            <div className={classes.content}>
                <h3 className={classes.title}>{offer.title}</h3>
                <span className={classes.label}>
                    {offer.type === EOfferType.FreeService ? offer.serviceType?.name || "-" : offer.value}
                    {offer.type === EOfferType.PercentOff ? "%" : offer.type === EOfferType.AmountOff ? "$" : ""}
                </span>
                <span className={classes.info}>
                    {offer.customerSegments.map(s => customerSegmentsMap[s]).join(", ")}
                </span>
            </div>
            <div className={classes.data}>
                <span>{offer.dayOfWeeks.map(s => dayOfWeekMap[s]).join(", ")}</span>
                <span>
                    <span className="nowrap">{moment(offer.timeOfDay.start, timeSpanString).format(timeString)}</span>
                    <span> - </span>
                    <span className="nowrap">{moment(offer.timeOfDay.end, timeSpanString).format(timeString)}</span>
                </span>
                <span>
                    <span className="nowrap">
                        {moment(offer.duration.start).format(calendarDateFormat)}
                    </span>
                    <span> - </span>
                    <span className="nowrap">
                        {moment(offer.duration.end).format(calendarDateFormat)}
                    </span>
                </span>
            </div>
            <div className={classes.background}>
                {offer.type === EOfferType.PercentOff
                    ? "%"
                    : offer.type === EOfferType.AmountOff
                        ? "$"
                        : "FREE"}
            </div>
        </Paper>
    );
};