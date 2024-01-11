import React from "react";
import {DialogProps} from "../../BaseModal/types";
import {BaseModal, DialogActions, DialogTitle} from "../../BaseModal/BaseModal";
import {Button} from "@mui/material";
import {TechniciansTable} from "../../../../features/admin/TechniciansTable/TechniciansTable";

export const Technicians: React.FC<DialogProps> = props => {
    return <BaseModal {...props}>
        <DialogTitle onClose={props.onClose}>Technicians</DialogTitle>
        <TechniciansTable />
        <DialogActions>
            <Button variant="contained" color="primary" onClick={props.onClose}>Close</Button>
        </DialogActions>
    </BaseModal>
}