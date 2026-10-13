import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
  },
  SERVICE_BOOK: {
    textTransform: 'capitalize',
    width: '160px',
  },
  PLAY_NAME: {
    textTransform: 'capitalize',
    width: '214px',
  },
  PLAY: {
    textTransform: 'capitalize',
    width: '150px',
  },
  AUDIENCE: {
    textTransform: 'capitalize',
    width: '150px',
  },
  TEXT: {
    textTransform: 'capitalize',
    width: '150px',
  },
  ACTIVE: {
    textTransform: 'capitalize',
    width: '176px',
  },
  REMOVE: {
    textTransform: 'capitalize',
    width: '120px',
  },
  textRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  removeBlock: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPlayRow: {
    width: '100%',
    display: 'flex',
    marginLeft: '164px',
    color: '#546AB3',
    textTransform: 'uppercase',
    fontWeight: 700,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  addPlayText: {
    margin: 0,
    cursor: 'pointer',
  },
  // Explicit alternation classes so the "Add Play" divider row doesn't
  // shift the nth-child based striping of the actual data rows.
  rowEven: {
    '&.MuiTableRow-root .MuiTableCell-root': {
      backgroundColor: '#FFFFFF !important',
    },
  },
  rowOdd: {
    '&.MuiTableRow-root .MuiTableCell-root': {
      backgroundColor: '#F2F3F7 !important',
    },
  },
  addPlayCell: {
    backgroundColor: '#F7F8FB !important',
  },
  eventInput: {
    '@media (max-width: 900px)': {
      width: '135px',
    },
  },
  modalBodyContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldWrapper: {
    width: '500px',
  },
  errorText: {
    fontSize: 14,
    color: '#F50057',
  },
}));
