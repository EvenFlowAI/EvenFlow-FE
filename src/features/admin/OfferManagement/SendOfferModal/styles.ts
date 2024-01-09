import {FormLabel, withStyles} from "@material-ui/core";

export const Label = withStyles(theme => ({
    root: {
        textTransform: "uppercase",
        fontSize: 12,
        fontWeight: "bold",
        color: theme.palette.text.primary
    }
}))(FormLabel);