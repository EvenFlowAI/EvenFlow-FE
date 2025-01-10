import { styled } from '@mui/material';
import theme from '../../theme/theme';

export const DateSelectArrow = styled('div')<{ disabled?: boolean }>(({ disabled }) => ({
  border: '1px solid #DADADA',
  width: 30,
  height: 30,
  flexShrink: 0,
  opacity: disabled ? 0.5 : 1,
  display: 'flex',
  marginTop: 35,
  alignItems: 'center',
  justifyContent: 'center',
  cursor: disabled ? 'default' : 'pointer',
  [theme.breakpoints.down('mdl')]: {
    marginTop: 38,
  },
}));
