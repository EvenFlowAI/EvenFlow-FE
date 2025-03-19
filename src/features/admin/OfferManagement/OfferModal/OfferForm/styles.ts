import { makeStyles } from 'tss-react/mui';

//
export const useStyles = makeStyles()(theme => ({
  inputContainer: {
    marginTop: 10,
    '&:first-child': {
      marginTop: 0,
    },
  },
  rowContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexFlow: 'row nowrap',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'stretch',
      marginTop: theme.spacing(4),
    },
  },
  lastRowContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexFlow: 'row nowrap',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'stretch',
      marginTop: theme.spacing(4),
    },
  },
  innerContainer: {
    flexGrow: 1,
    flexBasis: 0,
  },
  divider: {
    padding: 10,
    [theme.breakpoints.down('sm')]: {
      visibility: 'hidden',
      height: theme.spacing(1),
    },
  },
  text: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
}));
