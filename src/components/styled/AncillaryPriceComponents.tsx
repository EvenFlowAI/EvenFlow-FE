import { TableCell as TC } from "@mui/material";

import { withStyles } from 'tss-react/mui';

export const TableCell = withStyles(TC, {
    root: {
        padding: "12px 16px !important",
    }
});

export const HeaderTableCell = withStyles(TableCell, {
    root: {
        color: '#9FA2B4',
        fontSize: 16,
        '& .distanceCell': {
            display: 'flex',
            flexDirection: 'column',
            lineHeight: '15px',
            textTransform: 'none',
        }
    }
});

export const LastTableCell = withStyles(TableCell, {
    root: {
        padding: '16px 0 !important'
    }
});

export const FirstCell = withStyles(TableCell, {
    root: {
        padding: "16px 0 !important",
    }
});