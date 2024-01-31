import { makeStyles } from 'tss-react/mui';
import { FormControlLabel, styled } from "@mui/material";

import { withStyles } from 'tss-react/mui';

export const useStyles = makeStyles()({
    summaryText: {
        display: 'flex',
        alignItems: 'center',
        padding: 16,
        fontWeight: 'bold',
        fontSize: 16,
    },
    cellsWrapper: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
    },
});

export const RowWrapper = styled('div')<{toggle: number}>(({toggle}) => ({
    width: '100%',
    display: 'grid',
    gridTemplateColumns: toggle ? '3fr 2fr 2fr' : '5fr 2fr',
    gap: 16,
}));

export const Label = withStyles(FormControlLabel, {
    root: {
        justifyContent: "flex-end",
        marginLeft: 0,
        marginRight: 0,
        justifySelf: 'flex-end'
    },
    label: {
        fontWeight: "bold",
        fontSize: 16,
        textTransform: "uppercase",
        color: "#3855F3",
    }
});