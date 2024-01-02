import {makeStyles} from "@material-ui/core/styles";
import {lighten} from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
    listItem: {
        color: "#FFFFFF",
        textTransform: "uppercase",
        fontSize: 14,
        padding: "16px 0",
        lineHeight: "17px",
        fontWeight: "bold",
        transition: theme.transitions.create(['color']),
        "&.active": {
            color: "#7898FF"
        },
        "&:hover": {
            color: lighten("#7898FF", .5)
        }
    },
    subMenu: {
        color: "#929292",
        padding: "10px 0",
        textTransform: "none"
    },
    expandIcon: {
        top: 28,
        right: -30,
        cursor: "pointer",
    },
    listWithSubs: {
        transition: theme.transitions.create(['color']),
        "&.active": {
            color: "#7898FF"
        },
        "&:hover": {
            color: lighten("#7898FF", .5)
        }
    },
    mainListItem: {
        "&.active": {
            color: "#FFFFFF"
        },
    }
}))