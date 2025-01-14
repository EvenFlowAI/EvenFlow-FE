import { makeStyles } from 'tss-react/mui';
import { mh600 } from '../CustomerSelect/constants';

export const useStyles = makeStyles()(theme => ({
  container: {
    width: '100vw',
    minHeight: 0,
    padding: '5% 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    [mh600]: {
      padding: '2% 0',
    },
    [theme.breakpoints.down('sm')]: {
      padding: 0,
    },
  },
  title: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 32,
    margin: 0,
    textAlign: 'center',
    [theme.breakpoints.down('mdl')]: {
      fontSize: 20,
    },
  },
  paper: {
    borderRadius: 4,
    maxWidth: 990,
    width: '70%',
    maxHeight: '100%',
    overflowY: 'auto',
    padding: '5%',
    backgroundColor: 'rgba(255,255,255,.8)',
    [mh600]: {
      padding: '2%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      height: '100%',
      paddingTop: theme.spacing(6),
    },
  },
}));
