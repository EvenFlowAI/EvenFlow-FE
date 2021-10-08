import React from "react";
import {Button} from "@material-ui/core";
import {DialogProps, TViewMode} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";

export const TransportationOptions: React.FC<DialogProps&TViewMode> = props => {
    return <BaseModal {...props} width={700}>
        <DialogTitle onClose={props.onClose}>Transportation Needs Configuration</DialogTitle>
        <DialogContent>
            {/* TODO content */}
        </DialogContent>
        <DialogActions>
            <Button color="primary" onClick={props.onClose}>Close</Button>
        </DialogActions>
    </BaseModal>
}