import { withStyles } from 'tss-react/mui';
import { StyledTable } from './StyledTable';

export const DemandTable = withStyles(StyledTable, theme => ({
  root: {
    border: `1px solid ${theme.palette.divider}`,
  },
}));

export const DenseTable = withStyles(DemandTable, {
  root: {
    '& .MuiTableCell-root': {
      padding: 12,
      fontSize: 15,
    },
  },
});

export const DenseTableNormalFont = withStyles(DenseTable, {
  root: {
    '& .MuiTableCell-root': {
      fontSize: 16,
    },
  },
});

export const DenseTableWithPadding = withStyles(StyledTable, {
  root: {
    '& .MuiTableCell-root': {
      padding: 16,
      border: `1px solid #DADADA`,
    },
  },
});
