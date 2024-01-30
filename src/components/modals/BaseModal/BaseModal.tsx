import React from "react";
import {
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
import {StyledDialog, useStyles} from "./styles";

export const BaseModal: React.FC<React.PropsWithChildren<React.PropsWithChildren<DialogProps>>> = props => {
    return <StyledDialog maxWidth={"md"} fullWidth {...props} mW={props.width}/>;
}

export const DialogContent: React.FC<React.PropsWithChildren<React.PropsWithChildren<DialogContentProps>>> = props => {
    const classes = useStyles();
    return <DC {...props} className={classes.dialogContent} />
}

export const DialogActions: React.FC<React.PropsWithChildren<React.PropsWithChildren<DialogActionsProps>>> = props => {
    const classes = useStyles();
    return <DA {...props} className={classes.dialogActions} />
}

export const DialogTitle: React.FC<React.PropsWithChildren<React.PropsWithChildren<DialogTitleProps & {onClose?: () => void}>>> = ({children, onClose, ...props}) => {
    const classes = useStyles();
    return (
        <DT {...props} className={classes.dialogTitle}>
            {children}
            {onClose ? <IconButton className={classes.closeButton} onClick={onClose} size="large">
                <Close />
            </IconButton> : null}
        </DT>
    );
}