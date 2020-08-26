import React from "react";
import {Grid, Paper, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {
    Alarm, Build,
    DateRange, FormatListNumbered,
    FreeBreakfastOutlined,
    LockOutlined,
    PeopleAltOutlined,
    PlaceOutlined
} from "@material-ui/icons";
import {EditAddress} from "../../Modals/EditAddress/EditAddress";
import {HourOfOperations} from "../../Modals/HourOfOperations/HourOfOperations";
import {WeeklySchedule} from "../../Modals/WeeklySchedule/WeeklySchedule";
import {Holidays} from "../../Modals/Holydays/Holidays";
import {Break} from "../../Modals/Breaks/Break";
import {useModal} from "../../../utils/hooks";

const useStyles = makeStyles(theme => ({
    paper: {
        position: "relative",
        borderRadius: 0
    },
    icon: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 120,
        "& .MuiSvgIcon-root": {
            fontSize: 40
        }
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        textTransform: "uppercase",
        textAlign: "center",
        marginTop: 0
    },
    edit: {
        cursor: "pointer",
        fontSize: 14,
        padding: 12,
        display: "inline-block",
        position: "absolute",
        right: 0,
        top: 0,
        fontWeight: "bold",
        color: theme.palette.primary.main,
        transition: theme.transitions.create(["color"]),
        "&:hover": {
            color: theme.palette.primary.dark
        }
    }
}));

const useDStyles = makeStyles({
    title: {
        fontSize: 24,
        fontWeight: "bold"
    },
    container: {
        marginBottom: 16,
        marginTop: -12
    }
})

const DashboardTitle = () => {
    const classes = useDStyles();
    return <div className={classes.container}>
        <Typography className={classes.title} variant="h2">Honda Downtown</Typography>
        <Typography variant="subtitle1">6391 Elgin St. Celina, Chicago 10299</Typography>
    </div>
}

type TItem = {
    label: string;
    icon: JSX.Element;
    action: () => void;
}

export const AdminDashboard: React.FC = props => {
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

    const items: TItem[] = [
        {label: "Address", icon: <PlaceOutlined />, action: onOpenAddress},
        {label: "Hours of operation", icon: <Alarm />, action: onOpenHOO},
        {label: "Weekly schedule", icon: <DateRange />, action: onOpenWS},
        {label: "Bays", icon: <Build />, action: onOpenAddress},
        {label: "Breaks", icon: <FreeBreakfastOutlined />, action: onOpenB},
        {label: "Holidays", icon: <LockOutlined />, action: onOpenH},
        {label: "Technician stuff", icon: <PeopleAltOutlined />, action: onOpenAddress},
        {label: "Pods", icon: <FormatListNumbered />, action: onOpenAddress},
    ];

    const classes = useStyles();
    return <div>
        <DashboardTitle />
        <Grid container spacing={2}>
            {items.map(item =>
                <Grid item xs={4} key={item.label}>
                    <Paper variant="outlined" className={classes.paper}>
                        <span className={classes.edit} onClick={item.action}>Edit</span>
                        <div className={classes.icon}>{item.icon}</div>
                        <h4 className={classes.label}>{item.label}</h4>
                    </Paper>
                </Grid>
            )}
        </Grid>
        <EditAddress open={isAddressOpen} onClose={onCloseAddress} />
        <HourOfOperations open={isHOOOpen} onClose={onCloseHOO} />
        <WeeklySchedule open={isWSOpen} onClose={onCloseWS} />
        <Break open={isBOpen} onClose={onCloseB} />
        <Holidays open={isHOpen} onClose={onCloseH} />
    </div>
}