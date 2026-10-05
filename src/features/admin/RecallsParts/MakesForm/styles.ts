import { makeStyles } from 'tss-react/mui';

export const useMakesFormStyles = makeStyles()(theme => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  autocomplete: {
    width: 380,
    '& .MuiAutocomplete-inputRoot': {
      flexWrap: 'nowrap',
      overflow: 'hidden',
      padding: '0 56px 0 6px !important',
      height: 40,
      boxSizing: 'border-box',
    },
    '& .MuiAutocomplete-input': {
      minWidth: '60px !important',
    },
  },
  autocompleteError: {
    '& .MuiInputBase-root': {
      border: '1px solid #F50057',
    },
  },
  chip: {
    backgroundColor: '#7898FF',
    color: theme.palette.common.white,
    fontWeight: 700,
    borderRadius: 4,
    margin: 2,
    flexShrink: 0,
    maxWidth: 120,
    '& .MuiChip-deleteIcon': {
      color: theme.palette.common.white,
      '&:hover': {
        color: '#E8ECFF',
      },
    },
  },
  moreChip: {
    backgroundColor: '#E8ECFF',
    color: '#7898FF',
    fontWeight: 700,
    borderRadius: 4,
    margin: 2,
    flexShrink: 0,
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    fontSize: 16,
  },
  checkbox: {
    padding: 4,
  },
  footer: {
    display: 'flex',
    gap: theme.spacing(2),
    padding: theme.spacing(1.5, 2),
    borderTop: '1px solid #E5E5E5',
  },
  cancelButton: {
    flex: 1,
    fontWeight: 700,
    color: theme.palette.text.primary,
  },
  addButton: {
    flex: 1,
    fontWeight: 700,
    background: '#7898FF',
    color: theme.palette.common.white,
    '&:hover': {
      background: '#5F7FEF',
    },
  },
  error: {
    margin: 0,
    width: 364,
    fontSize: 14,
    color: '#E3256B',
  },
}));
