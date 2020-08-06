import React from "react";
import {Dialog, DialogTitle as DT, DialogProps, DialogTitleProps, IconButton, /*withStyles*/} from "@material-ui/core";
import {Close} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
// import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    root: {

    },
    dialogTitle: {
        textAlign: "center",
        "&> h2": {
            fontSize: 19,
            fontWeight: "bold"
        }
    },
    closeButton: {
        position: "absolute",
        top: 0,
        right: 0
    }
});


export const BaseModal: React.FC<DialogProps> = props => {
    const classes = useStyles();
    return <Dialog {...props} className={classes.root} />;
}

export const DialogTitle: React.FC<
    DialogTitleProps & {onClose?: () => void}
> = ({children, onClose, ...props}) => {
    const classes = useStyles();
    return <DT {...props} className={classes.dialogTitle}>
        {children}
        {onClose ? <IconButton className={classes.closeButton} onClick={onClose}>
            <Close />
        </IconButton> : null}
    </DT>;
}
