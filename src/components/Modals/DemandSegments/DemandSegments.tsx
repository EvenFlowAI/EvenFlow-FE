import React from "react";
import {DialogProps} from "../types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../BaseModal";
import {Button} from "@material-ui/core";

export const DemandSegments: React.FC<DialogProps> = ({onAction, payload, ...props}) => {
    const handleAddSegment = () => {

    }
    return <BaseModal {...props}>
        <DialogTitle onClose={props.onClose}>Demand segments settings</DialogTitle>
        <DialogContent>
            <div style={{textAlign: "right"}}>
                <Button variant="contained" color="primary" onClick={handleAddSegment}>
                    Add New Segment
                </Button>
            </div>
        </DialogContent>
        <DialogActions>
            <Button
                onClick={props.onClose}
                variant="contained"
                color="primary">
                Close
            </Button>
        </DialogActions>
    </BaseModal>
}