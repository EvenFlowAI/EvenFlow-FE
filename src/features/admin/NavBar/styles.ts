import {makeStyles} from "@material-ui/core/styles";
import {sideBarWidth} from "../../../theme/theme";

export const useStyles = makeStyles(theme => ({
    root: {
        width: `calc(100% - ${sideBarWidth}px)`,
        color: "#858585",
        alignItems: "center",
        backgroundColor: theme.palette.background.paper,
        marginLeft: sideBarWidth,
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        flexDirection: "row",
        justifyContent: "space-between",
        transition: theme.transitions.create(["width"]),
        [theme.breakpoints.down("md")]: {
            transition: theme.transitions.create(["width"]),
            width: "100%",
        }
    },
    openedRoot: {
        [theme.breakpoints.down("md")]: {
            width: `calc(100% - ${sideBarWidth}px)`,
        }
    },
    toolbar: {
        justifyContent: "flex-end"
    },
    name: {
        fontSize: 16,
        marginRight: 10,
        fontWeight: "bold",
        [theme.breakpoints.down("xs")]: {
            display: "none"
        }
    },
    avatar: {
        backgroundColor: theme.palette.primary.dark,
        cursor: "pointer",
    },
    rootAvatar: {
        border: `2px solid ${theme.palette.secondary.main}`
    }
}));