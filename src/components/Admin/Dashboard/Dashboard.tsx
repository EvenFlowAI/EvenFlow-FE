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
}

export const AdminDashboard: React.FC = props => {
    const items: TItem[] = [
        {label: "Address", icon: <PlaceOutlined />},
        {label: "Hours of operation", icon: <Alarm />},
        {label: "Weekly schedule", icon: <DateRange />},
        {label: "Bays", icon: <Build />},
        {label: "Breaks", icon: <FreeBreakfastOutlined />},
        {label: "Holidays", icon: <LockOutlined />},
        {label: "Technician stuff", icon: <PeopleAltOutlined />},
        {label: "Pods", icon: <FormatListNumbered />},
    ];

    const classes = useStyles();
    return <div>
        <DashboardTitle />
        <Grid container spacing={2}>
            {items.map(item =>
                <Grid item xs={4} key={item.label}>
                    <Paper variant="outlined" className={classes.paper}>
                        <span className={classes.edit}>Edit</span>
                        <div className={classes.icon}>{item.icon}</div>
                        <h4 className={classes.label}>{item.label}</h4>
                    </Paper>
                </Grid>
            )}
        </Grid>
    </div>
}