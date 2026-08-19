import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(theme => ({
  columns: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing(2),
  },
  column: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1.5),
    minWidth: 0,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1.5),
  },
  titleRowRight: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  helperText: {
    fontSize: 14,
    color: '#252733',
    fontWeight: 400,
    textTransform: 'none',
  },
  search: {
    marginBottom: theme.spacing(1.5),
  },
  divider: {
    margin: theme.spacing(1.5, 0, 2, 0),
  },
  listHeader: {
    display: 'grid',
    gridTemplateColumns: '36px minmax(80px, 110px) minmax(130px, 1fr) minmax(88px, 100px)',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(0.75, 1),
    borderRadius: theme.spacing(0.75),
    backgroundColor: theme.palette.action.hover,
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  selectedHeader: {
    gridTemplateColumns: '32px minmax(80px, 110px) minmax(130px, 1fr) minmax(88px, 100px) 32px',
  },
  listBody: {
    marginTop: theme.spacing(1),
    maxHeight: 280,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(0.75, 1),
    '&:hover': {
      background: '#F7F8FB',
    },
  },
  selectedRow: {
    gridTemplateColumns: '32px 28px minmax(180px, 1fr) minmax(88px, 100px) 32px',
  },
  orderIndex: {
    fontSize: 16,
    fontWeight: 400,
    color: '#252733',
  },
  codeStack: {
    width: 227,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  codeInline: {
    fontSize: 14,
    fontWeight: 700,
    lineHeight: '18px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  descriptionInline: {
    fontSize: 12,
    lineHeight: '16px',
    color: '#252733',
    textTransform: 'uppercase',
  },
  code: {
    fontWeight: 700,
    fontSize: 14,
  },
  description: {
    textTransform: 'uppercase',
    width: 260,
    fontSize: 12,
  },
  price: {
    textAlign: 'right',
    width: 60,
    fontSize: 14,
  },
  dragHandle: {
    color: theme.palette.text.secondary,
    cursor: 'grab',
  },
  emptyState: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    fontSize: 13,
  },
}));
