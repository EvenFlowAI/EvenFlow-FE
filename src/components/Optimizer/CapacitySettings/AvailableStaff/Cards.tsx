import {makeStyles} from "@material-ui/core/styles";
import {Alarm, DateRange, FreeBreakfastOutlined, LockOutlined, PlaceOutlined} from "@material-ui/icons";
import {Card} from "@material-ui/core";
import React from "react";
import {useCurrentUser, useModal} from "../../../../utils/hooks";
import {EditAddress} from "../../../Modals/EditAddress/EditAddress";
import {HourOfOperations} from "../../../Modals/HourOfOperations/HourOfOperations";
import {WeeklySchedule} from "../../../Modals/WeeklySchedule/WeeklySchedule";
import {Break} from "../../../Modals/Breaks/Break";
import {Holidays} from "../../../Modals/Holydays/Holidays";

const useStyles = makeStyles(theme => ({
    wrapper: {
        display: "flex",
        margin: "0 -5px 12px",
        [theme.breakpoints.down("xs")]: {
            flexDirection: "column"
        }
    },
    card: {
        margin: 5,
        flexGrow: 1,
        borderRadius: 0,
        position: "relative",
    },
    hElement: {
        display: "block",
        paddingBottom: "100%",
        [theme.breakpoints.down("xs")]: {
            display: "none"
        }
    },
    cardContent: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        display: "flex",
        flexFlow: "column",
        [theme.breakpoints.down("xs")]: {
            position: "static",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            "&>*": {
                flexGrow: "initial !important",
                padding: theme.spacing(1)
            }
        }
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
    const currentUser = useCurrentUser();
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
    const {
        onClose: onCloseB,
        onOpen: onOpenB,
        isOpen: isBOpen
    } = useModal();
    const {
        onClose: onCloseH,
        onOpen: onOpenH,
        isOpen: isHOpen
    } = useModal();

    const cards: TCardItem[] = [
        {label: "Address", icon: <PlaceOutlined />, action: onOpenAddress},
        {label: "Hours of operation", icon: <Alarm />, action: onOpenHOO},
        {label: "Weekly schedule", icon: <DateRange />, action: onOpenWS},
        {label: "Breaks", icon: <FreeBreakfastOutlined />, action: onOpenB},
        {label: "Holidays", icon: <LockOutlined />, action: onOpenH},
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
                <div className={classes.edit} onClick={card.action}>
                    {card.label === "Holidays" && currentUser?.role === "Manager" ? "View": "Edit"}
                </div>
            </Card>
        )}
        <EditAddress open={isAddressOpen} onClose={onCloseAddress} />
        <HourOfOperations open={isHOOOpen} onClose={onCloseHOO} />
        <WeeklySchedule open={isWSOpen} onClose={onCloseWS} />
        <Break open={isBOpen} onClose={onCloseB} />
        <Holidays open={isHOpen} onClose={onCloseH} />
    </div>
}