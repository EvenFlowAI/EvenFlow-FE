import { makeStyles } from 'tss-react/mui';

export const useViewGlobalRecallStyles = makeStyles()(theme => ({
  root: {
    padding: '24px 32px 32px 0',
    background: theme.palette.background.paper,
    borderRadius: '0',
  },
  titleWrapper: {
    marginBottom: theme.spacing(2),
    marginLeft: '32px',
  },
  title: {
    fontWeight: 700,
    fontSize: 24,
    margin: 0,
  },
  section: {
    marginBottom: theme.spacing(2),
  },
  label: {
    color: '#252733',
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  bigLabel: {
    color: '#252733',
    fontSize: 18,
    fontWeight: 700,
    margin: '20px 0 12px 0',
    textTransform: 'uppercase',
  },
  value: {
    color: theme.palette.text.primary,
    fontSize: 16,
    fontWeight: 400,
    marginBottom: theme.spacing(2),
    wordBreak: 'break-word',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    width: '280px',
  },
  divider: {
    margin: `${theme.spacing(2)} 0`,
  },
  riskFlags: {
    display: 'flex',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  riskFlag: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontWeight: 500,
    color: theme.palette.error.main,
    fontSize: 16,
  },
  models: {
    fontSize: 16,
    display: 'block',
    marginBottom: theme.spacing(2),
  },
  summary: {
    marginBottom: '20px',
    whiteSpace: 'pre-line',
  },
  remedy: {
    marginBottom: '20px',
    whiteSpace: 'pre-line',
  },
  safetyRisk: {
    marginBottom: '20px',
    whiteSpace: 'pre-line',
  },
}));
