import React from "react";
import {Button, CircularProgress} from "@mui/material";

type TSaveEditProps = {
    onSave: () => void;
    onEdit: () => void;
    onCancel: () => void;
    isEdit: boolean;
    isSaving: boolean;
    isLowerCase?:boolean;
}

export const SaveEditBlock: React.FC<React.PropsWithChildren<TSaveEditProps>> = ({isEdit, isSaving, onEdit, onCancel, onSave, isLowerCase}) => {
    if (!isEdit) {
        return <Button
            onClick={onEdit}
            color='primary'
            style={{textTransform: isLowerCase ? "none" : "uppercase"}}
        >
            Edit
        </Button>
    } else if (isSaving) {
        return <CircularProgress />
    }
    return <>
        <Button
            onClick={onCancel}
            color="secondary"
            style={{textTransform: isLowerCase ? "none" : "uppercase"}}
        >
            Cancel
        </Button>
        <Button
            onClick={onSave}
            style={{textTransform: isLowerCase ? "none" : "uppercase"}}
            color="primary"
        >
            Save
        </Button>
    </>
}