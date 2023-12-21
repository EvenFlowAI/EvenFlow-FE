import {makeStyles} from "@material-ui/core/styles";
import {styled} from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
    info: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: "center",
        textAlign: "center",
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    question: {
        marginTop: 20,
        textAlign: "center",
    },
    actionsWrapper: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 30,
        [theme.breakpoints.down('sm')]: {
            padding: '0 20px'
        }
    }
}))

export const ButtonsRow = styled('div')(({theme}) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "22px",
    marginTop: 20,
    "& button": {
        minWidth: 144
    },
    [theme.breakpoints.down('sm')]: {
        flexDirection: "column",
        width: "100%",
        gap: "12px",
        "& button": {
            width: "100%"
        }
    }
}));