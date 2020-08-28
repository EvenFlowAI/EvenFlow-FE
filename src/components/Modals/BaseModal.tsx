import React from "react";
import {
    Dialog,
    DialogTitle as DT,
    DialogContent as DC,
    DialogActions as DA,
    DialogTitleProps,
    IconButton,
    Typography,
    DialogContentProps, DialogActionsProps, Container
} from "@material-ui/core";
import {Close} from "@material-ui/icons";
import {DialogProps} from "./types";
import {makeStyles} from "@material-ui/core/styles";
import {AvatarUpload, TAvatarProps} from "../UI/AvatarUpload";

const useStyles = makeStyles({
    root: {
        "& hr": {
            margin: "28px 0",
        },
        "& input": {
            padding: 11,
            fontSize: 14
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
    dialogPaper: (maxWidth: number) => {
        return maxWidth ? {maxWidth} : {};
    },
    dialogActions: {
        padding: "10px 25px 25px"
    },
    dialogContentTitle: {
        fontSize: 19,
        lineHeight: "16px",
        fontWeight: "bold",
        marginBottom: 22
    },
    closeButton: {
        position: "absolute",
        top: 0,
        right: 0
    },
    avatarWrapper: {
        display: "flex",
        justifyContent: "center",
        marginBottom: 38
    }
});


export const BaseModal: React.FC<DialogProps> = props => {
    const classes = useStyles(props.width || 0);
    return <Dialog maxWidth={"md"} fullWidth {...props} classes={{root: classes.root, paper: classes.dialogPaper}} />;
}

export const DialogContent: React.FC<DialogContentProps> = props => {
    const classes = useStyles(0);
    return <DC {...props} className={classes.dialogContent} />
}

export const DialogActions: React.FC<DialogActionsProps> = props => {
    const classes = useStyles(0);
    return <DA {...props} className={classes.dialogActions} />
}

export const DialogTitle: React.FC<
    DialogTitleProps & {onClose?: () => void}
> = ({children, onClose, ...props}) => {
    const classes = useStyles(0);
    return <DT {...props} className={classes.dialogTitle}>
        {children}
        {onClose ? <IconButton className={classes.closeButton} onClick={onClose}>
            <Close />
        </IconButton> : null}
    </DT>;
}


export const DialogContentTitle: React.FC<{title: string}> = props => {
    const classes = useStyles(0);
    return <Typography
        className={classes.dialogContentTitle}
        variant="h4">
        {props.title}
    </Typography>;
}

export const AvatarContainer: React.FC<TAvatarProps> = (props) => {
    const classes = useStyles(0);
    return <Container className={classes.avatarWrapper}>
        <AvatarUpload {...props} />
    </Container>
}
