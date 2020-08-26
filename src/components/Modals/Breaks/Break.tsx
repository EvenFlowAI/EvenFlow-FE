import React from "react";
import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button, Grid, IconButton} from "@material-ui/core";
import {TextField} from "../../UI/TextField";
import {DeleteOutline} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import moment from "moment";

const useStyles = makeStyles({
    button: {
        marginBottom: 3
    },
    text: {
        textAlign: "center",
        marginBottom: 10
    },
    container: {
        marginBottom: 12,
        "&:last-child": {
            marginBottom: 0
        }
    }
});

const BForm: React.FC<{}> = props => {
    const classes = useStyles();
    return <div>
        {moment.weekdays().map(d =>
            <Grid container className={classes.container} alignItems="flex-end" key={d}>
                <Grid item xs={3}>
                    <Button fullWidth className={classes.button} variant="contained" color="primary">Add Break</Button>
                </Grid>
                <Grid item xs={1} />
                <Grid item xs={3}>
                    <TextField
                        label={d}
                        fullWidth
                        id={`${d}Start`}
                        name={`${d}Start`}
                    />
                </Grid>
                <Grid item xs={1} className={classes.text}>to</Grid>
                <Grid item xs={3}>
                    <TextField
                        label="Monday"
                        fullWidth
                        hideLabel
                        id={`${d}End`}
                        name={`${d}End`}
                    />
                </Grid>
                <Grid item xs={1}>
                    <IconButton color="primary"><DeleteOutline /></IconButton>
                </Grid>
            </Grid>
        )}
    </div>;
}

export const Break: React.FC<DialogProps> = props => {
    return <BaseModal {...props} width={780}>
        <DialogTitle onClose={props.onClose}>Edit Breaks</DialogTitle>
        <DialogContent><BForm /></DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={props.onClose}>Save</Button>
        </DialogActions>
    </BaseModal>;
}