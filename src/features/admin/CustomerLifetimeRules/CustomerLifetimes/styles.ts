import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(theme => ({
  group: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  label: {
    color: theme.palette.text.primary,
    marginBottom: 6,
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
}));
