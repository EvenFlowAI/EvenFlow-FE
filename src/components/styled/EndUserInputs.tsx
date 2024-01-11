import { TextField as TF } from "@mui/material";

import withStyles from '@mui/styles/withStyles';

export const TextField = withStyles({
    root: {
        "&::placeholder": {
            textTransform: "uppercase"
        },
        "&>div": {
            borderRadius: 2,
            fontWeight: "bold",
        }
    },
})(TF);