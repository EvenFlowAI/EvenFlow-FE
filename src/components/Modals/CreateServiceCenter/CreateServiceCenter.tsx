import React from "react";
import {AvatarContainer, BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import {States} from "../../../config/constants";
import {Autocomplete} from "@material-ui/lab";
import {TextField} from "../../UI/TextField";
import {Button, Divider, Grid} from "@material-ui/core";


const states = Object.values(States);
const ServiceCenterForm: React.FC = () => {
    return <form>
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <TextField label={"Service center name"} fullWidth />
            </Grid>
            <Grid item xs={6}>
                <TextField label={"Service center email"} fullWidth />
            </Grid>
            <Grid item xs={6}>
                <TextField label={"Service center phone number"} fullWidth />
            </Grid>
            <Grid item xs={6}>
                <TextField label={"Contact person email"} fullWidth />
            </Grid>
        </Grid>
        <Divider />
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <TextField label={"Address"} fullWidth />
            </Grid>
            <Grid item xs={6}>
                <TextField label={"City"} fullWidth />
            </Grid>
            <Grid item xs={6}>
                <Autocomplete
                    options={states}
                    renderInput={params => <div ref={params.InputProps.ref}><TextField {...params.inputProps} label="State"/></div>}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField label="Zip code" />
            </Grid>
        </Grid>
    </form>;
};

export const CreateServiceCenter: React.FC<DialogProps> = props => {
    return <BaseModal {...props} onClose={props.onClose}>
        <DialogTitle onClose={props.onClose}>Add service center</DialogTitle>
        <DialogContent>
            <AvatarContainer />
            <ServiceCenterForm />
        </DialogContent>
        <DialogActions>
            <Button>Cancel</Button>
            <Button color="primary" variant="contained">Create</Button>
        </DialogActions>
    </BaseModal>;
}