import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => ({
  backWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    '&> span': {
      lineHeight: 'normal',
    },
  },
  title: {
    fontWeight: '700',
    fontSize: '18px',
    textAlign: 'center',
    margin: 0,
    textTransform: 'uppercase',
    marginLeft: '200px',
  },
  inputWrapper: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    gap: '14px',
    marginTop: '12px',
  },
}));
