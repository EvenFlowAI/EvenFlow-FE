import { Button } from "@mui/material";

import withStyles from '@mui/styles/withStyles';

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