import {Button, withStyles} from "@material-ui/core";

export const ConfigButton = withStyles(theme => ({
    root: {
        textTransform: "none",
        fontSize: 15,
        padding: "2px 5px",
        margin: 4
    },
    contained: {
        "&:not(.MuiButton-containedPrimary)": {
            background: "#fff",
            boxShadow: theme.shadows[3]
        },
        "&.MuiButton-containedPrimary:hover": {
            boxShadow: "none"
        }
    }
}))(Button);

export const DesirabilityButton = withStyles(theme => ({
    root: {
        textTransform: "none",
        fontSize: 9,
        fontWeight: "normal",
        padding: 4,
        minWidth: 60,
        marginRight: 8,
        "&:last-child": {
            marginRight: 0
        }
    },
    contained: {
        "&:not(.MuiButton-containedPrimary)": {
            background: "#fff",
            boxShadow: theme.shadows[3]
        },
        "&.MuiButton-containedPrimary:hover": {
            boxShadow: "none"
        }
    }
}))(Button);