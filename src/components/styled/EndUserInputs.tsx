import { TextField as TF } from "@mui/material";

import { withStyles } from 'tss-react/mui';

export const TextField = withStyles(TF, {
    root: {
        "&::placeholder": {
            textTransform: "uppercase"
        },
        "&>div": {
            borderRadius: 2,
            fontWeight: "bold",
        }
    },
});

export const TextFieldWhite = withStyles(TF, {
    root: {
        "&::placeholder": {
            textTransform: "uppercase"
        },
        "&>div": {
            borderRadius: 2,
            fontWeight: "bold",
            backgroundColor: "#FFFFFF",
            "& > textarea": {
                backgroundColor: "#FFFFFF",
            }
        },
    },
});