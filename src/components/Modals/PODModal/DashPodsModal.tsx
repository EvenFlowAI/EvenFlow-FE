import React from "react";
import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {ProfilePODs} from "../../Admin/Profile/ProfilePODs";
import {Button} from "@material-ui/core";

export const DashPodsModal: React.FC<DialogProps> = ({payload, onAction, ...props}) => {
    return <BaseModal {...props}>
        <DialogTitle onClose={props.onClose}>PODs</DialogTitle>
        <DialogContent>
            <ProfilePODs dense />
        </DialogContent>
        <DialogActions>
            <Button color="primary" onClick={props.onClose}>Close</Button>
        </DialogActions>
    </BaseModal>
}