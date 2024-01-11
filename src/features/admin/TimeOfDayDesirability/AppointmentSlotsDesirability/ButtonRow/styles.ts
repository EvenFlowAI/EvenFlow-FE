import {makeStyles} from "@material-ui/core/styles";

export const useStylesBR = makeStyles(theme => ({
    dataRow: {
        marginTop: 6,
        alignItems: "center"
    },
    time: {
        fontWeight: "bold",
        [theme.breakpoints.down("xs")]: {
            fontSize: 11
        }
    },
    buttons: {
        textAlign: "right",
        [theme.breakpoints.down("xs")]: {
            textAlign: "left",
            marginBottom: theme.spacing(1),
            display: "flex",
            flexFlow: "row nowrap",
            "&>button": {
                flexGrow: 1,
                flexBasis: 0
            }
        }
    }
}));