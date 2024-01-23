import React from "react";
import {
    Dialog,
    DialogActions as DA,
    DialogActionsProps,
    DialogContent as DC,
    DialogContentProps,
    DialogTitle as DT,
    DialogTitleProps,
    IconButton
} from "@mui/material";
import {Close} from "@mui/icons-material";
import {DialogProps} from "./types";
import {useStyles} from "./styles";

export const BaseModal: React.FC<React.PropsWithChildren<React.PropsWithChildren<DialogProps>>> = props => {
    const classes = useStyles({maxWidth: props.width || 0});
    return <Dialog maxWidth={"md"} fullWidth {...props} classes={{root: classes.root, paper: classes.dialogPaper}}/>;
}

export const DialogContent: React.FC<React.PropsWithChildren<React.PropsWithChildren<DialogContentProps>>> = props => {
    const classes = useStyles({maxWidth: 0});
    return <DC {...props} className={classes.dialogContent} />
}

export const DialogActions: React.FC<React.PropsWithChildren<React.PropsWithChildren<DialogActionsProps>>> = props => {
    const classes = useStyles({maxWidth: 0});
    return <DA {...props} className={classes.dialogActions} />
}

export const DialogTitle: React.FC<React.PropsWithChildren<React.PropsWithChildren<DialogTitleProps & {onClose?: () => void}>>> = ({children, onClose, ...props}) => {
    const classes = useStyles({maxWidth: 0});
    return (
        <DT {...props} className={classes.dialogTitle}>
            {children}
            {onClose ? <IconButton className={classes.closeButton} onClick={onClose} size="large">
                <Close />
            </IconButton> : null}
        </DT>
    );
}