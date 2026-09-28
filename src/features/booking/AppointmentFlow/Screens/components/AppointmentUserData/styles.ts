import { styled } from '@mui/material';

export const Wrapper = styled('div')({
  '& label': {
    marginTop: 12,
  },
});

export const TitleRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  '& button': {
    minWidth: 0,
    padding: 0,
    textTransform: 'none',
  },
}));

export const ProfileTypeWrapper = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(1),
  '& .MuiFormControlLabel-root': {
    marginLeft: 0,
    marginRight: theme.spacing(3),
  },
  '& .MuiRadio-root': {
    paddingLeft: 0,
  },
}));
