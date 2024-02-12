import { Button } from "@mui/material";

import { withStyles } from 'tss-react/mui';

export const DesirabilityButton = withStyles(Button, theme => ({
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
}));