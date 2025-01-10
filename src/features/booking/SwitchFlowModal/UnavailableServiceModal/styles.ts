import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(theme => ({
  info: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
    marginBottom: 20,
    paddingRight: 12,
  },
  button: {
    paddingRight: 24,
    paddingLeft: 24,
  },
}));
