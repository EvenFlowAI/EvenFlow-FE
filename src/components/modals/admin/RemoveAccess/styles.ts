import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(theme => ({
  description: {
    fontSize: 14,
    color: '#252733',
    marginBottom: theme.spacing(3),
  },
  searchWrapper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  searchField: {
    height: 43,
    width: '100%',
  },
  listWrapper: {
    maxHeight: 330,
    overflowY: 'auto',
    paddingRight: theme.spacing(1),
    gap: 8,
    display: 'flex',
    flexDirection: 'column',
  },
  dealershipBlock: {},
  dealershipHeader: {
    background: '#F2F4FB',
    marginRight: 73,
    paddingRight: 8,
    marginLeft: 73,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dealershipLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  dealershipName: {
    display: 'flex',
    margin: 0,
    fontSize: 16,
    color: '#252733',
    alignItems: 'center',
    gap: 12,
    fontWeight: 700,
  },
  serviceCenterName: {
    fontSize: 18,
    fontWeight: 400,
    margin: 0,
    color: '#252733',
  },
  serviceCenterCount: {
    margin: 0,
    fontSize: 12,
    fontWeight: 400,
    color: '#5E5F66',
  },
  toggleButton: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: 0,
    background: 'transparent',
    border: 0,
  },
  serviceCentersWrapper: {
    // paddingLeft: theme.spacing(4),
  },
  serviceCenterRow: {
    display: 'flex',
    alignItems: 'center',
  },
  emptyState: {
    fontSize: 16,
    color: '#252733',
    textAlign: 'center',
  },
}));
