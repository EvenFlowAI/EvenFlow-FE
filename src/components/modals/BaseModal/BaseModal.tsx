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
} from "@material-ui/core";
import {Close} from "@material-ui/icons";
import {DialogProps} from "./types";
import {useStyles} from "./styles";

export const BaseModal: React.FC<DialogProps> = props => {
    const classes = useStyles({maxWidth: props.width || 0});
    return <Dialog maxWidth={"md"} fullWidth {...props} classes={{root: classes.root, paper: classes.dialogPaper}}/>;
}

export const DialogContent: React.FC<DialogContentProps> = props => {
    const classes = useStyles({maxWidth: 0});
    return <DC {...props} className={classes.dialogContent} />
}

export const DialogActions: React.FC<DialogActionsProps> = props => {
    const classes = useStyles({maxWidth: 0});
    return <DA {...props} className={classes.dialogActions} />
}

export const DialogTitle: React.FC<
    DialogTitleProps & {onClose?: () => void}
> = ({children, onClose, ...props}) => {
    const classes = useStyles({maxWidth: 0});
    return <DT {...props} className={classes.dialogTitle}>
        {children}
        {onClose ? <IconButton className={classes.closeButton} onClick={onClose}>
            <Close />
        </IconButton> : null}
    </DT>;
}