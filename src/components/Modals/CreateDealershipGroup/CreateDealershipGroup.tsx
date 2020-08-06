import React from "react";
import {BaseModal, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import {
    DialogContent,
    DialogActions,
    Typography, Divider, Button
} from "@material-ui/core";


export const CreateDealershipGroup: React.FC<
    DialogProps> = props => {
    return <BaseModal {...props} onClose={props.onClose}>
        <DialogTitle onClose={props.onClose}>New dealership group</DialogTitle>
        <DialogContent>
            <Typography variant="h4">
                Dealership group info
            </Typography>

            <Divider />

            <Typography variant="h4">
                Contact personal info
            </Typography>

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