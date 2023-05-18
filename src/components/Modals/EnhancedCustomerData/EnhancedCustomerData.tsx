import React from 'react';
import {DialogProps} from "../types";
import {BaseModal} from "../BaseModal";

const EnhancedCustomerData: React.FC<DialogProps> = ({open, onClose}) => {
    const onCancel = () => {
        onClose();
    }
    return (
        <BaseModal open={open} width={700} onClose={onCancel}>
        </BaseModal>
    );
};

export default EnhancedCustomerData;