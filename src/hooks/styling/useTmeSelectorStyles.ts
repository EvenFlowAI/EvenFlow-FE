import { makeStyles } from 'tss-react/mui';

export const useTimeSelectorStyles = makeStyles()(theme => ({
  wrapper: {
    maxHeight: '40vh',
    overflowY: 'auto',
    [theme.breakpoints.down('sm')]: {
      maxHeight: '30vh',
    },
  },
  titleWrapper: {
    display: 'flex',
    gap: 34,
    alignItems: 'center',
    fontSize: 16,
    [theme.breakpoints.down('mdl')]: {
      justifyContent: 'space-between',
      marginBottom: 13,
    },
  },
  title: {
    textTransform: 'uppercase',
    [theme.breakpoints.down('mdl')]: {
      margin: 0,
    },
  },
  boldText: {
    textTransform: 'uppercase',
    fontWeight: 700,
  },
}));
