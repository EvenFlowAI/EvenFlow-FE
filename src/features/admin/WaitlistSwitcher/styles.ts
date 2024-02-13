import { FormControlLabel, styled } from "@mui/material";

import { withStyles } from 'tss-react/mui';

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

export const Wrapper = styled('div')({
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: "center",
    "& > button": {
        marginLeft: 24,
        marginRight: 17,
    }
})