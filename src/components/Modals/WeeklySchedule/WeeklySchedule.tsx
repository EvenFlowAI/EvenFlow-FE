import React from "react";
import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button, Divider, Grid, Switch, Typography} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import {makeStyles} from "@material-ui/core/styles";
import moment from "moment";

const useStyles = makeStyles({
    title: {
        textTransform: "uppercase",
        fontSize: 12,
        marginBottom: 6,
        fontWeight: "bold",
    },
    dividerCol: {
        alignSelf: "stretch"
    },
    row: {
        alignItems: "flex-end",
        marginBottom: 6,
        "&:last-child": {
            marginBottom: 0
        },
    },
    divider: {
        margin: "0 auto !important"
    }
})

const WSForm: React.FC<{}> = props => {
    const classes = useStyles();
    return <Grid container spacing={2} alignItems="stretch">
        <Grid item xs={6}>
            <Grid container>
                <Grid item xs={3} />
                <Grid item xs={9}>
                    <Typography variant="h4" className={classes.title}>
                        Average total technicians by day
                    </Typography>
                </Grid>
            </Grid>
            {moment.weekdays().map(day => <Grid container className={classes.row} key={`l-${day}`}>
                <Grid item xs={3}>
                    <Switch color="primary" />
                </Grid>
                <Grid item xs={9}>
                    <TextField fullWidth label={day} />
                </Grid>
            </Grid>)}
        </Grid>
        <Grid item xs={1} className={classes.dividerCol}>
            <Divider orientation="vertical" className={classes.divider} />
        </Grid>
        <Grid item xs={5}>
               <Typography variant="h4" className={classes.title}>
                   Average level 3 technicians scheduled by day
               </Typography>
                {moment.weekdays().map(day => <div key={`r-${day}`} className={classes.row}>
                    <TextField label={day} hideLabel fullWidth className={classes.row} />
                </div>)}

        </Grid>
    </Grid>
}

export const WeeklySchedule: React.FC<DialogProps> = (props) => {
    return <BaseModal {...props} maxWidth="sm">
        <DialogTitle onClose={props.onClose}>Edit Weekly Schedule</DialogTitle>
        <DialogContent>
            <WSForm />
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>Cancel</Button>
            <Button color="primary" variant="contained" onClick={props.onClose}>Save</Button>
        </DialogActions>
    </BaseModal>;
};
