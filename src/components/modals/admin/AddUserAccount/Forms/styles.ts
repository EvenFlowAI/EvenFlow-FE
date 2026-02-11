import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => ({
  categoryWrapper: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginLeft: '24px',
    marginBottom: '8px',
    marginTop: '8px',
    fontSize: '18px',
  },
  category: {
    margin: 0,
    padding: 0,
  },
}));
