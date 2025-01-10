import { Button, styled } from '@mui/material';

export const TextButton = styled(Button)({
  fontSize: 14,
  fontWeight: 700,
  color: '#252733',
});

export const ButtonsWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  '& > button:not(:last-child)': {
    marginRight: 16,
  },
});
