import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => ({
  tagItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    borderRadius: '6px',
    padding: '3.4px 6px',
    backgroundColor: '#F2F4FB',
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
    width: '31%',
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
    height: '336px',
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
    color: '#5FA077',
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
    width: '65%',
    '@media (max-width: 600px)': {
      width: '100%',
    },
  },
  scrollableTags: {
    overflowY: 'auto',
    height: '100%',
    border: '1px solid #DADADA',
    borderRadius: '4px',
    padding: '4px',
  },
  charactersCounter: {
    textAlign: 'right',
    color: '#252733',
    fontSize: '12px',
  },
  testMessageWrapper: {
    width: '100%',
    marginTop: '18px',
    border: '1px solid #DADADA',
    padding: '18px 16px',
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
  testMessage: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  buttonsWrapper: {
    display: 'flex',
    gap: '12px',
  },
  copyWrapper: {
    display: 'flex',
    alignItems: 'center',
    margin: '7.5px 0',
    fontWeight: 'bold',
  },
  copyText: {
    fontSize: '12px',
    color: '#7898FF',
    textTransform: 'uppercase',
  },
  infoIcon: {
    display: 'flex',
  },
  numberForm: {
    display: 'flex',
    gap: 4,
    alignItems: 'center',
  },
  sendButton: {
    borderRadius: '4px',
    border: '1px solid #DADADA',
  },
}));
