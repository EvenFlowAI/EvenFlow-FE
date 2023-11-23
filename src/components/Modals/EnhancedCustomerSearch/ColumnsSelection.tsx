import React, {Dispatch, SetStateAction} from 'react';
import {BaseModal, DialogContent, DialogTitle} from "../BaseModal";
import {DialogProps} from "../types";
import {TColumn} from "./CustomerSearchResults";

type TProps = {
    selectedColumns: TColumn[];
    setSelectedColumns: Dispatch<SetStateAction<TColumn[]>>;
}

const ColumnsSelection: React.FC<DialogProps&TProps> = ({onClose, open, selectedColumns, setSelectedColumns}) => {
    return (
        <BaseModal onClose={onClose} open={open}>
            <DialogTitle>Select columns to display:</DialogTitle>
            <DialogContent>

            </DialogContent>

        </BaseModal>
    );
};

export default ColumnsSelection;