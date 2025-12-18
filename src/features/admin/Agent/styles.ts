import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => ({
  wrapper: {
    marginTop: '28px',
    width: '100%',
  },
  nav: {
    textAlign: 'left',
    fontSize: '24px',
    margin: '0',
    display: 'flex',
  },
  navGeneralAgents: {
    margin: '0',
    cursor: 'pointer',
  },
  navAgentName: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  navSeparator: {
    margin: '0 8px',
  },
  agentTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '24px',
  },
}));
