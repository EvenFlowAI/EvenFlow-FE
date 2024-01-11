import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles(theme => ({
    container: {
        "& input": {
            backgroundColor: "#fff"
        }
    },
    editButtonContainer: {
        textAlign: "right",
        marginTop: 15,
        [theme.breakpoints.down('sm')]: {
            textAlign: "center"
        }
    },
    title: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: "bold",
        textTransform: "uppercase",
        display: "block"
    },
    centerButton: {
        minWidth: 80
    },
    avatarContainer: {
        display: "flex",
        alignItems: "center",
        [theme.breakpoints.down('md')]: {
            justifyContent: "center",
            marginBottom: theme.spacing(1)
        }
    },
    divider: {
        margin: "30px 0"
    }
}));