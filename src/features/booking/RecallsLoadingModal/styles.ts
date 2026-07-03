import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    padding: '32px 0',
  },
  loading: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
    textAlign: 'center',
    marginBottom: 16,
    color: '#202021',
  },
  subTitle: {
    fontSize: 16,
    color: '#828282',
    textAlign: 'center',
  },
}));
