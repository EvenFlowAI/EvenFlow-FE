import { FormControlLabel, styled } from "@mui/material";

import withStyles from '@mui/styles/withStyles';

export const SwitcherLabel = withStyles({
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
})(FormControlLabel);

export const Wrapper = styled('div')({
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: "center",
    "& > button": {
        marginLeft: 24,
        marginRight: 17,
    }
})