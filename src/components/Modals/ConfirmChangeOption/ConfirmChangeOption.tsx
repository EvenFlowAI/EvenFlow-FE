import React from 'react';
import {BaseModal, DialogTitle, DialogActions} from "../BaseModal";
import {LoadingButton} from "../../UI/Button";
import {DialogProps} from "../types";

type TConfirmProps = DialogProps & {
    onSave: () => void;
}

const ConfirmChangeOption: React.FC<TConfirmProps> = (props) => {
    return (
        <BaseModal
            width={400}
            open={props.open}
            onClose={props.onClose}
        >
            <DialogTitle onClose={props.onClose}>
                Do you want to change the selected Package Option?
            </DialogTitle>
            <DialogActions>
                    <LoadingButton
                        loading={false}
                        onClick={props.onClose}
                        variant="outlined"
                        color="primary">
                        No
                    </LoadingButton>
                    <LoadingButton
                        loading={false}
                        onClick={props.onSave}
                        color="primary"
                        variant="contained">
                        Yes
                    </LoadingButton>
            </DialogActions>
        </BaseModal>
    );
};

export default ConfirmChangeOption;