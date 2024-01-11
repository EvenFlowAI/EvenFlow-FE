import { FormControlLabel } from "@mui/material";

import withStyles from '@mui/styles/withStyles';

export const Label = withStyles({
    label: {
        fontWeight: "bold",
        color: '#7898FF',
        textTransform: 'uppercase',
        fontSize: 14,
    }
})(FormControlLabel);