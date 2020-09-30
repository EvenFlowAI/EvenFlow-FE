import React from "react";
import {useSCs, useSelectedPod} from "../../../utils/hooks";
import {Grid, Paper} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    paper: {
        marginBottom: 10,
        borderRadius: 0,
        padding: 10,
        position: "relative"
    },
    gridContainer: {
        margin: "0 -16px"
    },
    dataRow: {
        fontSize: 14
    },
    row: {
        borderRight: `1px solid ${theme.palette.divider}`
    },
    titleRow: {
        textTransform: "uppercase",
        fontWeight: "bold",
        fontSize: 12,
        color: theme.palette.text.disabled
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        textTransform: "uppercase",
        margin: "0 0 16px",
    },
}));

const ButtonRow = () => {
    const classes = useStyles();
    return <Grid container spacing={2} className={classes.dataRow}>
        <Grid className={classes.titleRow} item xs={3}>
            Slot starts
        </Grid>
        <Grid className={classes.titleRow} item xs={3}>
            Slot ends
        </Grid>
        <Grid item xs={6} />

        <Grid item xs={3}>
            H1
        </Grid>
        <Grid item xs={3}>
            H2
        </Grid>
        <Grid item xs={6}>
            Buttons
        </Grid>
    </Grid>
}

export const AppointmentSlotsDesirability = () => {
    const {selectedSC} = useSCs();
    const {selectedPod} = useSelectedPod();

    const classes = useStyles();

    return <Paper className={classes.paper} variant="outlined">
        <h2 className={classes.title}>
            Please indicate the desirability of appointment slots
        </h2>
        <Grid className={classes.gridContainer} container spacing={4} alignItems="stretch">
            <Grid className={classes.row} item xs={6}>
                <ButtonRow />
            </Grid>
            <Grid item xs={6}>

            </Grid>
        </Grid>
    </Paper>
}