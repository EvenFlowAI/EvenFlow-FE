import React from 'react';
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {Button} from "@mui/material";
import {useSCs} from "../../../../hooks/useSCs/useSCs";

type TProps = DialogProps & {
    employeeName?: string;
    employeeEmail?: string;
}

const ResendEmailModal: React.FC<TProps> = ({employeeName, employeeEmail, open, onClose}) => {
    const {selectedSC } = useSCs()

    const onResend = () => {
        if (selectedSC) {
            // todo request
        }
    }

    return (
        <BaseModal width={400} open={open} onClose={onClose}>
            <DialogTitle onClose={onClose} style={{textAlign: "left"}}>Account Activation Email</DialogTitle>
            <DialogContent style={{fontSize: 16, paddingTop: 8}}>
                Please confirm resending
                <br/>
                the account activation email for
                <br/>
                <br/>
                {employeeName ?? ''}
                <br/>
                {employeeEmail ?? ''}
            </DialogContent>
            <DialogActions>
                <Button variant="text" color="info" onClick={onClose} style={{marginRight: 12}}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={onResend}>
                    Confirm
                </Button>
            </DialogActions>
        </BaseModal>
    );
};

export default ResendEmailModal;