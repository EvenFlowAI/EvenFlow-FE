import React from "react";
import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button} from "@material-ui/core";
import {RequiredEquipment} from "../../Optimizer/CapacitySettings/RequiredEquipment";

export const Bays: React.FC<DialogProps> = props => {
    return <BaseModal {...props} width={700}>
        <DialogTitle onClose={props.onClose}>Bays</DialogTitle>
        <DialogContent>
            <RequiredEquipment />
        </DialogContent>
        <DialogActions>
            <Button color="primary" onClick={props.onClose}>Close</Button>
        </DialogActions>
    </BaseModal>
}