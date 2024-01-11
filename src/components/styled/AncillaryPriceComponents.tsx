import { TableCell as TC } from "@mui/material";

import withStyles from '@mui/styles/withStyles';

export const TableCell = withStyles({
    root: {
        border: "none !important",
        padding: "12px 16px !important",
    }
})(TC);

export const HeaderTableCell = withStyles({
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
})(TableCell)

export const FirstCell = withStyles(({
    root: {
        color: '#9FA2B4',
    }
}))(TableCell)