import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => ({
  tagItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  insertTag: {
    cursor: 'pointer',
    fontSize: 16,
  },
  copyTag: {
    border: 'none',
    outline: 'none',
    background: 'none',
    cursor: 'pointer',
  },
  wrapper: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  integrationBlock: {
    width: '45%',
  },
  integrationWrapper: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 32,
  },
  integrationText: {
    textTransform: 'uppercase',
    margin: 0,
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 8,
  },
  configuredComponent: {
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  configuredColor: {
    color: '#7898FF',
  },
  notConfiguredColor: {
    color: '#C71062',
  },
  insertTagText: {
    textTransform: 'uppercase',
    fontWeight: 700,
    fontSize: 12,
    display: 'block',
    marginBottom: 8,
  },
  textMessageWrapper: {
    width: '51%',
  },
  messageTextArea: {
    marginTop: 24,
  },
  charactersCounter: {
    textAlign: 'right',
    color: '#858585',
    fontWeight: 300,
  },
}));
