import React from "react";
import {
    Dialog,
    DialogTitle as DT,
    DialogContent as DC,
    DialogProps,
    DialogTitleProps,
    IconButton,
    Typography,
    DialogContentProps
} from "@material-ui/core";
import {Close} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    root: {
        "& hr": {
            margin: "28px 0"
        }
    },
    dialogTitle: {
        textAlign: "center",
        "&> h2": {
            fontSize: 19,
            fontWeight: "bold"
        }
    },
    dialogContent: {
        padding: "10px 48px"
    },
    dialogContentTitle: {
        fontSize: 19,
        fontWeight: "bold",
        marginBottom: 20
    },
    closeButton: {
        position: "absolute",
        top: 0,
        right: 0
    }
});


export const BaseModal: React.FC<DialogProps> = props => {
    const classes = useStyles();
    return <Dialog {...props} className={classes.root} maxWidth={"md"} />;
}

export const DialogContent: React.FC<DialogContentProps> = props => {
    const classes = useStyles();
    return <DC {...props} className={classes.dialogContent} />
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


export const DialogContentTitle: React.FC<{title: string}> = props => {
    const classes = useStyles();
    return <Typography
        className={classes.dialogContentTitle}
        variant="h4">
        {props.title}
    </Typography>;
}
