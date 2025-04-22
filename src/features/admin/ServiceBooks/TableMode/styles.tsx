import { styled } from '@mui/material';

export const Wrapper = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  borderBottom: '1px solid #DADADA',
  paddingTop: 30,
});

interface ModeItemProps {
  isActive: boolean;
}

export const ModeItem = styled('div')<ModeItemProps>(({ isActive }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  borderBottom: isActive ? '4px solid #7898FF' : '4px solid transparent',
  cursor: 'pointer',
  width: 70,
  textAlign: 'center',
  height: 30,
  fontFamily: 'Proxima Nova',
  fontWeight: 700,
  fontSize: 14,
  lineHeight: '100%',
  letterSpacing: '0.2px',
  color: isActive ? '#252733' : '#858585',
}));
