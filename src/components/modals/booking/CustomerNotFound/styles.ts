import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
    buttonsWrapper: {
        display: 'flex',
        justifyContent: "space-between",
        alignItems: 'center',
        "& > div:first-child": {
            marginRight: 20,
        },
        [theme.breakpoints.down('sm')]: {
            flexDirection: "column",
            "& > div:first-child": {
                marginRight: 0,
                marginBottom: 20,
            }
        },
    },
    wrapper: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 14,
    },
    modalWrapper: {
        padding: "60px 88px 36px 88px",
        [theme.breakpoints.down('sm')]: {
            padding: "16px",
        },
    },
    textWrapper: {
        fontWeight: 600,
        fontSize: 24,
        color: "#202021",
        marginBottom: 24,
        textAlign: "center",
        [theme.breakpoints.down('sm')]: {
            fontSize: 22,
            marginBottom: 16,
        },
    }
}))