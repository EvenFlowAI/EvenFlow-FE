import React from "react";
import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogTitle} from "../BaseModal";
import {Button} from "@material-ui/core";

export const OPsCodesListDialog: React.FC<DialogProps> = ({onAction, payload, ...props}) => {
    return <BaseModal {...props}>
        <DialogTitle onClose={props.onClose}>Select Service Requests</DialogTitle>
        <DialogActions>
            <Button onClick={props.onClose}>
                Close
            </Button>
        </DialogActions>
    </BaseModal>
}