import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => ({
    mainWrapper: {
        marginTop: 48
    },
    btnWrapper: {
        display: "flex",
        justifyContent: 'flex-end',
        marginBottom: 20
    },
    wrapper: {
        display: 'grid',
        gridTemplateColumns: "1fr 1fr 1fr",
        gridGap: 20,
        [theme.breakpoints.down("sm")]: {
            gridTemplateColumns: "1fr 1fr",
            marginBottom: 20,
        },
        [theme.breakpoints.down("xs")]: {
            gridTemplateColumns: "1fr",
        }
    },
    card: {
        display: 'flex',
        flexDirection: "column",
        justifyContent: 'space-between',
        alignItems: "center",
        padding: 24,
        border: '1px solid #DADADA',
    },
    button: {
        background: "#202021",
        color: "white",
    },
    text: {
        fontSize: 24,
        fontWeight: 700,
        textAlign: 'center',
        marginBottom: 20,
    },
    linkBtn: {
        fontSize: 20,
        fontWeight: 700,
        color: "#142EA1",
        textTransform: 'none',
        textDecoration: 'none',
    }
}));