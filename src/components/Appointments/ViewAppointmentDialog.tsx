import React from 'react';
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../Modals/BaseModal";
import {Button, CircularProgress} from "@material-ui/core";
import {DialogProps} from "../Modals/types";

export const ViewAppointmentDialog: React.FC<DialogProps> = ({onAction, payload, ...props}) => {
    return <BaseModal {...props}>
        <DialogTitle onClose={props.onClose}>View Appointment</DialogTitle>
        <DialogContent>
            {!payload ? <CircularProgress /> : <>
                View
            </>}
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>
                Close
            </Button>
        </DialogActions>
    </BaseModal>
};