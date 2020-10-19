import React from "react";
import {DialogProps} from "../../Modals/types";
import {BaseModal, DialogActions, DialogTitle} from "../../Modals/BaseModal";
import {Button} from "@material-ui/core";

type TProps = DialogProps & {

}
export const OptimizationDialog: React.FC<TProps> = ({
    onAction,
    payload,
    ...props}) => {
    return <BaseModal {...props}>
        <DialogTitle onClose={props.onClose}></DialogTitle>
        <DialogActions>
            <Button onClick={props.onClose}>Cancel</Button>
            <Button
                color="primary"
                variant="contained"
            >Save</Button>
        </DialogActions>
    </BaseModal>
}