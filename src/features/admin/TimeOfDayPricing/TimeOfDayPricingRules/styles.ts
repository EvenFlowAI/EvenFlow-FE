import { makeStyles } from 'tss-react/mui';
import { styled } from '@mui/material';

export const useStyles = makeStyles()(theme => ({
  message: {
    fontSize: 14,
  },
  rowWrapper: {
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(2),
    },
  },
  tableWrapper: {
    padding: '16px 16px 0 16px',
  },
  dividersBlock: {
    height: 30,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    paddingBottom: 8,
  },
  divider: {
    borderRight: '1px solid #EAEBEE',
  },
}));

export const Title = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  fontSize: 16,
  fontWeight: 'bold',
  padding: 16,
});
