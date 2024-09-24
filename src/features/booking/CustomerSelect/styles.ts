import { makeStyles } from 'tss-react/mui';
import {mh400, mh600} from "./constants";

export const useStyles = makeStyles()(theme => ({
    buttonsContainer: {
        marginTop: "5%",
        marginBottom: 20,
        justifyContent: "center",
        [mh600]: {
            marginTop: "2%"
        },
        [theme.breakpoints.down('md')]: {
            marginTop: theme.spacing(5),
        },
        [theme.breakpoints.down('mdl')]: {
            marginLeft: 0,
        }
    },
    existing: {
        position: "relative",
        fontWeight: "bold",
        fontSize: 32,
        padding: "32px 28px",
        height: "100%",
        textAlign: "center",
        border: "1px solid #DADADA",
        background: "#FFFFFF",
        transition: theme.transitions.create(["box-shadow"]),
        "&:hover": {
            boxShadow: "0 2px 8px rgba(0,0,0,.1)"
        },
        [mh600]: {
            fontSize: 22,
            padding: "7%"
        },
        [mh400]: {
            fontSize: 18,
            padding: "2%"
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: 18,
            padding: "5%"
        },
    },
    button: {
        height: "100%",
        maxHeight: 400,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        fontWeight: "bold",
        fontSize: 32,
        textAlign: "center",
        padding: "7% 7% 9% 7%",
        border: "1px solid #DADADA",
        background: "#FFFFFF",
        transition: theme.transitions.create(["box-shadow"]),
        "&:hover": {
            boxShadow: "0 2px 8px rgba(0,0,0,.1)"
        },
        [mh600]: {
            fontSize: 22,
            padding: "7%"
        },
        [mh400]: {
            fontSize: 18,
            padding: "2%"
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: 18,
            padding: "5%"
        }
    },
    loadingButton: {
        minWidth: 144,
        [theme.breakpoints.down('sm')]: {
            width: "100%",
            "&:last-child": {
                order: -1,
                marginBottom: theme.spacing(2)
            }
        }
    },
    submitButton: {
        minWidth: 144,
        [theme.breakpoints.down('sm')]: {
            width: "100%",
            "&:last-child": {
                marginBottom: theme.spacing(2),
                marginTop: theme.spacing(2),
            }
        }
    },
    searchButton: {
        textTransform: 'none',
        textDecoration: 'underline',
        fontSize: 14,
        fontWeight: 600,
        color: "#202021",
        textDecorationColor: "#DADADA",
    },
    searchLinkWrapper: {
        position: "absolute",
        right: '31%',
        bottom: 0,
        [theme.breakpoints.down('sm')]: {
            right: '22%',
        }
    },
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
}));