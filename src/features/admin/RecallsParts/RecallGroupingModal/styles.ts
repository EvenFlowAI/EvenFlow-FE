import { makeStyles } from 'tss-react/mui';

const ROW_GRID = '24px 32px 1fr 1.4fr 70px 90px';

export const useRecallGroupingStyles = makeStyles()(theme => ({
  title: {
    display: 'block',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 700,
    padding: '20px 40px 8px',
  },
  content: {
    padding: '0 24px',
  },
  toolbar: {
    display: 'flex',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1.5),
  },
  toolbarButton: {
    fontSize: 14,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  toolbarButtonActive: {
    background: '#EEF1FF',
  },
  panel: {
    background: '#F2F4FB',
    padding: theme.spacing(1.5, 2, 2),
    marginBottom: theme.spacing(2),
    position: 'relative',
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: theme.spacing(1.5),
  },
  panelClose: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  panelBody: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
  },
  option: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(0.5),
    background: theme.palette.common.white,
    border: '1px solid #DADADA',
    borderRadius: 4,
    padding: theme.spacing(0.5, 1.5, 1, 0.5),
    cursor: 'pointer',
    flex: 1,
    maxWidth: 290,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginTop: 9,
  },
  optionDescription: {
    fontSize: 12,
    color: '#858585',
  },
  panelAction: {
    marginLeft: 'auto',
    alignSelf: 'flex-start',
  },
  header: {
    display: 'flex',
    color: '#858585',
    fontSize: 12,
    padding: theme.spacing(1, 0),
  },
  headerGroupCell: {
    width: 140,
    fontSize: 14,
    color: '#858585',
    flexShrink: 0,
  },
  headerRow: {
    flex: 1,
    fontSize: 14,
    display: 'grid',
    gridTemplateColumns: ROW_GRID,
    paddingRight: 40,
  },
  group: {
    display: 'flex',
    alignItems: 'stretch',
    border: '1px solid #E5E5E5',
    marginBottom: 4,
  },
  groupLabel: {
    width: 140,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1.5),
    fontSize: 13,
    borderRight: '1px solid #E5E5E5',
  },
  groupItems: {
    flex: 1,
    minHeight: 40,
  },
  groupItemsDraggingOver: {
    background: '#F5F7FF',
  },
  groupDelete: {
    width: 40,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderLeft: '1px solid #E5E5E5',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: ROW_GRID,
    alignItems: 'center',
    minHeight: 40,
    fontSize: 13,
    background: theme.palette.common.white,
    borderBottom: '1px solid #E5E5E5',
    '&:last-of-type': {
      borderBottom: 'none',
    },
  },
  rowDragging: {
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    border: '1px solid #E5E5E5',
  },
  dragHandle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#BDBDBD',
    cursor: 'grab',
  },
  checkbox: {
    padding: 4,
  },
  actionsWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(2),
    paddingTop: theme.spacing(1),
  },
  saveButton: {
    background: '#7898FF',
    color: theme.palette.common.white,
    border: '1px solid #7898FF',
    '&:hover': {
      color: '#7898FF',
    },
  },
}));
