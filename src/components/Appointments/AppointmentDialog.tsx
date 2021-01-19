import React, {useState} from 'react';
import {DialogProps} from "../Modals/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../Modals/BaseModal";
import {IListAppointment} from "../../api/types";
import {Button} from "@material-ui/core";
import {LoadingButton} from "../UI/Button";

export const AppointmentDialog: React.FC<DialogProps<IListAppointment>> = ({onAction, payload, ...props}) => {
    const [loading, setLoading] = useState<boolean>(false);
    return <BaseModal {...props}>
        <DialogTitle onClose={props.onClose}>{!payload ? "Add" : "Update"} Appointment</DialogTitle>
        <DialogContent>
            Content
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onClose}>
                Close
            </Button>
            <LoadingButton
                loading={loading}
            >
                Save
            </LoadingButton>
        </DialogActions>
    </BaseModal>
};