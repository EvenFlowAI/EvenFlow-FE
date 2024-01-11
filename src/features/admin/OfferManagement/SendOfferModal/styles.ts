import { FormLabel } from "@mui/material";

import withStyles from '@mui/styles/withStyles';

export const Label = withStyles(theme => ({
    root: {
        textTransform: "uppercase",
        fontSize: 12,
        fontWeight: "bold",
        color: theme.palette.text.primary
    }
}))(FormLabel);