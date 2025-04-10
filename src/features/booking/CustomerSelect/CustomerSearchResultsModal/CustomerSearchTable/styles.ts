import { makeStyles } from 'tss-react/mui';
import { styled, Tooltip } from '@mui/material';
import { withStyles } from 'tss-react/mui';

//
export const useStyles = makeStyles()(() => ({
  tableWrapper: {
    height: 'calc(100vh - 300px)',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  wrapper: {
    borderTop: '1px solid #DADADA',
    borderLeft: '1px solid #DADADA',
    borderCollapse: 'unset',
    width: '100%',
  },
  tableContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    position: 'relative',
    marginBottom: 52, // Space for pagination
  },
  tableContent: {
    flex: 1,
    overflow: 'auto',
    maxHeight: 'calc(100vh - 352px)', // Adjusted to account for pagination
  },
  emptyWrapper: {
    height: 500,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  headerCell: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#202021',
    textTransform: 'uppercase',
    padding: '12px 8px',
    backgroundColor: '#F7F8FB',
    position: 'sticky',
    top: 0,
    zIndex: 1,
  },
  bodyCell: {
    fontSize: 12,
    color: '#202021',
    padding: '12px 8px',
    borderRight: '1px solid #DADADA',
  },
  greyRow: {
    height: 20,
    width: '100%',
  },
  input: {
    padding: 0,
    backgroundColor: 'transparent',
    fontSize: 12,
  },
  pagination: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    backgroundColor: '#fff',
    padding: '8px 0',
    borderTop: '1px solid #DADADA',
    zIndex: 3,
  },
  stickyLeftCell: {
    position: 'sticky',
    left: 0,
    zIndex: 3,
    fontSize: 12,
    color: '#202021',
    padding: '12px 8px',
    backgroundColor: '#F7F8FB',
    borderRight: '1px solid #DADADA',
  },
  stickyTHeadCell: {
    position: 'sticky',
    left: 0,
    zIndex: 4,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#202021',
    textTransform: 'uppercase',
    backgroundColor: '#F7F8FB',
    padding: '12px 8px',
    borderRight: '1px solid #DADADA',
    top: 0,
  },
}));

export const IconsBlock = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const HtmlTooltip = withStyles(Tooltip, {
  tooltip: {
    fontSize: 12,
    color: '#202021',
    padding: 8,
    background: '#F7F8FB',
    boxShadow: '1px 1px 3px grey',
  },
  popper: {
    borderRadius: 0,
  },
});
