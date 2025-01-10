import { FormLabel, styled } from '@mui/material';

import { withStyles } from 'tss-react/mui';

export const TableWrapper = styled('div')(({ theme }) => ({
  width: '100%',
  overflowX: 'auto',
  '& .MuiTableCell-root': {
    [theme.breakpoints.down('sm')]: {
      fontSize: '10px !important',
    },
  },
}));

export const Label = withStyles(FormLabel, {
  root: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
    textTransform: 'uppercase',
    color: '#9FA2B4',
  },
});

export const Title = styled('h4')({
  fontSize: 16,
  fontWeight: 'bold',
  textTransform: 'uppercase',
  margin: 16,
});
