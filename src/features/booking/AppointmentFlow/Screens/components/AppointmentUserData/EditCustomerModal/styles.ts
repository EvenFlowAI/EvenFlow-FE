import { styled } from '@mui/material';

export const FieldWrapper = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
  '& label': {
    marginTop: 0,
    fontSize: 14,
    fontWeight: 700,
  },
  '& input': {
    border: `1px solid #828282`,
  },
}));

export const PhoneHeader = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 191px',
  gap: theme.spacing(1),
  marginTop: 16,
  paddingBottom: theme.spacing(0.75),
  fontSize: 12,
  color: '#202021',
  fontWeight: 700,
  textTransform: 'uppercase',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr 110px',
  },
}));

export const PhoneTable = styled('div', {
  shouldForwardProp: property => property !== 'hasError',
})<{ hasError: boolean }>(({ theme, hasError }) => ({
  border: `1px solid ${hasError ? theme.palette.error.main : theme.palette.divider}`,
}));

export const PhoneRow = styled('div', {
  shouldForwardProp: property => property !== 'selected',
})<{ selected: boolean }>(({ theme, selected }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  minHeight: 42,
  padding: theme.spacing(0.5, 1.5),
  backgroundColor: selected ? '#F6F6F6' : 'transparent',
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 0,
  },
  '& .MuiFormControlLabel-root': {
    justifyContent: 'center',
    margin: 0,
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.5, 1),
  },
}));

export const PhoneLabel = styled('span')({
  fontSize: 13,
  fontWeight: 600,
  width: 44,
  display: 'block',
  marginRight: '24px',
});

export const PhoneInput = styled('input')(({ theme }) => ({
  boxSizing: 'border-box',
  width: '210px',
  minWidth: 0,
  marginRight: 12,
  padding: theme.spacing(0.75, 1),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 4,
  backgroundColor: theme.palette.background.paper,
  font: 'inherit',
  fontSize: 13,
  '&:focus': {
    borderColor: '#eeeeee',
    outline: 0,
  },
}));

export const CommunicationHint = styled('div')(({ theme }) => ({
  margin: theme.spacing(1, 0, 1.5),
  width: '100%',
  display: 'block',
  marginLeft: 'auto',
  color: '#142EA1',
  fontSize: 12,
  '& span': {
    marginRight: theme.spacing(0.5),
  },
}));

export const ActionsWrapper = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1, 3, 3),
  '& > div': {
    width: '100%',
  },
  '& button': {
    borderRadius: 0,
    fontWeight: 700,
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
    padding: theme.spacing(1, 2, 2),
  },
}));
