import React from "react";
import {
    Dialog,
    DialogTitle as DT,
    DialogContent as DC,
    DialogActions as DA,
    DialogProps,
    DialogTitleProps,
    IconButton,
    Typography,
    DialogContentProps, DialogActionsProps, Container
} from "@material-ui/core";
import {Close} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import {AvatarUpload} from "../UI/AvatarUpload";

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
    dialogActions: {
        padding: "10px 48px 36px"
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
    const classes = useStyles();
    return <Dialog {...props} className={classes.root} maxWidth={"md"} />;
}

export const DialogContent: React.FC<DialogContentProps> = props => {
    const classes = useStyles();
    return <DC {...props} className={classes.dialogContent} />
}

export const DialogActions: React.FC<DialogActionsProps> = props => {
    const classes = useStyles();
    return <DA {...props} className={classes.dialogActions} />
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

export const AvatarContainer: React.FC = () => {
    const classes = useStyles();
    return <Container className={classes.avatarWrapper}>
        <AvatarUpload />
    </Container>
}
