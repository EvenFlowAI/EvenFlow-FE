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
  topBtnWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 24,
  },
  dateWrapper: {
    display: 'flex',
    paddingLeft: '24px',
    marginTop: '24px',
  },
}));
