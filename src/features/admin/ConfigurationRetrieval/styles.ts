import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(theme => ({
  wrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
    width: '100%',

    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  },
  panel: {
    backgroundColor: theme.palette.common.white,
    border: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(2),
  },
  query: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    width: 240,
    flexShrink: 0,

    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  results: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    minWidth: 0,
  },
  wrapperEmpty: {
    alignItems: 'stretch',
  },
  headerText: {
    margin: 0,
    fontSize: 16,
    fontWeight: 700,
    textTransform: 'uppercase',
    color: '#252733',
  },
  queryHeader: {
    color: '#5E5F66',
  },
  resultsHeader: {
    textAlign: 'center',
  },
  emptyResults: {
    display: 'flex',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    color: '#5E5F66',
    textAlign: 'center',
  },
  submitButton: {
    marginTop: theme.spacing(1),
  },
  resultsContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  resultTabs: {
    alignSelf: 'flex-start',
    gap: 4,
    padding: 4,
    borderRadius: 10,
    backgroundColor: '#F0F3FC',
    '& .MuiToggleButtonGroup-grouped': {
      margin: 0,
      border: 'none',
      borderRadius: 8,
      '&:not(:first-of-type)': {
        marginLeft: 0,
        borderLeft: 'none',
        borderRadius: 8,
      },
      '&:not(:last-of-type)': {
        borderRadius: 8,
      },
    },
    '& .MuiToggleButton-root': {
      textTransform: 'none',
      fontSize: 14,
      fontWeight: 700,
      lineHeight: '20px',
      padding: theme.spacing(0.75, 2.5),
      color: '#546AB3',
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: 'rgba(120, 152, 255, 0.12)',
      },
      '&.Mui-selected, &.Mui-selected:hover': {
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
      },
    },
  },
  toolbar: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    gap: theme.spacing(1),
    overflowX: 'auto',
  },
  toolbarActions: {
    display: 'flex',
    flexShrink: 0,
    gap: theme.spacing(1),
    marginLeft: 'auto',
    '& .MuiButton-root': {
      whiteSpace: 'nowrap',
    },
  },
  checkbox: {
    color: theme.palette.text.secondary,
  },
  disabledText: {
    color: theme.palette.text.disabled,
  },
  resultsTable: {
    // Op Codes rows are 48px high: 38px small checkbox + 5px vertical cell padding.
    '& .MuiTableRow-root': {
      height: 48,
    },
    '& .MuiTableCell-root': {
      paddingLeft: 16,
      paddingRight: 16,
    },
    '& .MuiTableCell-head': {
      color: '#000000',
    },
    '& .MuiTableBody-root .MuiTableRow-root:nth-of-type(even), & .MuiTableBody-root .MuiTableRow-root:nth-of-type(even) .MuiTableCell-root':
      {
        backgroundColor: '#F2F4FB',
      },
  },
  searchField: {
    flex: '1 1 180px',
    minWidth: 140,
  },
  filterField: {
    flex: '0 0 160px',
  },
  filterPaper: {
    '& .MuiAutocomplete-option[aria-selected="true"], & .MuiAutocomplete-option[aria-selected="true"].Mui-focused':
      {
        backgroundColor: 'transparent',
      },
    '& .MuiAutocomplete-option.Mui-focused': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  status: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    whiteSpace: 'nowrap',
  },
  configured: {
    color: '#5FA077',
  },
  disabledStatus: {
    opacity: 0.5,
  },
  notConfigured: {
    color: '#C71062',
  },
  loadingWrapper: {
    display: 'flex',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
