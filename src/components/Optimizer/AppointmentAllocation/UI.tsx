import React from "react";
import {AppointmentTable} from "../AppointmentValue/UI";
import {TableRow as TR, TableCell as TC, withStyles, Button, CircularProgress} from "@material-ui/core";

export const DemandTable = withStyles(theme => ({
    root: {
        border: `1px solid ${theme.palette.divider}`
    }
}))(AppointmentTable);

export const TableCell = withStyles({
    root: {
        border: "none !important",
        padding: "12px 16px !important",
        textAlign: "center",
    }
})(TC);
export const TableRow = withStyles(theme => ({
    root: {
        "&:nth-child(2n) .MuiTableCell-root": {
            backgroundColor: "#F2F3F7"
        },
        "& .MuiButton-root": {
            textTransform: "none",
            fontSize: 14
        },
        "&.MuiTableRow-head": {
            borderBottom: `1px solid ${theme.palette.divider}`
        }
    }
}))(TR);

type TSaveEditProps = {
    onSave: () => void;
    onEdit: () => void;
    onCancel: () => void;
    isEdit: boolean;
    isSaving: boolean;
}
export const SaveEditBlock: React.FC<TSaveEditProps> = ({isEdit, isSaving, onEdit, onCancel, onSave}) => {
    if (!isEdit) {
        return <Button
            onClick={onEdit}
            color='primary'>
            Edit
        </Button>
    } else if (isSaving) {
        return <CircularProgress />
    }
    return <>
        <Button
            onClick={onSave}
            color="primary"
        >
            Save
        </Button>
        <Button
            onClick={onCancel}
            color="secondary"
        >
            Cancel
        </Button>
    </>

}