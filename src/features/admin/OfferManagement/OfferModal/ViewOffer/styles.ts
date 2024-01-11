import { FormControlLabel } from "@mui/material";

import withStyles from '@mui/styles/withStyles';

export const Label = withStyles({
    root: {
        marginLeft: 0,
    },
    label: {
        fontWeight: "bold"
    }
})(FormControlLabel);