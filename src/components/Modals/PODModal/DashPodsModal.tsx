import React from "react";
import {DialogProps, TViewMode} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {ProfilePODs} from "../../Admin/Profile/ProfilePODs";
import {Button} from "@material-ui/core";

export const DashPodsModal: React.FC<DialogProps&TViewMode> = ({payload, onAction, viewMode, ...props}) => {
    return <BaseModal {...props}>
        <DialogTitle onClose={props.onClose}>PODs</DialogTitle>
        <DialogContent>
            <ProfilePODs viewMode={viewMode} dense />
        </DialogContent>
        <DialogActions>
            <Button color="primary" onClick={props.onClose}>Close</Button>
        </DialogActions>
    </BaseModal>
}