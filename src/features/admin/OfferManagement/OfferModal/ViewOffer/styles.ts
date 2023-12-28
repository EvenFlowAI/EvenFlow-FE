import {FormControlLabel, withStyles} from "@material-ui/core";

export const Label = withStyles({
    root: {
        marginLeft: 0,
    },
    label: {
        fontWeight: "bold"
    }
})(FormControlLabel);