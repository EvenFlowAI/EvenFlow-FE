import { makeStyles } from 'tss-react/mui';
import { mh400, mh600 } from '../constants';

//
export const useStyles = makeStyles()(theme => ({
  button: {
    height: '100%',
    maxHeight: 465,
    fontWeight: 'bold',
    fontSize: 32,
    textAlign: 'center',
    padding: '7% 7% 9% 7%',
    border: '1px solid #DADADA',
    background: '#FFFFFF',
    transition: theme.transitions.create(['box-shadow']),
    '&:hover': {
      boxShadow: '0 2px 8px rgba(0,0,0,.1)',
    },
    [mh600]: {
      fontSize: 22,
      padding: '7%',
    },
    [mh400]: {
      fontSize: 18,
      padding: '2%',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 18,
      padding: '5%',
    },
  },
  submitButton: {
    minWidth: 144,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      '&:last-child': {
        marginBottom: theme.spacing(2),
        marginTop: theme.spacing(2),
      },
    },
  },
}));
