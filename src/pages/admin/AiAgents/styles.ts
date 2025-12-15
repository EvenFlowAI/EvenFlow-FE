import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '16px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  redirectButton: {
    color: 'rgba(120, 152, 255, 1)',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    margin: '0',
    cursor: 'pointer',
  },
  agentAvailability: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 24px 0',
  },
}));
