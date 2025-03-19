import { makeStyles } from 'tss-react/mui';

export const useDashboardStyles = makeStyles()(theme => ({
  paper: {
    display: 'flex',
    padding: theme.spacing(2),
    minHeight: 120,
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    borderRadius: 0,
    gap: '8px',
  },
  container: {
    width: '100%',
    maxWidth: theme.breakpoints.values.lg,
  },
  icon: {
    '& .MuiSvgIcon-root': {
      fontSize: 40,
    },
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    margin: 0,
    [theme.breakpoints.down('md')]: {
      fontSize: 14,
    },
  },
  edit: {
    cursor: 'pointer',
    alignSelf: 'flex-start',
    fontSize: 14,
    padding: 0,
    display: 'inline-block',
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    transition: theme.transitions.create(['color']),
    '&:hover': {
      color: theme.palette.primary.dark,
    },
    [theme.breakpoints.down('md')]: {
      alignSelf: 'center',
    },
  },
  address: {
    fontSize: 18,
    color: theme.palette.text.disabled,
    [theme.breakpoints.down('md')]: {
      textAlign: 'center',
    },
  },
  countWrapper: {
    display: 'flex',
    justifyContent: 'space-around',
    [theme.breakpoints.down('md')]: {
      flexWrap: 'wrap',
      '&>*': {
        textAlign: 'center',
        padding: theme.spacing(1),
        width: '50%',
      },
    },
  },
}));
