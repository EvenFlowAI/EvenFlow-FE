import { TableCell as TC } from '@mui/material';

import { withStyles } from 'tss-react/mui';

export const TableCellWithPadding = withStyles(TC, {
  root: {
    padding: '12px 16px !important',
  },
});
