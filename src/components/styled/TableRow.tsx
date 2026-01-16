import { TableRow as TR } from '@mui/material';

import { withStyles } from 'tss-react/mui';

export const TableRow = withStyles(TR, theme => ({
  root: {
    '&:nth-child(2n) .MuiTableCell-root': {
      backgroundColor: '#F2F3F7',
    },
    '& .MuiButton-root': {
      textTransform: 'none',
      fontSize: 14,
    },
    '&.MuiTableRow-head': {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
  },
}));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const TableRowWithoutBorder = withStyles(TR, theme => ({
  root: {
    '&:nth-child(2n) .MuiTableCell-root': {
      backgroundColor: '#F2F3F7',
    },
    '& .MuiButton-root': {
      textTransform: 'none',
      fontSize: 14,
    },
    '&.MuiTableRow-head': {
      borderBottom: `none`,
    },
  },
}));
