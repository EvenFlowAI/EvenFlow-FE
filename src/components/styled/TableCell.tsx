import { TableCell as TC } from '@mui/material';

import { withStyles } from 'tss-react/mui';

export const TableCell = withStyles(TC, {
  root: {
    border: 'none !important',
    padding: '12px 16px !important',
    textAlign: 'center',
  },
});

export const TableCellWithLittlePadding = withStyles(TC, {
  root: {
    border: 'none !important',
    padding: '1px 16px !important',
    textAlign: 'center',
  },
});

export const TableCellLeft = withStyles(TC, {
  root: {
    border: 'none !important',
    padding: '12px 16px !important',
    textAlign: 'left',
  },
});
