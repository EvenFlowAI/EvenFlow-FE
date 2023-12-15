import React from "react";
import {DialogProps, TViewMode} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {PodsTable} from "../../PodsTable/PodsTable";
import {Button} from "@material-ui/core";

export const DashPodsModal: React.FC<DialogProps&TViewMode> = ({payload, onAction, viewMode, ...props}) => {
    return <BaseModal {...props}>
        <DialogTitle onClose={props.onClose}>PODs</DialogTitle>
        <DialogContent>
            <PodsTable viewMode={viewMode} dense />
        </DialogContent>
        <DialogActions>
            <Button color="primary" onClick={props.onClose}>Close</Button>
        </DialogActions>
    </BaseModal>
}