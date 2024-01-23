import React from 'react';
import {Button, Paper} from "@mui/material";
import {customerSegmentsMap, dayOfWeekMap, EOfferType, IOffer} from "../../../../store/reducers/offers/types";
import moment from "moment";
import {calendarDateFormat, timeSpanString, time12HourFormat} from "../../../../utils/constants";
import {useStyles} from "./styles";

type TProps = {
    offer: IOffer,
    onClick: (offer: IOffer) => () => void;
}

export const OfferPlate: React.FC<React.PropsWithChildren<React.PropsWithChildren<TProps>>> = ({offer, onClick}) => {
    const classes = useStyles({t: offer.type});
    return (
        <Paper variant="outlined" className={classes.wrapper}>
            <Button color="primary" onClick={onClick(offer)} className={classes.edit}>Edit</Button>
            <div className={classes.content}>
                <h3 className={classes.title}>{offer.title}</h3>
                <span className={classes.label}>
                    {offer.type === EOfferType.AmountOff ? "$" : ""}
                    {offer.type === EOfferType.FreeService ? offer.serviceType?.name || "-" : offer.value}
                    {offer.type === EOfferType.PercentOff ? "%" : ""}
                </span>
                <span className={classes.info}>
                    {offer.customerSegments.map(s => customerSegmentsMap[s]).join(", ")}
                </span>
            </div>
            <div className={classes.data}>
                <span>{offer.dayOfWeeks.map(s => dayOfWeekMap[s]).join(", ")}</span>
                <span>
                    <span className="nowrap">{moment(offer.timeOfDay.start, timeSpanString).format(time12HourFormat)}</span>
                    <span> - </span>
                    <span className="nowrap">{moment(offer.timeOfDay.end, timeSpanString).format(time12HourFormat)}</span>
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