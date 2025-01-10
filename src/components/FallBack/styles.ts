import { styled } from '@mui/material';

export const Wrapper = styled('div')({
  width: '100%',
  height: 'calc(100vh - 180px)',
  display: 'flex',
  flexDirection: 'column',
  gap: 56,
  alignItems: 'center',
  padding: 90,
  background: '#F7F8FB',
});

export const LogoWrapper = styled('div')({
  display: 'flex',
  alignItems: 'flex-end',
  padding: 12,
});

export const MainCard = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '64px 73px',
  background: '#FFFFFF',
  '.boldText': {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  '.img': {
    marginBottom: 32,
  },
  '.button': {
    borderRadius: 4,
    padding: '12px 16px',
    color: '#7898FF',
    border: '1px solid #7898FF',
    fontWeight: 'bold',
    fontSize: 14,
    textTransform: 'uppercase',
    textDecoration: 'none',
  },
  '.normalText': {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 36,
  },
});
