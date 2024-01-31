import { TableCell as TC } from "@mui/material";

import { withStyles } from 'tss-react/mui';

export const TableCell = withStyles(TC, {
    root: {
        border: "none !important",
        padding: "12px 16px !important",
    }
});

export const HeaderTableCell = withStyles(TableCell, {
    root: {
        color: '#9FA2B4',
        '& .distanceCell': {
            display: 'flex',
            flexDirection: 'column',
            fontSize: 12,
            lineHeight: '15px',
            '& > span': {
                fontWeight: 400
            }
        }
    }
});

export const FirstCell = withStyles(TableCell, {
    root: {
        color: '#9FA2B4',
    }
});