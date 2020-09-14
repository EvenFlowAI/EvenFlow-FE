import React from "react";
import {DialogProps} from "../types";
import {IAssignedServiceRequest} from "../../../store/reducers/serviceRequests/types";
import {BaseModal, DialogActions, DialogTitle} from "../BaseModal";
import {Button} from "@material-ui/core";

export const OverrideOPsCodeDialog: React.FC<DialogProps<IAssignedServiceRequest>> = ({onAction, payload, ...props}) => {
    return <BaseModal {...props}>
        <DialogTitle onClose={props.onClose}>Edit Service Request</DialogTitle>
        <DialogActions>
            <Button onClick={props.onClose}>Cancel</Button>
        </DialogActions>
    </BaseModal>
}