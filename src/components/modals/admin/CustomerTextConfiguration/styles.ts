import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => ({
  tagItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    borderRadius: '6px',
    padding: '3.4px 6px',
    backgroundColor: 'rgba(242, 244, 251, 1)',
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
    // height: '530px',
    justifyContent: 'space-between',
    '@media (max-width: 600px)': {
      flexDirection: 'column',
    },
  },
  integrationBlock: {
    width: '45%',
    height: 'fit-content',
    '@media (max-width: 600px)': {
      width: '100%',
    },
  },
  integrationWrapper: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 32,
  },
  tagsWrapper: {
    height: '456px',
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
    '@media (max-width: 600px)': {
      width: '100%',
    },
  },
  scrollableTags: {
    overflowY: 'auto',
    height: '100%',
  },
  charactersCounter: {
    textAlign: 'right',
    color: '#858585',
    fontWeight: 300,
  },
  testMessageWrapper: {
    width: '44%',
    marginTop: '18px',
  },
  testMessageText: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: 700,
    color: 'black',
    margin: 0,
    marginBottom: '4px',
  },
  testMessageButton: {
    marginTop: '12px',
    paddingLeft: 0,
    justifyContent: 'flex-start',
  },
  testMessage: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: ' space-between',
  },
  buttonsWrapper: {
    display: 'flex',
    gap: '12px',
  },
}));
