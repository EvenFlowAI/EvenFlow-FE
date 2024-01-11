import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => ({
    wrapper: {
        display: "flex",
        flexFlow: "row no-wrap",
        alignItems: "center"
    },
    info: {
        flexGrow: 1,
        paddingLeft: 26
    },
    name: {
        fontSize: 15,
        lineHeight: "20px",
        fontWeight: "normal",
        margin: 0,
        [theme.breakpoints.down("xs")]: {
            fontSize: 12
        }
    },
    subtitle: {
        fontSize: 11,
        color: "#9FA2B4",
        [theme.breakpoints.down("xs")]: {
            fontSize: 9
        }
    }
}));