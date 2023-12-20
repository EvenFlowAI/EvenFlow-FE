import {FormControlLabel, withStyles} from "@material-ui/core";

export const Label = withStyles({
    label: {
        fontWeight: "bold",
        color: '#7898FF',
        textTransform: 'uppercase',
        fontSize: 14,
    }
})(FormControlLabel);