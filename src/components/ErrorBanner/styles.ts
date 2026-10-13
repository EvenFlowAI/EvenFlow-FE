import { makeStyles } from 'tss-react/mui';
import { NOTIFICATION_BACKGROUND_COLOR, NOTIFICATION_TEXT_COLOR } from './constants';

export const useStyles = makeStyles()(theme => ({
  list: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
  },
  banner: {
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: '4px',
    fontWeight: 700,
    gap: theme.spacing(2),
    padding: theme.spacing(1.5, 2),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1, 1.5),
    },
  },
  error: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
  notification: {
    backgroundColor: NOTIFICATION_BACKGROUND_COLOR,
    color: NOTIFICATION_TEXT_COLOR,
  },
  message: {
    margin: 0,
    flex: 1,
    fontSize: 16,
    lineHeight: '22px',
    wordBreak: 'break-word',
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
      lineHeight: '20px',
    },
  },
  closeButton: {
    color: 'inherit',
    padding: theme.spacing(0.5),
    flexShrink: 0,
  },
}));
