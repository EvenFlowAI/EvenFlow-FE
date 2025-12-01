import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => ({
  wrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  agent: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    width: '30%',
    padding: '24px',
  },
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
