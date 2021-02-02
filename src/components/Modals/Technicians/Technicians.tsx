import React from "react";
import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogTitle} from "../BaseModal";
import {Button} from "@material-ui/core";
import {TechniciansList} from "../../Optimizer/Technicians/TechniciansList";

export const Technicians: React.FC<DialogProps> = props => {
    return <BaseModal {...props}>
        <DialogTitle onClose={props.onClose}>Technician Staff</DialogTitle>
        <TechniciansList />
        <DialogActions>
            <Button variant="contained" color="primary" onClick={props.onClose}>Close</Button>
        </DialogActions>
    </BaseModal>
}