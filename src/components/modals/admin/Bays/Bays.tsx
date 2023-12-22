import React from "react";
import {DialogProps, TViewMode} from "../../BaseModal/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../BaseModal/BaseModal";
import {Button} from "@material-ui/core";
import {RequiredEquipment} from "../../../../features/admin/RequiredEquipment/RequiredEquipment";

export const Bays: React.FC<DialogProps&TViewMode> = ({viewMode, ...props}) => {
    return <BaseModal {...props} width={700}>
        <DialogTitle onClose={props.onClose}>Bays</DialogTitle>
        <DialogContent>
            <RequiredEquipment viewMode={viewMode} />
        </DialogContent>
        <DialogActions>
            <Button color="primary" onClick={props.onClose}>Close</Button>
        </DialogActions>
    </BaseModal>
}