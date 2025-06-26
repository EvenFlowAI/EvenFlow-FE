import { makeStyles } from 'tss-react/mui';

//
export const useStyles = makeStyles()(() => ({
  laborPerHour: {
    marginBottom: 20,
  },
  note: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 30,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  link: {
    color: 'blue',
    textDecoration: 'underline',
    marginLeft: 10,
    cursor: 'pointer',
  },
  backWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    '&> span': {
      lineHeight: 'normal',
    },
  },
}));
