import React, {useState} from 'react';
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {BaseModal, DialogActions, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";
import {Button} from "@mui/material";
import {Api} from "../../../../api/ApiEndpoints/ApiEndpoints";
import {useException} from "../../../../hooks/useException/useException";
import {useMessage} from "../../../../hooks/useMessage/useMessage";
import {Loading} from "../../../../components/wrappers/Loading/Loading";

type TProps = DialogProps & {
    employeeName?: string;
    employeeEmail?: string;
    employeeId?: string;
}

const ResendEmailModal: React.FC<TProps> = ({employeeId, employeeName, employeeEmail, open, onClose}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const showError = useException();
    const showMessage = useMessage();

    const onResend = () => {
        if (employeeId) {
            setLoading(true)
            Api.call(Api.endpoints.Accounts.ResendEmail, {data: {userId: employeeId}})
                .then(() => {
                    showMessage('Email sent')
                    onClose();
                }).catch(err => showError(err)
            ).finally(() => setLoading(false))
        }
    }

    return (
        <BaseModal width={400} open={open} onClose={onClose}>
            <DialogTitle onClose={onClose} style={{textAlign: "left"}}>Account Activation Email</DialogTitle>
            <DialogContent style={{fontSize: 16, paddingTop: 8}}>
                {loading
                    ? <Loading/>
                    : <>
                        Please confirm resending
                        <br/>
                        the account activation email for
                        <br/>
                        <br/>
                        {employeeName ?? ''}
                        <br/>
                        {employeeEmail ?? ''}
                    </>}
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