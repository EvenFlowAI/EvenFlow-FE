import { FormControlLabel } from "@mui/material";

import { withStyles } from 'tss-react/mui';

export const Label = withStyles(FormControlLabel, {
    label: {
        fontWeight: "bold",
        color: '#7898FF',
        textTransform: 'uppercase',
        fontSize: 14,
    }
});