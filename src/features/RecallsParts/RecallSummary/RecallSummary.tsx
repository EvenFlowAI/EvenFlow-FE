import React from "react";
import {DialogProps} from "../../../components/BaseModal/types";
import {BaseModal, DialogContent, DialogTitle} from "../../../components/BaseModal/BaseModal";

export const RecallSummary: React.FC<DialogProps & {summary: string}> = ({summary, open, onClose}) => {
    return <BaseModal open={open} onClose={onClose} width={600}>
        <DialogTitle onClose={onClose}>Recall Summary</DialogTitle>
        <DialogContent style={{marginBottom: 20}}>
            {summary}
        </DialogContent>
    </BaseModal>
}