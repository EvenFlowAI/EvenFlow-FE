import { withStyles } from 'tss-react/mui';
import { StyledTable } from './StyledTable';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const MakeCodeTable = withStyles(StyledTable, theme => ({
  root: {
    // border: `1px solid ${theme.palette.divider}`,
    '& .MuiTableCell-head': {
      textAlign: 'left',
      color: '#858585',
      textTransform: 'none',
    },
    '& .MuiTableCell-body': {
      textAlign: 'left',
    },
    '& .MuiTableRow-head': {
      borderBottom: 'none',
    },
  },
}));
