import makeStyles from '@mui/styles/makeStyles';
import {Dialog, styled} from "@mui/material";

type TStyleProps = {
    mW: number;
}

export const StyledDialog = styled(Dialog)<TStyleProps>(({theme, mW}) => ({
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
        maxWidth: mW,
    },
}))

export const useStyles = makeStyles({
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
        padding: "10px 25px 25px"
    },
    closeButton: {
        position: "absolute",
        top: 0,
        right: 0,
    },
});