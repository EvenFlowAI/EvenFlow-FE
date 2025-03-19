import { makeStyles } from 'tss-react/mui';

//
export const useStyles = makeStyles()(() => ({
  laborPerHour: {
    width: 'fit-content',
    fontSize: 18,
    fontWeight: 'bold',
    background: '#FFFFFF',
    borderRadius: 3,
    padding: 16,
    marginBottom: 30,
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
}));
