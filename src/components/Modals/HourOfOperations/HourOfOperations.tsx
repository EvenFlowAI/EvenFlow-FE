import React from "react";
import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button, Grid, Switch} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import moment from "moment";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles({
    row: {
        marginBottom: 16
    },
    toWrapper: {
        padding: "12px 0",
        textAlign: "center",
        display: "block"
    },
    switchRow: {
        textAlign: "right"
    }
})

const HOOForm: React.FC<{
}> = props => {
    const classes = useStyles();
    return <>{moment.weekdays().map((day, idx) =>
        <Grid container spacing={1} alignItems="flex-end" key={day} className={classes.row}>
            <Grid item xs={2} className={classes.switchRow}><Switch color="primary"/></Grid>
            <Grid item xs={3}>
                <TextField
                    fullWidth
                    label={day}
                    id={`from-${day}`}
                />
            </Grid>
            <Grid item xs={1}>
                <span className={classes.toWrapper}>to</span>
            </Grid>
            <Grid item xs={3}>
                <TextField
                    fullWidth
                    id={`to-${day}`}
                />
            </Grid>
            <Grid item xs={3}>
                {!idx ? <Button>
                    Apply to all
                </Button> : null}
            </Grid>
        </Grid>
    )}
    </>
}
export const HourOfOperations: React.FC<DialogProps> = props => {
    return <BaseModal {...props} maxWidth="sm">
        <DialogTitle>Edit Hours of Operations</DialogTitle>
        <DialogContent>
            <HOOForm />
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={props.onClose}>Save</Button>
        </DialogActions>
    </BaseModal>
}