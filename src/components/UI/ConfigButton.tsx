import {Button, withStyles} from "@material-ui/core";

export const ConfigButton = withStyles(theme => ({
    root: {
        textTransform: "none",
        fontSize: 15,
        padding: "2px 5px",
        marginRight: 8
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