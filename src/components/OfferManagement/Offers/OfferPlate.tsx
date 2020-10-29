import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Button, Paper} from "@material-ui/core";
import {customerSegmentsMap, EOfferType, IOffer} from "../../../store/reducers/offers/types";

const useStyles = makeStyles(theme => ({
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
        paddingRight: 18
    },
    edit: {
        position: "absolute",
        top: 8,
        right: 8,
        textTransform: "none"
    },
    label: (t: IOffer["type"]) => ({
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

    }
}));
type TProps = {
    offer: IOffer
}
export const OfferPlate: React.FC<TProps> = ({offer}) => {
    const classes = useStyles(offer.type);
    return (
        <Paper variant="outlined" className={classes.wrapper}>
            <Button color="primary" className={classes.edit}>Edit</Button>
            <div className={classes.content}>
                <h3 className={classes.title}>{offer.title}</h3>
                <span className={classes.label}>
                    {offer.value}
                    {offer.type === EOfferType.PercentOff ? "%" : "$"}
                </span>
                <span className={classes.info}>
                    {offer.customerSegments.map(s => customerSegmentsMap[s]).join(", ")}
                </span>
            </div>
        </Paper>
    );
};