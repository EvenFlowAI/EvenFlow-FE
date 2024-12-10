import React from 'react';
import {DialogTitle, DialogContent, BaseModal} from "../../../../components/modals/BaseModal/BaseModal";
import {DialogProps} from "../../../../components/modals/BaseModal/types";

const MakesOptionsModal: React.FC<DialogProps> = (props) => {
    const onCancel = () => {
        props.onClose()
    }
    return (
        <BaseModal {...props} width={540} onClose={onCancel}>
            <DialogTitle onClose={onCancel}>Makes Options</DialogTitle>
            <DialogContent>
            </DialogContent>
        </BaseModal>
    );
};

export default MakesOptionsModal;