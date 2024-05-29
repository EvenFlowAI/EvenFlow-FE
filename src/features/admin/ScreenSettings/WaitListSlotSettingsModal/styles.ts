import {makeStyles, withStyles} from 'tss-react/mui';
import {FormControlLabel} from "@mui/material";

export const useStyles = makeStyles()(() => ({
    inputWrapper: {
        marginBottom: 24
    },
    cancelButton: {
        color: '#9FA2B4'
    },
}));

export const SwitcherLabel = withStyles(FormControlLabel, {
    root: {
        justifyContent: "flex-end",
        marginLeft: 0,
        marginRight: 0,
        justifySelf: 'flex-end'
    },
    label: {
        fontWeight: "bold",
        fontSize: 14,
        textTransform: "uppercase",
    }
});