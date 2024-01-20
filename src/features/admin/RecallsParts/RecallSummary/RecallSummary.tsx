import React from "react";
import {DialogProps} from "../../../../components/modals/BaseModal/types";
import {BaseModal, DialogContent, DialogTitle} from "../../../../components/modals/BaseModal/BaseModal";

export const RecallSummary: React.FC<React.PropsWithChildren<DialogProps & {summary: string}>> = ({summary, open, onClose}) => {
    return <BaseModal open={open} onClose={onClose} width={600}>
        <DialogTitle onClose={onClose}>Recall Summary</DialogTitle>
        <DialogContent style={{marginBottom: 20}}>
            {summary}
        </DialogContent>
    </BaseModal>
}