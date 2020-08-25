import {makeStyles} from "@material-ui/core/styles";
import {Alarm, DateRange, FreeBreakfastOutlined, LockOutlined, PlaceOutlined} from "@material-ui/icons";
import {Card} from "@material-ui/core";
import React from "react";
import {useModal} from "../../../../utils/hooks";
import {EditAddress} from "../../../Modals/EditAddress/EditAddress";
import {HourOfOperations} from "../../../Modals/HourOfOperations/HourOfOperations";
import {WeeklySchedule} from "../../../Modals/WeeklySchedule/WeeklySchedule";

const useStyles = makeStyles(theme => ({
    wrapper: {
        display: "flex",
        margin: "0 -5px 12px",
    },
    card: {
        margin: 5,
        flexGrow: 1,
        borderRadius: 0,
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
        flexGrow: 4,
        "&>.MuiSvgIcon-root": {
            fontSize: 45,
        }
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
    action: React.MouseEventHandler
}

export const Cards = () => {
    const {
        onClose: onCloseAddress,
        onOpen: onOpenAddress,
        isOpen: isAddressOpen
    } = useModal();
    const {
        onClose: onCloseHOO,
        onOpen: onOpenHOO,
        isOpen: isHOOOpen
    } = useModal();
    const {
        onClose: onCloseWS,
        onOpen: onOpenWS,
        isOpen: isWSOpen
    } = useModal();

    const cards: TCardItem[] = [
        {label: "Address", icon: <PlaceOutlined />, action: onOpenAddress},
        {label: "Hours of operation", icon: <Alarm />, action: onOpenHOO},
        {label: "Weekly schedule", icon: <DateRange />, action: onOpenWS},
        {label: "Breaks", icon: <FreeBreakfastOutlined />, action: onOpenAddress},
        {label: "Holidays", icon: <LockOutlined />, action: onOpenAddress},
    ];

    const classes = useStyles();
    return <div className={classes.wrapper}>
        {cards.map(card =>
            <Card className={classes.card} key={card.label} variant="outlined">
                <span className={classes.hElement} />
                <div className={classes.cardContent}>
                    <div className={classes.cardIcon}>
                        {card.icon}
                    </div>
                    <div className={classes.cardTitle}>
                        <h3 className={classes.titleContent}>{card.label}</h3>
                    </div>
                </div>
                <div className={classes.edit} onClick={card.action}>Edit</div>
            </Card>
        )}
        <EditAddress open={isAddressOpen} onClose={onCloseAddress} />
        <HourOfOperations open={isHOOOpen} onClose={onCloseHOO} />
        <WeeklySchedule open={isWSOpen} onClose={onCloseWS} />
    </div>
}