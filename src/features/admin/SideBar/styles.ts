import {makeStyles} from "@material-ui/core/styles";
import {sideBarWidth} from "../../../theme/theme";

export const useStyles = makeStyles(theme => ({
    drawer: {
        flexShrink: 0,
        width: sideBarWidth,
        display: "flex",
        flexFlow: "column",
        position: "relative",
        [theme.breakpoints.down("xs")]: {
            width: "100%",
        }
    },
    link: {
        color: "#fff"
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10
    },
    logo: {
        maxWidth: "80%",
        marginBottom: 60,
        cursor: "pointer",
        transition: theme.transitions.create(['opacity']),
        "&:hover": {
            opacity: .8
        }
    },
    drawerPaper: {
        width: sideBarWidth,
        backgroundColor: "#252525",
        color: "#FFFFFF",
        display: "flex",
        flexFlow: "column",
        padding: "60px 30px",
        alignItems: "center",
        [theme.breakpoints.down("xs")]: {
            width: "100%"
        }
    },
}));