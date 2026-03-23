import { withStyles } from 'tss-react/mui';
import { StyledTable } from './StyledTable';

export const MakeCodeTable = withStyles(StyledTable, theme => ({
  root: {
    border: 'none',
    '& .MuiTableCell-head': {
      textAlign: 'left',
      color: theme.palette.text.secondary,
      textTransform: 'none',
      border: 'none',
    },
    '& .MuiTableCell-body': {
      textAlign: 'left',
      border: 'none',
    },
    '& .MuiTableRow-head': {
      borderBottom: 'none',
    },
  },
}));
