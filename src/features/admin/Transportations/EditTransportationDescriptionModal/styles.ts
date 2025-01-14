import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => ({
  actionsWrapper: {
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
    color: '#212121',
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
  upperRowWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 20,
    '& > div': {
      width: '100%',
    },
  },
  bottomRowWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 20,
    '& > div': {
      width: '100%',
    },
  },
}));
