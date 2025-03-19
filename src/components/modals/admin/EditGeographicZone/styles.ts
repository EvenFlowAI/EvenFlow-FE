import { makeStyles } from 'tss-react/mui';

//
export const useStyles = makeStyles()(() => ({
  text: {
    display: 'flex',
    justifyContent: 'center',
    padding: '16px 0 36px 0',
    fontWeight: 'bold',
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: 14,
  },
  buttonsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelButton: {
    color: '#9FA2B4',
    marginRight: 20,
    border: 'none',
    outline: 'none',
  },
  saveButton: {
    background: '#7898FF',
    color: 'white',
    border: '1px solid #7898FF',
    outline: 'none',
    '&:hover': {
      color: '#7898FF',
    },
  },
  addZipBtn: {
    textTransform: 'none',
    marginLeft: 16,
    backgroundColor: '#F7F8FB',
    color: '#AEBEF2',
  },
  fieldWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 16,
  },
  zipsWrapper: {
    marginTop: 8,
  },
  zip: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  zipCode: {
    fontSize: 15,
  },
  zipActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& > svg': {
      marginLeft: 8,
      cursor: 'pointer',
    },
  },
}));
