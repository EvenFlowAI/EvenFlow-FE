import React from "react";
import {DialogProps, TViewMode} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button} from "@material-ui/core";
import {RequiredEquipment} from "../../Optimizer/CapacitySettings/RequiredEquipment";

export const Bays: React.FC<DialogProps&TViewMode> = props => {
    return <BaseModal {...props} width={700}>
        <DialogTitle onClose={props.onClose}>Bays</DialogTitle>
        <DialogContent>
            <RequiredEquipment viewMode={props.viewMode} />
        </DialogContent>
        <DialogActions>
            <Button color="primary" onClick={props.onClose}>Close</Button>
        </DialogActions>
    </BaseModal>
}