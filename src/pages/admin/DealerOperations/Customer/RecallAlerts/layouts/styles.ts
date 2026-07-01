import { makeStyles } from 'tss-react/mui';

export const useHistoryRecallStyles = makeStyles()(theme => ({
  loadingContainer: {
    height: 70,
    marginTop: theme.spacing(2.5),
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
  },
  row: {
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(1.25),
    borderRadius: theme.spacing(5),
    backgroundColor: '#F2F4FB',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  eventName: {
    fontSize: '16px',
    color: '#252733',
  },
  eventDate: {
    color: '#5E5F66',
    fontSize: '12px',
  },
}));
