import {makeStyles} from "@material-ui/core/styles";
import {Alarm, DateRange, FreeBreakfastOutlined, LockOutlined, PlaceOutlined} from "@material-ui/icons";
import {Card} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles(theme => ({
    wrapper: {
        display: "flex",
        margin: "0 -5px 12px",
    },
    card: {
        margin: 5,
        flexGrow: 1,
        position: "relative",
    },
    hElement: {
        content: "",
        display: "block",
        paddingBottom: "100%"
    },
    cardContent: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        display: "flex",
        flexFlow: "column"
    },
    cardIcon: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 4
    },
    edit: {
        cursor: "pointer",
        position: "absolute",
        right: 12,
        top: 12,
        fontSize: 13,
        fontWeight: "bold",
        color: theme.palette.primary.main
    },
    cardTitle: {
        flexGrow: 1,
    },
    titleContent: {
        fontSize: 15,
        textTransform: "uppercase",
        textAlign: "center",
        margin: 0
    }
}));

type TCardItem = {
    label: string;
    icon: JSX.Element,
}
const cards: TCardItem[] = [
    {label: "Address", icon: <PlaceOutlined />},
    {label: "Hours of operation", icon: <Alarm />},
    {label: "Weekly schedule", icon: <DateRange />},
    {label: "Breaks", icon: <FreeBreakfastOutlined />},
    {label: "Holidays", icon: <LockOutlined />},
];

export const Cards = () => {
    const classes = useStyles();
    return <div className={classes.wrapper}>
        {cards.map(card =>
            <Card className={classes.card} key={card.label}>
                <span className={classes.hElement} />
                <div className={classes.cardContent}>
                    <div className={classes.cardIcon}>
                        {card.icon}
                    </div>
                    <div className={classes.cardTitle}>
                        <h3 className={classes.titleContent}>{card.label}</h3>
                    </div>
                </div>
                <div className={classes.edit}>Edit</div>
            </Card>
        )}
    </div>
}