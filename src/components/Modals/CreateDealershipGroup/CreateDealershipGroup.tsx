import React from "react";
import {
    BaseModal,
    DialogContent,
    DialogContentTitle,
    DialogTitle,
    DialogActions
} from "../BaseModal";
import {DialogProps} from "../types";
import {
    Divider, Button, Grid
} from "@material-ui/core";
import {TextField} from "../../UI/TextField";


export const CreateDealershipGroup: React.FC<
    DialogProps> = props => {
    return <BaseModal {...props} onClose={props.onClose}>
        <DialogTitle onClose={props.onClose}>New dealership group</DialogTitle>
        <DialogContent>
            <DialogContentTitle
                title="Dealership group info"
            />
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField
                        label="Dealership group name"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Dealership email"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Phone"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Address"
                        fullWidth
                    />
                </Grid>
            </Grid>

            <Divider />

            <DialogContentTitle title="Contact personal info" />

            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField
                        label="Contact person name"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Contact person phone"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Contact person email"
                        fullWidth
                    />
                </Grid>
            </Grid>

        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>Cancel</Button>
            <Button
                color="primary"
                variant="contained">
                Create
            </Button>
        </DialogActions>
    </BaseModal>;
}