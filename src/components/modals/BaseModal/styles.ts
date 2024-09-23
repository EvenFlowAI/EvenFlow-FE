import { makeStyles } from 'tss-react/mui';
import {Dialog, styled} from "@mui/material";

type TStyleProps = {
    mW: number|undefined;
}

export const StyledDialog = styled(Dialog, {
    shouldForwardProp: (prop) => prop !== "mW"
})<TStyleProps>(({theme, mW}) => ({
    '& .MuiDialogContent-root': {
        "& hr": {
            margin: "28px 0",
        },
        "& input": {
            padding: 9,
            fontSize: 14
        },
    },
    "& .MuiDialog-paper": {
        maxWidth: mW ?? '',
        [theme.breakpoints.down("mdl")]: {
            margin: '36px 10px',
            width: 'calc(100% - 20px)'
        }
    },
}))

export const useStyles = makeStyles()((theme) => ({
    dialogTitle: {
        textAlign: "center",
        fontSize: 19,
        fontWeight: "bold",
        marginTop: 10,
        "&> h2": {

        }
    },
    dialogContent: {
        padding: "10px 25px"
    },
    dialogActions: {
        padding: "10px 25px 25px",
        [theme.breakpoints.down('mdl')]: {
            justifyContent: 'space-around',
            padding: '16px !important',
        }
    },
    closeButton: {
        position: "absolute",
        top: 0,
        right: 0,
    },
}));