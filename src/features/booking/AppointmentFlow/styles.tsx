import { styled } from '@mui/material';
import theme from '../../../theme/theme';

export const Container = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  minHeight: '100%',
  padding: 20,
  maxWidth: 1280,
  margin: 'auto',
  [theme.breakpoints.down('mdl')]: {
    paddingBottom: 81,
  },
});

export const SidebarWrapper = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 3fr',
  gap: '20px',
  alignItems: 'flex-start',
  width: '100%',
  marginTop: 28,
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
}));
